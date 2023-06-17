import { CircularPakingChart } from "./CircularPackingChart.js";
import { GroupeBarChart } from "./GroupBarChart.js";
import { TreemapChart } from "./TreemapChart.js";

const files = ["음주빈도.csv", "quantity.csv"];
let tendency, quantity;

let tendencyBar, quantityBar;


Promise.all(files.map(function(filename) {
    return d3.csv("./data/" + filename);
})).then(function(result) {
        tendency = result[0];
        quantity = result[1];

        tendencyBar = new GroupeBarChart({ parentElement: '#group_bar', containerWidth: window.innerWidth*0.6, containerHeight: 400, margin: {top: 10, right: 30, bottom: 20, left: 50}}, tendency, ["술, 술자리 모두 선호", "술은 선호하나 술자리는 비선호", "술은 비선호하나 술자리는 선호", "술과 술자리 모두 비선호"]);
        quantityBar = new GroupeBarChart({ parentElement: '#group_bar', containerWidth: window.innerWidth*0.9, containerHeight: 400, margin: {top: 10, right: 30, bottom: 20, left: 50}}, quantity, ["집에서", "밖에서", "혼자 마실 때", "같이 마실 때"]);
        // tendencyTree_Z = new TreemapChart({ parentElement: '#treemap', containerWidth: 200, containerHeight: 200, margin: {top: 10, right: 10, bottom: 10, left: 10}}, tendency.treemap.slice(0,7));
        // tendencyTree_M = new TreemapChart({ parentElement: '#treemap', containerWidth: 200, containerHeight: 200, margin: {top: 10, right: 10, bottom: 10, left: 10}}, tendency.treemap.slice(7,14));
        // tendencyTree_X = new TreemapChart({ parentElement: '#treemap', containerWidth: 200, containerHeight: 200, margin: {top: 10, right: 10, bottom: 10, left: 10}}, tendency.treemap.slice(14,21));

    }).catch(error => {
        console.error('Error loading the data : ', error);
    });
