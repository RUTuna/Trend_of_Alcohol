export class PieChart {
    constructor(_config, _data, _name){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || window.innerWidth - 300,
            containerHeight: _config.containerHeight || window.innerHeight - 100,
            margin: _config.margin || {top: 5, right: 100, bottom: 50, left: 100}
          }
        this.data = _data;
        this.name = _name;
        this.initVis();
    }

    initVis(){
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.radius = Math.min(vis.width, vis.height) / 2 - vis.config.margin.left - vis.config.margin.right;

        // append the svg object to the body of the page
        vis.svg = d3.select(vis.config.parentElement)
            .append("svg")
            .attr("class", "piechart")
            .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.width/2-vis.radius},${vis.height/2})`);
            

            
        // Compute the position of each group on the pie:
        vis.pie = d3.pie()
              .sort(null) // Do not sort group by size
              .value(d => d.value)
            
        // The arc generator
        vis.arc = d3.arc()
              .innerRadius(vis.radius * 0.5)         // This is the size of the donut hole
              .outerRadius(vis.radius * 0.9)
            
        // Another arc that won't be drawn. Just for labels positioning
        // vis.outerArc = d3.arc()
        //       .innerRadius(vis.radius * 0.9)
        //       .outerRadius(vis.radius * 0.9)
            
        

        vis.renderVis()
    }

    // updateVis() {
    //     let vis = this;

    //     vis.renderVis();
    // }

    renderVis() {
        let vis = this;
        vis.svg.selectAll("path").remove();
        vis.svg.selectAll(".legend_text").remove();
        vis.svg.selectAll(".legend_rect").remove();
        vis.svg.selectAll("text").remove();

        // set the color scale
        vis.color = d3.scaleOrdinal()
            .domain(vis.data.map(d => d.name)) 
            .range(d3.schemeTableau10);

        vis.data_ready = vis.pie(vis.data.map(d => ({ name: d.name, value: d.value })))

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        vis.svg
              .selectAll('allSlices')
              .data(vis.data_ready)
              .join('path')
              .attr('class', (d) => { return d.data.name })
              .attr("transform", `translate(${-vis.width*0.2}, 0)`)
              .attr('d', vis.arc)
              .attr('fill', d => vis.color(d.data.value))
              .attr("stroke", "grey")
              .style("stroke-width", "1px")
              .style("opacity", 0.5)
              .on("mouseover", (e, d) => {
                d3.selectAll('.' + d.data.name).style('opacity', '1');
                })
                .on("mouseleave", (e, d) => {
                    d3.selectAll('.' + d.data.name).style('opacity', '0.5');
                })
                .transition() // Add transition effect
                .duration(500) // Set the duration of the transition
                .attrTween('d', function (d) {
                const interpolate = d3.interpolate(d.startAngle, d.endAngle);
                return function (t) {
                    d.endAngle = interpolate(t);
                    return vis.arc(d);
                }
                });
                
            
        //     // Add the polylines between chart and labels:
        // vis.svg
        //       .selectAll('allPolylines')
        //       .data(vis.data_ready)
        //       .join('polyline')
        //       .attr("stroke", "black")
        //       .style("fill", "none")
        //       .attr("stroke-width", 1)
        //       .attr('points', function(d) {
        //         const posA = vis.arc.centroid(d); // line insertion in the slice
        //         const posB = vis.outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        //         const posC = [...posB]; // Label position = almost the same as posB
        //         const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        //         posC[0] += (vis.radius * 0.5 * (midangle < Math.PI ? 1 : -1)); // multiply by 1 or -1 to put it on the right or on the left
        //         return [posA, posB, posC];
        //       })
            
        //     // Add the polylines between chart and labels:
        // vis.svg
        //     .selectAll('allLabels')
        //     .data(vis.data_ready)
        //     .join('text')
        //     .text(d => d.data.name)
        //     .attr("class", "pieLabel")
        //     .attr('transform', function(d) {
        //         const pos = vis.outerArc.centroid(d);
        //         const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        //         pos[0] += vis.radius * 0.55 * (midangle < Math.PI ? 1 : -1);
        //         return `translate(${pos})`;
        //     })
        //     .style('text-anchor', function(d) {
        //         const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        //         return (midangle < Math.PI ? 'start' : 'end');
        //     });

        const legends = vis.svg.append("g")
            .attr("transform", `translate(0, ${-vis.height*0.5})`)
            .selectAll(".legends").data(vis.data_ready);
        
        const legend = legends.enter()
            .append("g")
            .attr("class","pieLegend")
            .attr("transform", (d,i)=>{return `translate(0,${(i+1)*30})`;
        });
        
        // list of each country as labels and its styles

        legend.append("rect")
            .attr("width",15)
            .attr("height",15)
            .attr("class","legend_rect")
            .attr("fill", d => vis.color(d.data.value));

        legend.append("text")
            .attr("x", 25)
            .attr("y", 15)
            .attr("class","legend_text")
            .text(d => {return d.data.name + " " + Number(d.data.value).toFixed(2) + "%"});

        vis.svg
            .append("text")
            .text(vis.name)
            .attr("transform", `translate(${-vis.width*0.2}, ${vis.height*0.02})`)
            .attr("class", "pieTitle")
    }
}