d3.csv("data/tv55_screenTech_energy.csv", d => ({
  Screen_Tech: d.Screen_Tech,
  Energy_Consumption: +d.Energy_Consumption
})).then(data => {
  console.log(data);
  data.sort((a, b) => b.Energy_Consumption - a.Energy_Consumption);
  drawBarChart(data);
});

const drawBarChart = data => {
  const margin = { top: 40, right: 170, bottom: 50, left: 60 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.Screen_Tech))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Energy_Consumption)])
    .nice()
    .range([innerHeight, 0]);

  const bottomAxis = d3.axisBottom(xScale).tickSize(0);
  const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(bottomAxis)
    .selectAll("text")
    .attr("dy", "1.2em")
    .style("font-size", "14px");

  innerChart
    .append("g")
    .call(leftAxis);

  innerChart
    .selectAll(".bar")
    .data(data)
    .join("rect")
      .attr("class", "bar")
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.Energy_Consumption))
      .attr("x", d => xScale(d.Screen_Tech))
      .attr("y", d => yScale(d.Energy_Consumption))
      .attr("fill", "#A8641A");

  innerChart
    .selectAll(".bar-label")
    .data(data)
    .join("text")
      .attr("class", "bar-label")
      .text(d => `${Math.round(d.Energy_Consumption)} kWh`)
      .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.Energy_Consumption) - 6)
      .attr("text-anchor", "middle");

  innerChart
    .append("text")
    .text("Mean energy consumption (kWh/year)")
    .attr("x", -margin.left)
    .attr("y", -10)
    .attr("text-anchor", "start");

  innerChart
    .append("text")
    .text("Screen technology (55-inch TVs)")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 42)
    .attr("text-anchor", "middle");
};
