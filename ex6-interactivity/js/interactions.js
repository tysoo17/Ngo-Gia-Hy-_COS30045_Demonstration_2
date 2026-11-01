const matchesFilters = tv => {
    const tech = filters_screen.find(f => f.isActive).id;
    const size = filters_size.find(f => f.isActive).id;
    return (tech === "all" || tv.screenTech === tech) && (size === "all" || tv.screenSize === size);
};

const populateFilters = (data) => {
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
            .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
            .text(d => d.label)
            .on("click", (e, d) => {
                console.log("Clicked filter:", e);
                console.log("Clicked filter data:", d);

                if (!d.isActive) {
                    filters_screen.forEach(filter => {
                        filter.isActive = d.id === filter.id ? true : false;
                    });

                    d3.selectAll("#filters_screen .filter")
                        .classed("active", filter => filter.id === d.id ? true : false);

                    updateHistogram(data);
                }
            });

    d3.select("#filters_size")
        .selectAll(".filter")
        .data(filters_size)
        .join("button")
            .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
            .text(d => d.label)
            .on("click", (e, d) => {
                console.log("Clicked filter:", e);
                console.log("Clicked filter data:", d);

                if (!d.isActive) {
                    filters_size.forEach(filter => {
                        filter.isActive = d.id === filter.id ? true : false;
                    });

                    d3.selectAll("#filters_size .filter")
                        .classed("active", filter => filter.id === d.id ? true : false);

                    updateHistogram(data);
                }
            });
};

const updateHistogram = (data) => {
    const updatedData = data.filter(matchesFilters);
    const updatedBins = binGenerator(updatedData);

    yScale.domain([0, d3.max(updatedBins, d => d.length) || 1]).nice();

    d3.select("#histogram .y-axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale));

    d3.selectAll("#histogram rect")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));

    innerChartS.selectAll("circle")
        .attr("display", d => matchesFilters(d) ? null : "none");
};

const createTooltip = () => {
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.85);

    tooltip
        .append("text")
        .attr("class", "tooltip-title")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2 - 7)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text("NA");

    tooltip
        .append("text")
        .attr("class", "tooltip-detail")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2 + 11)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text("NA");
};

const handleMouseEvents = () => {
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            console.log("Mouse entered circle", d);

            d3.select(".tooltip .tooltip-title").text(`${d.brand} ${d.model}`);
            d3.select(".tooltip .tooltip-detail")
                .text(`${d.screenSize}" · ${d.energyConsumption} kWh/yr · ${d.star}★`);

            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            let ty = cy - 1.5 * tooltipHeight;
            if (ty < 0) ty = cy + 0.5 * tooltipHeight;
            const tx = Math.max(0, Math.min(cx - 0.5 * tooltipWidth, innerWidth - tooltipWidth));

            d3.select(".tooltip")
                .attr("transform", `translate(${tx}, ${ty})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", (e, d) => {
            console.log("Mouse left circle", d);

            d3.select(".tooltip")
                .style("opacity", 0)
                .attr("transform", `translate(0, 500)`);
        });
};
