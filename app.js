// Using D3 library to read in sample.json
// let jsondata = d3.json("data/samples.json")
// console.log(jsondata)

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;


 // Creating a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
 var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
 var barData = [
{
  x: sample_values.slice(0, 10).reverse(),
  y: yticks,
  text: otu_labels.slice(0, 10).reverse(),
  type: "bar",
  orientation: "h",
}
 ];
 
 var barLayout = {
   title: "The top 10 OTUs found",
   margin: { t: 30, 1: 150 }
 };

 Plotly.newPlot("bar", barData, barLayout);

 // Creating a bubble chart that displays each sample
 var bubbleLayout = {
title: "OTUs in each sample",
margin: { t: 0 },
hovermode: "closest",
xaxis: {title: "OTU ID"},
margin: { t: 30 }
 };

var bubbleData = [
  {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  }
   ];

   Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Displaying the sample metadata, i.e., an individual's demographic information
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
  PANEL.append("h6").text(`${key.toUpperCase()}: $(value)`);
  });
});
}

function init() {
// A reference to the dropdown select element
var selector = d3.select("#selDataset");

// Populating the select options using the list of sample names
d3.json("samples.json").then((data) => {
  var sampleNames = data.names;

  sampleNames.forEach((sample) => {
selector 
.append("option")
.text(sample)
.property("value", sample);
});

// Building the initial plots using the first sample from the list
var firstSample = sampleNames[0];
buildCharts(firstSample);
buildMetadata (firstSample);
});
}

// Update all of the plots any time that a new sample is selected
function optionChanged(newSample) {
buildCharts(newSample);
buildMetadata (newSample);
}

// Initializing the dashboard
init()