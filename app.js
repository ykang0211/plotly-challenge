function buildPlot() {
  d3.json("samples.json").then(function(data) {
    console.log(data);

    var bar_values = data.sample_values.slice(0,10);
    var bar_labels = data.otu_ids.slice(0,10);
    var bar_hover = data.otu_labels.slice(0,10);

    var data = [{
      x: bar_values,
      y: bar_labels,
      hovertext: bar_hover,
      type: 'bar',
      orientation: 'h'
    }];

    Plotly.newPlot("bar", data);

  });
};

buildPlot();

  
// Build Bubble Chart
function buildPlot() {
  d3.json("samples.json").then(function(data) {
    console.log(data);
    
    var x = data.otu_ids;
    var y = data.sample_values;
    var markerSize = data.sample_values;
    var markerColors = data.otu_ids; 
    var textValues = data.otu_labels;

    console.log(data.otu_ids);

    var trace1 = {
      x: x,
      y: y,
      text: textValues,
      mode: 'markers',
      marker: {
        color: markerColors,
        size: markerSize
      } 
    };
  
    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot("bubble", data, layout);

  });
};
buildPlot();



// Dropdown Menu
function init() {

  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
};


function buildMetadata() {
  d3.json("samples.json").then(function(sample) {
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var demographic = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    demographic.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key, value]) {
      var row = demographic.append("p");
      row.text(`${key}: ${value}`);
    });
  });
};