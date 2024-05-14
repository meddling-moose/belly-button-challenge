// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;
    
    // Filter the metadata for the object with the desired sample number
    let filtered = metadata.filter(sampleObj => sampleObj.id == sample);

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

    // Filter the samples for the object with the desired sample number
    let filtered = samples.filter(sampleObj => sampleObj.id == sample);

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
        size: sampleValues,
        colorscale: "Earth"
      }
    }

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: "OTU IDs"
      },
      yaxis: {
        title: "Number of Bacteria"
      }
    }

    // Render the Bubble Chart
    let plotData = [traceBubble]
    Plotly.newPlot("bubble", plotData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let mapped = otuIds.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let traceBar = {
      type: "bar",
      x: sampleValues.slice(0, 10).reverse(),
      y: mapped.slice(0, 10).reverse(),
      orientation: "h"
    };

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria"
      },
      yaxis: {
        title: "OTU IDs"
      }
    }

    // Render the Bar Chart
    let barPlotData = [traceBar]
    Plotly.newPlot("bar", barPlotData, barLayout)
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

// Initialize the dashboard
init();
