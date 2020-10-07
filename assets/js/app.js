// create margins for chart
var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// create SVG wrapper, append an SVG group that will hold our information,
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//create initial parameters; x and y axis
let selectedXAxis = 'poverty';
let selectedYAxis = 'healthcare';

//a function for updating the x-scale variable upon click of label
function xScale(censusData, selectedXAxis) {
    //scales
    let xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[selectedXAxis]) * 0.8,
        d3.max(censusData, d => d[selectedXAxis]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}
//a function for updating y-scale variable upon click of label
function yScale(censusData, selectedYAxis) {
  //scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[selectedYAxis]) * 0.8,
      d3.max(censusData, d => d[selectedYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}

    
// import data from the CSV file
d3.csv("assets/data/data.csv").then(function (healthData) {

    // format and parse the data 
    healthData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    // create the scales
    var xScale = d3.scaleLinear()
        .domain(d3.extent(healthData, d => d.poverty))
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(healthData, d => d.healthcare))
        .range([height, 0]);

    // create the axis
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // add x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // add y-axis
    chartGroup.append("g")
        .call(leftAxis);
// create circles
chartGroup.selectAll("circle")
.data(healthData)
.enter()
.append("circle")
.attr("cx", d => xScale(d.poverty))
.attr("cy", d => yScale(d.healthcare))
.attr("r", 9)
.attr("fill", "#8ebfce")
.attr("opacity", ".7");

// create circle labels
chartGroup.selectAll()
.data(healthData)
.enter()
.append('text')
.attr("x", d => xScale(d.poverty) - 5)
.attr("y", d => yScale(d.healthcare) + 3)
.attr("fill", "white")
.attr("font-size", "8")
.text(d => d.abbr);

// create X axis label
chartGroup.append('text')
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("In Poverty (%)");

// create Y axis label
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr('y', 0 - margin.left + 50)
.attr("x", 0 - (height / 2) - 60)
.attr("class", "axisText")
.text("Lacks Healthcare (%)");

});

