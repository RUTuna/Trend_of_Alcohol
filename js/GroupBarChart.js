export class GroupeBarChart {
    constructor(_config, _data, _legend, _label) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || window.innerWidth - 300,
            containerHeight: _config.containerHeight || window.innerHeight - 100,
            margin: _config.margin || {
                top: 5,
                right: 100,
                bottom: 50,
                left: 100,
            },
        };
        this.data = _data;
        this.legend = _legend;
        this.label = _label;
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // List of subgroups = header of the csv files = soil condition here
        vis.subgroups = vis.data.columns.slice(1);

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        vis.groups = vis.data.map((d) => d.generation);

        // append the svg object to the body of the page
        vis.svg = d3
            .select(vis.config.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr("height", vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Add X axis
        vis.xScale = d3
            .scaleBand()
            .domain(vis.groups)
            .range([0, vis.width])
            .padding([vis.width * 0.0005]);

        vis.svg.append("g").attr("transform", `translate(0, ${vis.height})`).call(d3.axisBottom(vis.xScale).tickSize(0));

        // Add Y axis
        const maxDataValue = d3.max(vis.data, (d) => d3.max(vis.subgroups, (key) => d[key]));

        vis.yScale = d3
            .scaleLinear()
            .domain([0, maxDataValue * 1.4]) // Set the domain using the maximum value
            .range([vis.height, 0]);

        vis.svg.append("g").call(d3.axisLeft(vis.yScale));

        // Another scale for subgroup position?
        vis.xSubgroup = d3.scaleBand().domain(vis.subgroups).range([0, vis.xScale.bandwidth()]).padding([0.1]);

        // color palette = one color per subgroup
        vis.cScale = d3.scaleOrdinal().domain(vis.subgroups).range(d3.schemeTableau10);

        // Show the bars
        vis.svg
            .append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(vis.data)
            .join("g")
            .attr("transform", (d) => `translate(${vis.xScale(d.generation)}, 0)`)
            .selectAll("rect")
            .data(function (d) {
                return vis.subgroups.map(function (key) {
                    return { key: key, value: d[key] };
                });
            })
            .join("rect")
            .attr("class", (d) => d.key)
            .attr("x", (d) => vis.xSubgroup(d.key))
            .attr("y", (d) => vis.yScale(d.value) - 0.5)
            .attr("width", vis.xSubgroup.bandwidth())
            .attr("height", (d) => vis.height - vis.yScale(d.value))
            .attr("fill", (d) => vis.cScale(d.key))
            .style("opacity", "0.5")
            .on("mouseover", (e, d) => {
                d3.selectAll("." + d.key).style("opacity", "1");
            })
            .on("mouseleave", (e, d) => {
                d3.selectAll("." + d.key).style("opacity", "0.5");
            })
            .each(function (d) {
                const value = Number(d.value).toFixed(1);
                const text = d3
                    .select(this.parentNode)
                    .append("text")
                    .attr("x", vis.xSubgroup(d.key) + vis.xSubgroup.bandwidth() / 2)
                    .attr("y", vis.yScale(d.value) - 10)
                    .attr("text-anchor", "middle")
                    .text(value);
            });

        vis.svg
            .append("text")
            .attr("text-anchor", "end")
            .attr("x", vis.width)
            .attr("y", vis.height + 20)
            .attr("font-family", "Arial")
            .attr("font-size", 12)
            .text("세대");

        vis.svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -vis.config.margin.left)
            .attr("x", -vis.height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(vis.label[1]);

        vis.svg
            .append("text")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + vis.config.margin.bottom)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(vis.label[0]);

        // Add legend
        const legend = vis.svg
            .append("g")
            .attr("class", "groubar-legend")
            .attr("transform", `translate(${vis.width - 200}, 0)`);

        const legendItems = legend
            .selectAll(".legend-item")
            .data(vis.subgroups)
            .join("g")
            .attr("width", 300)
            .attr("height", 70)
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legendItems
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", (d) => vis.cScale(d));

        legendItems
            .append("text")
            .attr("x", 20)
            .attr("y", 8)
            .text((d, i) => {
                return vis.legend[i];
            });
    }

    // updateVis() {
    //     let vis = this;

    //     vis.renderVis();
    // }

    // renderVis() {
    // }
}
