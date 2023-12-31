/* Circular Paking Chart */
export class CircularPakingChart {
    constructor(_config, _data, _group){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || window.innerWidth - 300,
            containerHeight: _config.containerHeight || window.innerHeight - 100,
            margin: _config.margin || {top: 5, right: 100, bottom: 50, left: 100}
          }
        this.data = _data;
        this.group = _group;
        this.initVis();
    }

    initVis(){
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append("svg")
            .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
        vis.cScale = d3.scaleOrdinal()
            .domain(vis.group)
            .range(d3.schemeTableau10);

        vis.size = d3.scaleLinear()
            .domain([0, 100])
            .range([7,50])


        vis.Tooltip = d3.select(vis.config.parentElement)
            .append("div")
            .style("opacity", 0)
            .attr("id", "tooltip")

        vis.xScale = d3.scaleOrdinal()
            .domain(vis.group)
            .range([0, 40, 80, 120, 160, 200])

        vis.renderVis()
    }

    mouseover = (e, d) => {
        this.Tooltip
            .style("opacity", 1)
    }
    mousemove = (e, d) => {
        this.Tooltip
            .html('<u>' + d.name + "-" +d.parent+ '</u>' + "<br>" + d.value + "%")
            .style('display', 'block')
            .style("left", (e.x/2+20) + "px")
            .style("top", (e.y/2-30) + "px")
    }
    mouseleave = (e, d) => {
        this.Tooltip
            .style("opacity", 0)
            .style('display', 'none');
    }

    dragstarted = (e, d) => {
        if (!e.active) this.simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    dragged = (e, d) => {
        d.fx = e.x;
        d.fy = e.y;
    }
    dragended = (e, d) => {
        if (!e.active) this.simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }


    // updateVis() {
    //     let vis = this;

    //     vis.renderVis();
    // }

    renderVis() {
        let vis = this;
        vis.svg.selectAll("circle").remove();

        vis.node = vis.svg.append("g")
            .selectAll("circle")
            .data(vis.data)
            .join("circle")
                .attr("class", "node")
                .attr("r", d => vis.size(d.value))
                .attr("cx", vis.width / 2)
                .attr("cy", vis.height / 2)
                .style("fill", d => vis.cScale(d.parent))
                .style("fill-opacity", 0.8)
                .attr("stroke", "black")
                .style("stroke-width", 1)
                .on("mouseover", vis.mouseover) 
                .on("mousemove", vis.mousemove)
                .on("mouseleave", vis.mouseleave)
                .call(d3.drag() 
                    .on("start", vis.dragstarted)
                    .on("drag", vis.dragged)
                    .on("end", vis.dragended));


        vis.simulation = d3.forceSimulation()
            .force("x", d3.forceX().strength(0.5).x(d => vis.xScale(d.parent)))
            .force("y", d3.forceY().strength(0.1).y( vis.height/2 ))
            .force("center", d3.forceCenter().x(vis.width / 2).y(vis.height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (vis.size(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping

        vis.simulation
            .nodes(vis.data)
            .on("tick", function(d){
                vis.node.attr("cx", d => d.x)
                        .attr("cy", d => d.y)
            });
    }
}