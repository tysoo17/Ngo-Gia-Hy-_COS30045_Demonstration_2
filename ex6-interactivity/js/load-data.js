d3.csv("data/Ex6_TVdata_withStar.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,
    star: +d.star
})).then(data => {
    console.log(data);

    drawHistogram(data);
    populateFilters(data);
    drawScatterplot(data);
    createTooltip();
    handleMouseEvents();
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});
