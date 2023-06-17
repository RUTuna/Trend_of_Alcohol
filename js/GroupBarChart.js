export class GroupeBarChart {
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
        
        // List of subgroups = header of the csv files = soil condition here
        vis.subgroups = vis.data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        vis.groups = vis.data.map(d => d.generation)

        // append the svg object to the body of the page
        vis.svg = d3.select(vis.config.parentElement)
            .append("svg")
            .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
        // Add X axis
        vis.xScale = d3.scaleBand()
            .domain(vis.groups)
            .range([0, vis.width])
            .padding([0.2])

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(vis.xScale).tickSize(0));

        // Add Y axis
        vis.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([ vis.height, 0 ]);

        vis.svg.append("g")
            .call(d3.axisLeft(vis.yScale));

        // Another scale for subgroup position?
        vis.xSubgroup = d3.scaleBand()
            .domain(vis.subgroups)
            .range([0, vis.xScale.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        vis.cScale = d3.scaleOrdinal()
            .domain(vis.subgroups)
            .range(['#e41a1c','#377eb8','#4daf4a', '#333333'])

        // Show the bars
        vis.svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(vis.data)
            .join("g")
            .attr("transform", d => `translate(${vis.xScale(d.generation)}, 0)`)
            .selectAll("rect")
            .data(function(d) { return vis.subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .join("rect")
            .attr("x", d => vis.xSubgroup(d.key))
            .attr("y", d => vis.yScale(d.value))
            .attr("width", vis.xSubgroup.bandwidth())
            .attr("height", d => vis.height - vis.yScale(d.value))
            .attr("fill", d => vis.cScale(d.key));

    }

    // updateVis() {
    //     let vis = this;

    //     vis.renderVis();
    // }

    // renderVis() {
    // }
}

