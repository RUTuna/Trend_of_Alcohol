/* Pie Chart */
export class PieChart {
    constructor(_config, _data, _name) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth * 0.37 || window.innerWidth - 300,
            containerHeight: _config.containerHeight || window.innerHeight - 100,
            margin: _config.margin || { top: 5, right: 100, bottom: 50, left: 100 },
        };
        this.data = _data;
        this.name = _name;
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.radius = Math.min(vis.width, vis.height) / 2 - vis.config.margin.left - vis.config.margin.right;

        vis.svg = d3
            .select(vis.config.parentElement)
            .append("svg")
            .attr("class", "piechart")
            .attr("width", vis.config.containerWidth)
            .attr("height", vis.config.containerHeight)
            .append("g")
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        /* Pie */
        vis.pie = d3
            .pie()
            .sort(null)
            .value((d) => d.value);

        /* Arc */
        vis.arc = d3
            .arc()
            .innerRadius(vis.radius * 0.5) // 내부 반지름, 도넛 형태를 위해
            .outerRadius(vis.radius * 0.9); // 외부 반지름 

        vis.renderVis();
    }

    renderVis() {
        let vis = this;
        vis.svg.selectAll("path").remove();
        vis.svg.selectAll(".legend_text").remove();
        vis.svg.selectAll(".legend_rect").remove();
        vis.svg.selectAll("text").remove();

        /* Color Sclae */
        vis.cScale = d3
            .scaleOrdinal()
            .domain(vis.data.map((d) => d.name))
            .range(d3.schemeTableau10);

        vis.data_ready = vis.pie(vis.data.map((d) => ({ name: d.name, value: d.value })));

        vis.svg
            .selectAll("allSlices")
            .data(vis.data_ready)
            .join("path")
            .attr("class", (d) => {
                return d.data.name;
            })
            .attr("transform", `translate(${vis.width * 0.5 - vis.radius}, ${vis.height * 0.5})`)
            .attr("d", vis.arc)
            .attr("fill", (d) => vis.cScale(d.data.name))
            .attr("stroke", "grey")
            .style("stroke-width", "1px")
            .style("opacity", 0.5)
            .on("mouseover", (e, d) => {
                d3.selectAll("." + d.data.name).style("opacity", "1");
            })
            .on("mouseleave", (e, d) => {
                d3.selectAll("." + d.data.name).style("opacity", "0.5");
            })
            .transition() 
            .duration(500)
            .attrTween("d", function (d) {
                const interpolate = d3.interpolate(d.startAngle, d.endAngle);
                return function (t) {
                    d.endAngle = interpolate(t);
                    return vis.arc(d);
                };
            });

        /* Legend */
        vis.legends = vis.svg
            .append("g")
            .attr("transform", `translate(${vis.radius * 2 + vis.width * 0.2}, 0)`)
            .selectAll(".legends")
            .data(vis.data_ready);

        vis.legend = vis.legends
            .enter()
            .append("g")
            .attr("class", "pieLegend")
            .attr("transform", (d, i) => {
                return `translate(0,${(i + 1) * 30})`;
            });

        vis.legend
            .append("rect")
            .attr("class", "legend_rect")
            .attr("fill", (d) => vis.cScale(d.data.name));

        vis.legend
            .append("text")
            .attr("class", "legend_text")
            .text((d) => {
                return d.data.name + " " + Number(d.data.value).toFixed(2) + "%";
            });

        /* Title */
        vis.svg
            .append("text")
            .text(vis.name)
            .attr("transform", `translate(${vis.width * 0.5 - vis.radius}, ${vis.height * 0.52})`)
            .attr("class", "pieTitle");
    }
}
