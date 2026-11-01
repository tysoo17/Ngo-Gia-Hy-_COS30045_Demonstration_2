const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 600 700");

d3.csv("data/tvBrandCount.csv", d => ({
  brand: d.brand,
  count: +d.count
})).then(data => {
  data.sort((a, b) => b.count - a.count);
  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, d => d.count));
  console.log(d3.min(data, d => d.count));
  console.log(d3.extent(data, d => d.count));
  drawBarChart(data);
});

const drawBarChart = data => {
  const barStart = 110;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0, 400]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, 700])
    .padding(0.2);

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", d => `bar bar-${d.count}`)
      .attr("x", barStart)
      .attr("y", d => yScale(d.brand))
      .attr("width", d => xScale(d.count))
      .attr("height", yScale.bandwidth())
      .attr("fill", "#A8641A");

  svg
    .selectAll(".brand-label")
    .data(data)
    .join("text")
      .attr("class", "brand-label")
      .attr("x", barStart - 6)
      .attr("y", d => yScale(d.brand) + yScale.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .text(d => d.brand);

  svg
    .selectAll(".value-label")
    .data(data)
    .join("text")
      .attr("class", "value-label")
      .attr("x", d => barStart + xScale(d.count) + 4)
      .attr("y", d => yScale(d.brand) + yScale.bandwidth() / 2)
      .attr("dominant-baseline", "middle")
      .text(d => d.count);
};
