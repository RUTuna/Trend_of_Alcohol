import { CircularPakingChart } from "./CircularPackingChart.js";
import { GroupeBarChart } from "./GroupBarChart.js";
import { TreemapChart } from "./TreemapChart.js";

const files = ["음주빈도.csv", "음주빈도treemap.csv"];
let tendency = {};

let tendencyBar, tendencyTree_Z, tendencyTree_M, tendencyTree_X;

Promise.all(files.map(function(filename) {
    return d3.csv("./data/" + filename);
})).then(function(result) {
        tendency.bar = result[0];
        tendency.treemap = result[1];

        tendencyBar = new GroupeBarChart({ parentElement: '#group_bar', containerWidth: 460, containerHeight: 400, margin: {top: 10, right: 30, bottom: 20, left: 50}}, tendency.bar);
        tendencyTree_Z = new TreemapChart({ parentElement: '#treemap', containerWidth: 200, containerHeight: 200, margin: {top: 10, right: 10, bottom: 10, left: 10}}, tendency.treemap.slice(0,7));
        tendencyTree_M = new TreemapChart({ parentElement: '#treemap', containerWidth: 200, containerHeight: 200, margin: {top: 10, right: 10, bottom: 10, left: 10}}, tendency.treemap.slice(7,14));
        tendencyTree_X = new TreemapChart({ parentElement: '#treemap', containerWidth: 200, containerHeight: 200, margin: {top: 10, right: 10, bottom: 10, left: 10}}, tendency.treemap.slice(14,21));

    }).catch(error => {
        console.error('Error loading the data : ', error);
    });
