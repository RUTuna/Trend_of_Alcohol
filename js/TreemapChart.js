export class TreemapChart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth * 0.6 || window.innerWidth - 300,
            containerHeight: _config.containerHeight || window.innerHeight - 100,
            margin: _config.margin || { top: 5, right: 100, bottom: 50, left: 100 },
        };
        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // append the svg object to the body of the page
        vis.svg = d3
            .select(vis.config.parentElement)
            .append("svg")
            .attr("class", "treemapchart")
            .attr("width", vis.config.containerWidth)
            .attr("height", vis.config.containerHeight)
            .append("g")
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.renderVis();
    }

    renderVis() {
        let vis = this;
        vis.root = d3
            .stratify()
            .id(function (d) {
                return d.name;
            }) // Name of the entity (column name is name in csv)
            .parentId(function (d) {
                return d.parent;
            })(
            // Name of the parent (column name is parent in csv)
            vis.data
        );

        vis.root.sum(function (d) {
            return +d.value;
        }); // Compute the numeric value for each entity
        vis.cScale = d3.scaleOrdinal().domain(vis.root.children).range(d3.schemeTableau10);

        // Then d3.treemap computes the position of each element of the hierarchy
        // The coordinates are added to the root object above
        d3.treemap().size([vis.width, vis.height]).padding(2)(vis.root);

        // use this information to add rectangles:
        vis.svg
            .selectAll("rect")
            .data(vis.root.leaves(), (d) => d.data.name) // Use key function to bind data by name
            .join(
                (enter) =>
                    enter
                        .append("rect")
                        .attr("class", (d) => d.parent.id)
                        .attr("x", (d) => d.x0)
                        .attr("y", (d) => d.y0)
                        .attr("width", (d) => d.x1 - d.x0) // Transition to the final width
                        .attr("height", (d) => d.y1 - d.y0) // Transition to the final height
                        .style("stroke", "black")
                        .style("fill", (d) => vis.cScale(d.parent))
                        .style("opacity", "0.5")
                        .on("mouseover", (e, d) => {
                            d3.selectAll("." + d.parent.id).style("opacity", "1");
                        })
                        .on("mouseleave", (e, d) => {
                            d3.selectAll("." + d.parent.id).style("opacity", "0.5");
                        }),
                (update) =>
                    update.call((update) =>
                        update
                            .transition()
                            .duration(500) // Set animation duration to 1 second
                            .attr("x", (d) => d.x0)
                            .attr("y", (d) => d.y0)
                            .attr("width", (d) => d.x1 - d.x0) // Transition to the final width
                            .attr("height", (d) => d.y1 - d.y0) // Transition to the final height
                    ),
                (exit) =>
                    exit.call((exit) =>
                        exit
                            .transition()
                            .duration(500) // Set animation duration to 1 second
                            .attr("x", (d) => d.x0)
                            .attr("y", (d) => d.y0)
                            .attr("width", 0) // Transition to width 0 for removal
                            .attr("height", 0) // Transition to height 0 for removal
                            .remove()
                    )
            );

        // and to add the text labels
        vis.svg
            .selectAll("text")
            .data(vis.root.leaves(), (d) => d.data.name) // Use key function to bind data by name
            .join(
                (enter) =>
                    enter
                        .append("text")
                        .attr("class", (d) => d.data.parent)
                        .attr("x", (d) => d.x0 + (d.x1 - d.x0) / 2)
                        .attr("y", (d) => d.y0 + (d.y1 - d.y0) / 2)
                        .style("width", (d) => d.x1 - d.x0)
                        .style("height", (d) => d.y1 - d.y0)
                        .text((d) => {
                            return d.data.name;
                        })
                        .attr("fill", "white")
                        .attr("text-anchor", "middle")
                        .style("opacity", "0.5"),
                (update) =>
                    update.call((update) =>
                        update
                            .transition()
                            .duration(500)
                            .attr("x", (d) => d.x0 + (d.x1 - d.x0) / 2)
                            .attr("y", (d) => d.y0 + (d.y1 - d.y0) / 2)
                    ),
                (exit) =>
                    exit.call((exit) =>
                        exit
                            .transition()
                            .duration(500)
                            .attr("x", (d) => d.x0 + (d.x1 - d.x0) / 2)
                            .attr("y", (d) => d.y0 + (d.y1 - d.y0) / 2)
                            .remove()
                    )
            );
    }
}
