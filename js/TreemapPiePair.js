import { TreemapChart } from "./TreemapChart.js";
import { PieChart } from "./PieChart.js";

/* Link 된 Treemap 과 Pie Chart */
export class TreemapPirPair {
    constructor(_config, _data, _parent) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || window.innerWidth - 300,
            containerHeight: _config.containerHeight || window.innerHeight - 100,
            margin: _config.margin || { top: 5, right: 10, bottom: 50, left: 10 },
        };
        this.data = _data;
        this.curParent = _parent ? _parent : "맥주";
        this.pieData = {};
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.data.forEach(function (d) {
            const parent = d.parent;
            if (!vis.pieData[parent]) {
                vis.pieData[parent] = [];
            }
            vis.pieData[parent].push(d);
        });

        vis.treemap = new TreemapChart(vis.config, vis.data);
        vis.pie = new PieChart(vis.config, vis.pieData[vis.curParent], vis.curParent);
    }

    renderVis = () => {
        let vis = this;
        vis.pieData = {};
        vis.data.forEach(function (d) {
            const parent = d.parent;
            if (!vis.pieData[parent]) {
                vis.pieData[parent] = [];
            }
            vis.pieData[parent].push(d);
        });

        vis.treemap.data = vis.data;
        vis.pie.data = vis.pieData[vis.curParent];
        vis.pie.name = vis.curParent;
        vis.treemap.renderVis();
        vis.pie.renderVis();
    };

    handlePie = (e, d) => {
        let vis = this;
        vis.curParent = d.parent.id;
        vis.pie.name = vis.curParent;
        vis.pie.data = vis.pieData[vis.curParent];
        vis.pie.renderVis();
    };
}
