/* Groupe Bar Chart */
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
        vis.width = vis.config.containerWidth;
        vis.height = vis.config.containerHeight;

        /* generation 에 따른 Group */
        vis.groups = vis.data.map((d) => d.generation);

        /* 첫번째 col 에 따른 Sub group */
        vis.subgroups = vis.data.columns.slice(1);

        vis.svg = d3
            .select(vis.config.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr("height", vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        /* X Axis */
        vis.xScale = d3
            .scaleBand()
            .domain(vis.groups)
            .range([0, vis.width])
            .padding([vis.width * 0.0005]);

        vis.svg
            .append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(vis.xScale)
            .tickSize(0));

        vis.xSubgroup = d3
            .scaleBand()
            .domain(vis.subgroups)
            .range([0, vis.xScale.bandwidth()])
            .padding([0.1]);
        
        const maxDataValue = d3
            .max(vis.data, (d) => d3.max(vis.subgroups, (key) => d[key]));

        /* Y Axis */
        vis.yScale = d3
            .scaleLinear()
            .domain([0, maxDataValue * 1.4])
            .range([vis.height, 0]);

        vis.svg
            .append("g")
            .call(d3.axisLeft(vis.yScale));

        /* Color Sclae */
        vis.cScale = d3.scaleOrdinal().domain(vis.subgroups).range(d3.schemeTableau10);

        /* Bar Entity */
        vis.svg
            .append("g")
            .selectAll("g")
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
                const text = d3
                    .select(this.parentNode) // 내부 this 생성
                    .append("text")
                    .attr("x", vis.xSubgroup(d.key) + vis.xSubgroup.bandwidth() / 2)
                    .attr("y", vis.yScale(d.value) - 10)
                    .attr("text-anchor", "middle")
                    .text(Number(d.value).toFixed(1));
            });

        /* Axis Label */
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
            .attr("y", -50)
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

        /* Legend */
        vis.legends = vis.svg
            .append("g")
            .attr("class", "groubar-legend")
            .attr("transform", `translate(${vis.width < window.innerWidth-300 ? vis.width : window.innerWidth-300}, 0)`);

        vis.legendItems = vis.legends
            .selectAll(".legend-item")
            .data(vis.subgroups)
            .join("g")
            .attr("width", 300)
            .attr("height", 70)
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        vis.legendItems
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", (d) => vis.cScale(d));

        vis.legendItems
            .append("text")
            .attr("x", 20)
            .attr("y", 8)
            .text((d, i) => {
                return vis.legend[i];
            });
    }
}
