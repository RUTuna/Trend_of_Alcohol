/* Treemap */
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
            .id((d) => d.name) // entity name
            .parentId((d) => d.parent) // entity's parent name
            (vis.data);

        vis.root.sum((d) => +d.value); // 각 entity value 을 전체 크기로 사용

        /* Color Sclae */
        vis.cScale = d3.scaleOrdinal().domain(vis.root.children).range(d3.schemeTableau10);

        d3.treemap()
            .size([vis.width, vis.height])
            .padding(2)
            (vis.root);

        /* Entity */
        vis.svg
            .selectAll("rect")
            .data(vis.root.leaves(), (d) => d.data.name)
            .join(
                (enter) => // 처음 rendering 시 동작
                    enter
                        .append("rect")
                        .attr("class", (d) => d.parent.id)
                        .attr("x", (d) => d.x0)
                        .attr("y", (d) => d.y0)
                        .attr("width", (d) => d.x1 - d.x0) 
                        .attr("height", (d) => d.y1 - d.y0)
                        .style("stroke", "black")
                        .style("fill", (d) => vis.cScale(d.parent))
                        .style("opacity", "0.5")
                        .on("mouseover", (e, d) => {
                            d3.selectAll("." + d.parent.id).style("opacity", "1");
                        })
                        .on("mouseleave", (e, d) => {
                            d3.selectAll("." + d.parent.id).style("opacity", "0.5");
                        }),
                (update) => // 값 변경 시 동작
                    update.call((update) =>
                        update
                            .transition()
                            .duration(500) // Animation 추가
                            .attr("x", (d) => d.x0)
                            .attr("y", (d) => d.y0)
                            .attr("width", (d) => d.x1 - d.x0) 
                            .attr("height", (d) => d.y1 - d.y0)
                    ),
                (exit) => // 종료 시 width 와 height 를 0으로 한 다음 remove 안보이게 하기
                    exit.call((exit) =>
                        exit
                            .transition()
                            .duration(500) // Animation 추가
                            .attr("x", (d) => d.x0)
                            .attr("y", (d) => d.y0)
                            .attr("width", 0) 
                            .attr("height", 0)
                            .remove()
                    )
            );

        /* Entity Label */
        vis.svg
            .selectAll("text")
            .data(vis.root.leaves(), (d) => d.data.name)
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
