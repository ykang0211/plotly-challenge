


function buildMetadata(_meta) {
  // d3.json("samples.json").then((importedData) => {
  //   console.log(importedData);
  //   var data = importedData;

  //   data.sort(function(a, b) {
  //     return parseFloat(b.names) - parseFloat(a.names);
  //   });

  //   data = data.slice(0,10);

  //   data = data.reverse();

  //   var trace1 = {
  //     x: data.map(row => row.otu_ids),
  //     y: data.map(row => row.otu_ids),
  //     text: data.map(row => row.otu_labels),
  //     mode: "markers",
  //     marker: {
  //       color: data.map(row => row.otu_ids),
  //       size: data.map(row => row.otu_ids)
  //     }
  //   };

  //   var chartData = [trace1];

  //   Plotly.newPlot("bar", chartData);

  // });


  d3.json("samples.json").then(function(data) {


    var demographic = d3.select("#sample-metadata");


    demographic.html("");

    Object.entries(data.metadata).forEach(function([key, value]) {
      var row = demographic.append("p");
      row.text(`${key}: ${value}`);
    });
});
};
// buildMetadata();

// Build Bubble Chart
function buildChart(_meta) {
  d3.json("samples.json").then((charts) => {
    console.log(charts);

    var samples = charts.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id);
    var otu_ids = resultArray.map(o_i => o_i.otu_ids);
    var otu_labels = resultArray.map(o_l => o_l.otu_labels);
    var sample_values = resultArray.map(s_v => s_v.sample_values);
    // var result = resultArray[0];
    // var otu_ids = result.otu_ids;
    // var otu_labels = result.otu_labels;
    // var sample_values = result.sample_values;

    var bar_values = sample_values.slice(0,10);
    var bar_labels = otu_ids.slice(0,10);
    var bar_hover = otu_labels.slice(0,10);

    var trace2 = {
      x: bar_values,
      y: bar_labels,
      hovertext: bar_hover,
      // x: charts.sample_values.slice(0,10),
      // y: charts.otu_ids.slice(0, 10),
      // hovertext: charts.otu_labels.slice(0, 10),
      type: "bar",
      orientation: "h"
    }

    var data_bar = [trace2];

    Plotly.newPlot("bar", data_bar);

    var trace1 = {
      x: bar_labels,
      y: bar_values,
      text: bar_hover,
      mode: "markers",
      marker: {
        color: bar_labels,
        size: bar_hover
      }
    };

    var data_bubble = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot("bubble", data_bubble, layout);



  });
};

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((dataNames) => {
    dataNames.names.forEach((_meta) => {
      selector.append("option").text(_meta).property("value", _meta);
    });

    var firstSample = dataNames.names[0];
    buildChart(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildChart(newSample);
  buildMetadata(newSample);
}

init();
