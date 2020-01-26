// Intialize plot size and margin
var svgHeight = 500;
var svgWidth = 960;
var margin = {
  top: 20,
  bottom: 60,
  left: 100,
  right: 40
};

var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// Select plot division in html
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data
d3.csv("../D3_data_journalism/assets/data/data.csv").then(function(data) {
  // Print original data in console
  console.log(data);

  // Parse int data for plotting
  data.forEach(function(x) {
    (x.healthcare = +x.healthcare), (x.poverty = +x.poverty);
  });

  //set x and y scale
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, d => d.poverty) * 0.95,
      d3.max(data, d => d.poverty) * 1.05
    ])
    .range([0, chartWidth]);

  yScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, d => d.healthcare) * 0.8,
      d3.max(data, d => d.healthcare) * 1.2
    ])
    .range([chartHeight, 0]);

  // set x and y axis
  xAxis = d3.axisBottom(xScale);
  yAxis = d3.axisLeft(yScale);

  // Create left and bottom axis
  chartGroup
    .append("g")
    .classed("axis", true)
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis);
  // Label x-axis
  chartGroup
    .append("text")
    .classed("aText", true)
    .attr(
      "transform",
      `translate(${chartWidth / 2},${chartHeight + margin.top + 20})`
    )
    .text("In poverty (%)");

  chartGroup
    .append("g")
    .classed("axis", true)
    .call(yAxis);
  //Label y-axis
  chartGroup
    .append("text")
    .classed("aText", true)
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left / 2)
    .attr("x", 0 - chartHeight / 2)
    .text("Lacks Healthcare (%)");

  //Plotting
  chartGroup
    .selectAll(".stateCircle")
    .data(data)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "skyblue")
    .style("opacity", 0.8);

  chartGroup
    .append("text")
    .classed("stateText", true)
    .selectAll("tspan")
    .data(data)
    .enter()
    .append("tspan")
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare))
    .text(d => d.abbr);
});
