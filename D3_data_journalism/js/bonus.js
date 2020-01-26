// Intialize plot size and margin
var svgHeight = 600;
var svgWidth = 960;
var margin = {
  top: 20,
  bottom: 90,
  left: 160,
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

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// xScale function
function xScale(data, chosenXAxis) {
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, d => d[chosenXAxis]) * 0.95,
      d3.max(data, d => d[chosenXAxis]) * 1.05
    ])
    .range([0, chartWidth]);

  return xLinearScale;
}

// yScale function
function yScale(data, chosenYAxis) {
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([chartHeight, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis
    .transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis
    .transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(
  circlesGroup,
  newXScale,
  newYScale,
  chosenXAxis,
  chosenYAxis
) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return `${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]} %<br>${chosenYAxis}: ${d[chosenYAxis]} %`;
    });

  circlesGroup.call(toolTip);

  circlesGroup
    .on("mouseover", function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
// function used for updating circles text with a transition to
// new circle text
function renderText(
  circleText,
  newXScale,
  newYScale,
  chosenXAxis,
  chosenYAxis
) {
  circleText
    .transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  return circleText;
}

// function used for updateing circles group with new tooltip

// Load data
d3.csv("../D3_data_journalism/data/data.csv").then(function(data, err) {
  // Print original data in console
  if (err) throw err;

  console.log(data);

  // Parse int data for plotting
  data.forEach(function(x) {
    (x.healthcare = +x.healthcare),
      (x.poverty = +x.poverty),
      (x.age = +x.age),
      (x.income = +x.income),
      (x.obesity = x.obesity),
      (x.smokes = +x.smokes);
  });

  // Set x and y scale
  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);

  // Initial axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append axis
  var xAxis = chartGroup
    .append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0,${chartHeight})`)
    .call(bottomAxis);

  var yAxis = chartGroup
    .append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  var labelGroup = chartGroup.append("g");

  // Label x-axis
  var povertyLabel = labelGroup
    .append("text")
    .classed("aText", true)
    .classed("active", true)
    .attr(
      "transform",
      `translate(${chartWidth / 2},${chartHeight + margin.top + 20})`
    )
    .attr("value", "poverty")
    .text("In poverty (%)");

  var ageLabel = labelGroup
    .append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr(
      "transform",
      `translate(${chartWidth / 2},${chartHeight + margin.top + 40})`
    )
    .attr("value", "age")
    .text("Age (Median)");

  var incomeLabel = labelGroup
    .append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr(
      "transform",
      `translate(${chartWidth / 2},${chartHeight + margin.top + 60})`
    )
    .attr("value", "income")
    .text("Household Income (Median)");

  //Label y-axis
  var healthcareLabel = labelGroup
    .append("text")
    .classed("aText", true)
    .classed("active", true)
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left / 2 + 50)
    .attr("x", 0 - chartHeight / 2)
    .attr("value", "healthcare")
    .text("Lacks Healthcare (%)");

  var smokeLabel = labelGroup
    .append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left / 2 + 30)
    .attr("x", 0 - chartHeight / 2)
    .attr("value", "smokes")
    .text("Smokes (%)");

  var obeseLabel = labelGroup
    .append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left / 2 + 10)
    .attr("x", 0 - chartHeight / 2)
    .attr("value", "obesity")
    .text("Obese (%)");

  // Append initial circles
  var circleGroup = chartGroup
    .selectAll(".stateCircle")
    .data(data)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "12")
    .attr("fill", "skyblue")
    .style("opacity", 0.8);

    var circleText = chartGroup
    .append("text")
    .classed("stateText", true)
    .selectAll("tspan")
    .data(data)
    .enter()
    .append("tspan")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]) + 5)
    .text(d => d.abbr);

  // updateToolTip function above csv import
  var circleGroup = updateToolTip(
    chosenXAxis,
    chosenYAxis,
    circleGroup
  );

  labelGroup.selectAll("text").on("click", updatePlot);

  function updatePlot() {
    var axisChanged = d3.select(this).attr("transform");
    var input = d3.select(this).attr("value");

    if (axisChanged === "rotate(-90)") {
      console.log("Variable change on yaxis");
      if (input !== chosenYAxis) {
        chosenYAxis = input;
        console.log(chosenYAxis);
        console.log(chosenXAxis);

        yLinearScale = yScale(data, chosenYAxis);
        yAxis = renderYAxis(yLinearScale, yAxis);
        circleGroup = renderCircles(
          circleGroup,
          xLinearScale,
          yLinearScale,
          chosenXAxis,
          chosenYAxis
        );
        circleText = renderText(
          circleText,
          xLinearScale,
          yLinearScale,
          chosenXAxis,
          chosenYAxis
        );
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circleGroup);

        if (chosenYAxis === "smokes") {
          smokeLabel.classed("active", true).classed("inactive", false);
          healthcareLabel.classed("active", false).classed("inactive", true);
          obeseLabel.classed("active", false).classed("inactive", true);
        }
        if (chosenYAxis === "obesity") {
          smokeLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", false).classed("inactive", true);
          obeseLabel.classed("active", true).classed("inactive", false);
        }
        if (chosenYAxis === "healthcare") {
          smokeLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", true).classed("inactive", false);
          obeseLabel.classed("active", false).classed("inactive", true);
        }
      }
    } else {
      console.log("Variable change on xaxis");

      if (input !== chosenXAxis) {
        chosenXAxis = input;
        console.log(chosenXAxis);
        console.log(chosenYAxis);
        xLinearScale = xScale(data, chosenXAxis);
        xAxis = renderXAxis(xLinearScale, xAxis);
        circleGroup = renderCircles(
          circleGroup,
          xLinearScale,
          yLinearScale,
          chosenXAxis,
          chosenYAxis
        );
        circleText = renderText(
          circleText,
          xLinearScale,
          yLinearScale,
          chosenXAxis,
          chosenYAxis
        );

        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circleGroup);

        if (chosenXAxis === "poverty") {
          povertyLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
        }
        if (chosenXAxis === "age") {
          povertyLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", true).classed("inactive", false);
        }
        if (chosenXAxis === "income") {
          povertyLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
        }
      }
    }
  }
});
