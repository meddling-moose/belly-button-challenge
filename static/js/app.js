// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;
    
    // Filter the metadata for the object with the desired sample number
    let filtered = metadata.filter(isRightNumber);

    // Use d3 to select the panel with id of `#sample-metadata`
    let selector = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    selector.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (var [key, value] of Object.entries(filtered[0])) {
      selector.append("html").text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;
    console.log(samples);

    // Filter the samples for the object with the desired sample number
    let filtered = samples.filter(isRightNumber);
    console.log(filtered);

    // Get the otu_ids, otu_labels, and sample_values
    otuIds = filtered[0].otu_ids;
    otuLabels = filtered[0].otu_labels;
    sampleValues = filtered[0].sample_values;

    // Build a Bubble Chart
    let traceBubble = {
      type: "bubble",
      x: otuIds,
      y: sampleValues,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues //How do I make these a little smaller?
      }
    }

    let layout = {
      title: "Bacteria Cultures Per Sample"
    }

    // Render the Bubble Chart
    let plotData = [traceBubble]
    Plotly.newPlot("bubble", plotData, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let mapped = otuIds.map(id => `OTU ${id}`);
    console.log(mapped);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let traceBar = {
      type: "bar",
      x: sampleValues,
      y: mapped,
      orientation: "h"
    }; //How am I meant to slice and sort this while preserving the integrity of the order?

    // Render the Bar Chart
    let barPlotData = [traceBar]
    Plotly.newPlot("bar", barPlotData)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < sampleNames.length; i++) {
      selector
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);
    }

    // Get the first sample from the list
    sample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(sample);
    buildCharts(sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

function isRightNumber(subject) {
  return subject.id == sample;
};

// Initialize the dashboard
init();
