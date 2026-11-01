d3.csv("data/tvScreenSizeCategory.csv", d => ({
  Screensize_Category: d.Screensize_Category,
  Count: +d.Count
})).then(data => {
  console.log(data);
  const order = ["small", "medium", "large"];
  data.sort((a, b) => order.indexOf(a.Screensize_Category) - order.indexOf(b.Screensize_Category));
  drawDonutChart(data, order);
});

const drawDonutChart = (data, order) => {
  const width = 1000;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 20;

  const color = d3.scaleOrdinal()
    .domain(order)
    .range(["#F6D9A0", "#EBA746", "#A8641A"]);

  const pie = d3.pie()
    .value(d => d.Count)
    .sort(null);

  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius)
    .padAngle(0.02)
    .cornerRadius(4);

  const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const total = d3.sum(data, d => d.Count);
  const percent = d3.format(".0%");

  innerChart
    .selectAll("path")
    .data(pie(data))
    .join("path")
      .attr("d", arcGenerator)
      .attr("fill", d => color(d.data.Screensize_Category))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

  innerChart
    .selectAll(".slice-label")
    .data(pie(data))
    .join("text")
      .attr("class", "slice-label")
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("fill", "#2B2B2B")
      .style("font-weight", 600)
      .selectAll("tspan")
      .data(d => [d.data.Screensize_Category, percent(d.data.Count / total)])
      .join("tspan")
        .attr("x", 0)
        .attr("dy", (d, i) => i === 0 ? "-0.2em" : "1.2em")
        .text(d => d);

  innerChart
    .append("text")
    .text(`${d3.format(",")(total)} TVs`)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("font-size", "24px")
    .style("fill", "#2B2B2B");

  const labels = { small: "small (< 43\")", medium: "medium (43–65\")", large: "large (> 65\")" };
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 200}, ${height / 2 - 40})`);

  order.forEach((category, i) => {
    legend.append("rect")
      .attr("y", i * 28)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", color(category));
    legend.append("text")
      .text(labels[category])
      .attr("x", 26)
      .attr("y", i * 28 + 13);
  });
};
