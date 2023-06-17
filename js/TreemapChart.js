export class TreemapChart {
    constructor(_config, _data){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || window.innerWidth - 300,
            containerHeight: _config.containerHeight || window.innerHeight - 100,
            margin: _config.margin || {top: 5, right: 100, bottom: 50, left: 100}
          }
        this.data = _data;
        this.initVis();
    }

    initVis(){
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // append the svg object to the body of the page
        vis.svg = d3.select(vis.config.parentElement)
            .append("svg")
            .attr("class", "treemapchart")
            .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        
        vis.renderVis()
    }

    // updateVis() {
    //     let vis = this;

    //     vis.renderVis();
    // }

    renderVis() {
        let vis = this;
        vis.root = d3.stratify()
            .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
            .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
            (vis.data);
            
        vis.root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity
        vis.cScale = d3.scaleOrdinal()
            .domain(vis.root.children)
            .range(d3.schemeTableau10);

        // Then d3.treemap computes the position of each element of the hierarchy
        // The coordinates are added to the root object above
        d3.treemap()
            .size([vis.width, vis.height])
            .padding(2)
            (vis.root)

          // use this information to add rectangles:
        vis.svg.selectAll("rect")
          .data(vis.root.leaves(), (d) => d.data.name) // Use key function to bind data by name
          .join(
              enter => enter.append("rect")
                  .attr('class', (d) => { return d.parent.id; })
                  .attr('x', (d) => { return d.x0; })
                  .attr('y', (d) => { return d.y0; })
                  .attr('width', 0) // Set initial width to 0
                  .attr('height', 0) // Set initial height to 0
                  .style("stroke", "black")
                  .style("fill", d => vis.cScale(d.parent))
                  .style('opacity', '0.5')
                  .on("mouseover", (e, d) => {
                      d3.selectAll('.' + d.parent.id).style('opacity', '1');
                  })
                  .on("mouseleave", (e, d) => {
                      d3.selectAll('.' + d.parent.id).style('opacity', '0.5');
                  })
                  .attr('x', (d) => { return d.x0; })
                      .attr('y', (d) => { return d.y0; })
                      .attr('width', (d) => { return d.x1 - d.x0; }) // Transition to the final width
                      .attr('height', (d) => { return d.y1 - d.y0; }) // Transition to the final height
                  .call(enter => enter.transition().duration(0) // Set animation duration to 1 second
                      .attr('x', (d) => { return d.x0; })
                      .attr('y', (d) => { return d.y0; })
                      .attr('width', (d) => { return d.x1 - d.x0; }) // Transition to the final width
                      .attr('height', (d) => { return d.y1 - d.y0; }) // Transition to the final height
                  ),
              update => update
                  .attr('class', (d) => { return d.parent.id; })
                  .call(update => update.transition().duration(500) // Set animation duration to 1 second
                      .attr('x', (d) => { return d.x0; })
                      .attr('y', (d) => { return d.y0; })
                      .attr('width', (d) => { return d.x1 - d.x0; }) // Transition to the final width
                      .attr('height', (d) => { return d.y1 - d.y0; }) // Transition to the final height
                  ),
              exit => exit
                  .call(exit => exit.transition().duration(500) // Set animation duration to 1 second
                      .attr('x', (d) => { return d.x0; })
                      .attr('y', (d) => { return d.y0; })
                      .attr('width', 0) // Transition to width 0 for removal
                      .attr('height', 0) // Transition to height 0 for removal
                      .remove()
                  )
          );

        // and to add the text labels
        vis.svg.selectAll("text")
        .data(vis.root.leaves(), (d) => d.data.name) // Use key function to bind data by name
        .join(
            enter => enter.append("text")
                .attr('class', (d) => { return d.data.parent; })
                .attr("x", (d) => { return d.x0 + (d.x1 - d.x0)/2; })
                .attr("y", (d) => { return d.y0 + (d.y1 - d.y0)/2; })
                .style('width', (d) => { return d.x1 - d.x0; })
                .style('height', (d) => { return d.y1 - d.y0; })
                .text((d) => { return d.data.name; })
                .attr("font-size", "10px")
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .style('opacity', '0.5')
                .call(enter => enter.transition().duration(500) // Set animation duration to 1 second
                    .attr("x", (d) => { return d.x0 + (d.x1 - d.x0)/2; })
                    .attr("y", (d) => { return d.y0 + (d.y1 - d.y0)/2; })
                ),
            update => update
                .attr('class', (d) => { return d.data.parent; })
                .call(update => update.transition().duration(500) // Set animation duration to 1 second
                    .attr("x", (d) => { return d.x0 + (d.x1 - d.x0)/2; })
                    .attr("y", (d) => { return d.y0 + (d.y1 - d.y0)/2; })
                ),
            exit => exit
                .call(exit => exit.transition().duration(500) // Set animation duration to 1 second
                    .attr("x", (d) => { return d.x0 + (d.x1 - d.x0)/2; })
                    .attr("y", (d) => { return d.y0 + (d.y1 - d.y0)/2; })
                    .remove()
                )
        );

    }
}