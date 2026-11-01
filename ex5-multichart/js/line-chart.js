d3.csv("data/ARE_Spot_Prices.csv", d => ({
  year: +d.Year,
  averagePrice: +d["Average Price (notTas-Snowy)"]
})).then(data => {
  console.log(data);
  drawLineChart(data);
});

const drawLineChart = data => {
  const margin = { top: 40, right: 170, bottom: 50, left: 60 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .nice()
    .range([innerHeight, 0]);

  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));

  const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(bottomAxis);

  innerChart
    .append("g")
    .call(leftAxis);

  const areaGenerator = d3.area()
    .x(d => xScale(d.year))
    .y0(innerHeight)
    .y1(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  innerChart
    .append("path")
    .attr("d", areaGenerator(data))
    .attr("fill", "#A8641A")
    .attr("opacity", 0.15);

  innerChart
    .append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "#A8641A")
    .attr("stroke-width", 2);

  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice))
      .attr("r", 4)
      .attr("fill", "#A8641A")
      .append("title")
      .text(d => `${d.year}: $${d.averagePrice} per MWh`);

  const last = data[data.length - 1];
  innerChart
    .append("text")
    .text("Average price")
    .attr("x", xScale(last.year) + 12)
    .attr("y", yScale(last.averagePrice) + 4)
    .style("fill", "#A8641A")
    .style("font-weight", 600);

  innerChart
    .append("text")
    .text("Average spot price ($ per MWh)")
    .attr("x", -margin.left)
    .attr("y", -10)
    .attr("text-anchor", "start");

  innerChart
    .append("text")
    .text("Year")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 42)
    .attr("text-anchor", "middle");
};
