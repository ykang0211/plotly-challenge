# Interactive Visualizations with Python, D3.js, and Plotly.js

<br>

## Dashboard: Belly Button Biodiversity

Check out my [app](https://ykang0211.github.io/plotly-challenge/).

<br>

<div align='center'><img width='60%' src='images/dashboard.pne' alt='dashboard'></div>

<br>

## Overview

In this assignment, you will build an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels.
The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.

<br>

## Building Components of Interactive Dashboard

<br>

#### Prepare [app.js](app.js) with [Plotly JavaScript Open Source Graphing Library](https://plot.ly/javascript/)

My first step in writing my app.js file was to create a function called ```buildMetadata()``` that would build all the metadata with ```d3.json``` into a panel/card in the corresponding part of the HTML with ```d3.select``` and would include the keys and values of each sample.

<br>

```javascript
function buildMetadata(_meta) {

    var demographicData = data.metadata.filter(obj => obj.id == _meta)[0];
    console.log(demographicData);
 
    var demographic = d3.select("#sample-metadata");
    demographic.html("");
    Object.entries(demographicData).forEach(([key, value]) => {
      demographic.append("p").text(`${key}: ${value}`)
    });
};
```

<br>

<div align='center'><img width='30%' src='images/sample-metadata-panel.jpg' alt='sample-metadata-panel'></div>

<br>

```javascript
function buildCharts(_meta) {
    
    var chartSamples = data.samples.filter(obj => obj.id == _meta)[0];
    
    var bar_labels = chartSamples.otu_ids.slice(0, 10);
    var otu_ids = bar_labels.reverse();
    otu_ids = otu_ids.map(id=>"OTU " + id);
   
    var bar_values = chartSamples.sample_values.slice(0, 10);
    var sampleValues = bar_values.reverse();
    
    var bar_hover = chartSamples.otu_labels.slice(0, 10);
    var otu_labels = bar_hover.reverse();
    

// bar chart
    var trace1 = {
        x: sampleValues,
        y: otu_ids,
        text: otu_labels,
        type: "bar",
        orientation: "h",
    };
    
    var data_bar = [trace1];

    Plotly.newPlot("bar", data_bar, layout);

// bubble chart
    var trace2 = {
        x: chartSamples.otu_ids,
        y: chartSamples.sample_values,
        text: chartSamples.otu_labels,
        mode: "markers",
        marker: {
          color: chartSamples.otu_ids,
          size: chartSamples.sample_values
        }
      };
    
    var data_bubble = [trace2];
    
    var layout = {
      xaxis: { title: "OTU ID"},
    };
    
    Plotly.newPlot("bubble", data_bubble, layout);

// gauge chart
    var gaugeData = data.metadata.filter(sampleObj => sampleObj.id == _meta)[0];

  var gaugeChart = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: gaugeData.wfreq,
        title: { text: "Belly Button Washing Frequency: Scrubs per week", font: { size: 15 } },
        // delta: { reference: 400, increasing: { color: "Viridis" } },
        text: ["0-1", "1-2", "2-3",
          "3-4", "4-5", "5-6", "6-7",
          "7-8", "8-9"
        ],
        textinfo: "text",
        textposition: "inside",
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "red" },
          bar: { color: "darkred" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "lightgrey",
          steps: [
            // { range: [0, 1]},
            // { range: [1, 2]},
            // { range: [2, 3]},
            // { range: [3, 4]},
            // { range: [4, 5]},
            // { range: [5, 6]},
            // { range: [6, 7]},
            // { range: [7, 8]},
            // { range: [8, 9]}
            { range: [0, 1], color: "beige" },
            { range: [1, 2], color: "antiquewhite" },
            { range: [2, 3], color: "blanchedalmond" },
            { range: [3, 4], color: "palegoldenrod" },
            { range: [4, 5], color: "darkseagreen" },
            { range: [5, 6], color: "olivedrab" },
            { range: [6, 7], color: "olive" },
            { range: [7, 8], color: "darkolivegreen" },
            { range: [8, 9], color: "seagreen" }
          ]
          // colorscale: "greens"
          // threshold: {
          //   line: { color: "red", width: 4 },
          //   thickness: 0.75,
          //   value: 10
          // }
        }
      }
      
    ];

    var layout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial" }
    };
    
    Plotly.newPlot("gauge", gaugeChart, layout);

<br>

Pie Chart:

<br>

<div align='center'><img width='40%' src='images/piechart.jpg' alt='pie-chart'></div>

<br>

Bubble Chart:

<br>

<div align='center'><img width='80%' src='images/bubblechart.jpg' alt='bubble-chart'></div>

<br>

I made two more functions: ```init()``` and ```optionChanged()```. The ```init()``` function just initializes the build of the first sample. The ```optionChanged()``` function updates the previous functions ```buildCharts()``` and ```buildMetadata()``` when a new sample is selected by the user from the dropdown in the metadata panel.

<br>

```javascript
function init() {
  // grab a reference to the dropdown select element
  let selector = d3.select('#selDataset')

  // use the list of sample names to populate the select options
  d3.json('/names').then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append('option')
        .text(sample)
        .property('value', sample)
    })

    // use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0]
    buildCharts(firstSample)
    buildMetadata(firstSample)
  })
}

function optionChanged(newSample) {
  // fetch new data each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)
}

// initialize the dashboard
init()
```

<br>

Here is an example of two different options selected from the dropdown.

<br>

<div align='center'><img width='80%' src='images/gauge_chart.png' alt='gauge_chart'></div>

<br>

<div align='center'><img width='80%' src='images/bubble.png' alt='bubble'></div>

<br>

#### Render template

In [index.html](templates/index.html), I used [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/) to create a jumbotron and a card with sample picker and sample results (panel was used in the previous versions of Bootstrap). It also allowed me to organize my columns to have the pie chart next to the panel of metadata and the bubble chart along the bottom taking up the entire width of the screen.

<br>

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Bellybutton Biodiversity</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

</head>

<body>

  <div class="container">
    <div class="row">
      <div class="col-md-12 jumbotron text-center">
        <h1>Belly Button Biodiversity Dashboard</h1>
        <p>Use the interactive charts below to explore the dataset</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2">
        <div class="well">
          <h5>Test Subject ID No.:</h5>
          <select id="selDataset" onchange="optionChanged(this.value)"></select>
        </div>
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h3 class="panel-title">Demographic Info</h3>
          </div>
          <div id="sample-metadata" class="panel-body"></div>
        </div>
      </div>
      <div class="col-md-5">
        <div id="bar"></div>
      </div>
      <div class="col-md-5">
        <div id="gauge"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div id="bubble"></div>
      </div>
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.5.0/d3.js"></script>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <script src="app.js"></script>
  <!-- <script src="./static/js/bonus.js"></script> -->

</body>

</html>

```

<br>

