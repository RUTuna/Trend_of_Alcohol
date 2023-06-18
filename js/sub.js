import { CircularPakingChart } from "./CircularPackingChart.js";
import { GroupeBarChart } from "./GroupBarChart.js";
import { PieChart } from "./PieChart.js";
import { TreemapChart } from "./TreemapChart.js";
import { TreemapPirPair } from "./TreemapPiePair.js";

const files = ["home.csv", "outside.csv", "alone.csv", "together.csv"];

let prefer_type = {};
let cur_generation = "Z"
let cur_type = "home"
let preferTree_Z, preferTree_M, preferTree_X, preferCircle_Z;
let preferTree = [];
let generation = ["Z", "M", "X"];

Promise.all(files.map(function(filename) {
    return d3.csv("./data/" + filename);
})).then(function(result) {
        prefer_type = {
            home: {},
            outside: {},
            alone: {},
            together: {}
        };

        let i;
        const contry = ["맥주", "소주", "양주", "혼합주", "전통주", "동양술"];
        for(i=0; i<4; i++) {
            const type = files[i].split(".")[0]
            result[i].forEach(function(d) {
                const generation = d.generation;
                if (!prefer_type[type][generation]) {
                  prefer_type[type][generation] = [];
                }
                prefer_type[type][generation].push(d);
              });
        }

        const processData = {
            Z: prefer_type[cur_type][""].concat(prefer_type[cur_type]["Z"]),
            M: prefer_type[cur_type][""].concat(prefer_type[cur_type]["M"]),
            X: prefer_type[cur_type][""].concat(prefer_type[cur_type]["X"])
        }

        console.log(window.innerHeight)
        // const text = new PieChart({ parentElement: '#pie', containerWidth:  window.innerWidth*0.6, containerHeight: window.innerHeight/3, margin: {top: 10, right: 30, bottom: 20, left: 10}}, {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}, "name");
        preferTree[0] = new TreemapPirPair({ parentElement: '#chartZ', containerWidth:  window.innerWidth, containerHeight: window.innerHeight*0.3, margin: {top: 10, right: 10, bottom: 20, left: 10}}, processData.Z);
        preferTree[1] = new TreemapPirPair({ parentElement: '#chartM', containerWidth: window.innerWidth, containerHeight:  window.innerHeight*0.3, margin: {top: 10, right: 10, bottom: 20, left: 10}}, processData.M);
        preferTree[2] = new TreemapPirPair({ parentElement: '#chartX', containerWidth: window.innerWidth, containerHeight:  window.innerHeight*0.3, margin: {top: 10, right: 10, bottom: 20, left: 10}}, processData.X);

        preferTree.forEach(tree => {
            tree.treemap.svg.selectAll("rect")
                .on("click", handlePie);
        })

        const typeRadio = Array.from(document.getElementsByClassName('typeRadio'));
        typeRadio.forEach((radio)=>{
            radio.addEventListener('change', handleTypeRadio)
            })
    }).catch(error => {
        console.error('Error loading the data : ', error);
    });

function handlePie(e, d) {
    preferTree.forEach(tree => {
        tree.curParent = d.parent.id
        tree.pie.name = tree.curParent
        tree.pie.data = tree.pieData[tree.curParent]
        tree.pie.renderVis()
    })
}

function handleTypeRadio(e) {
    cur_type = e.target.value;
    console.log(prefer_type[cur_type][cur_generation])
    // preferCircle_Z.data = prefer_type[cur_type][cur_generation];
    // preferCircle_Z.renderVis();

    preferTree.forEach((tree, i) => {
        tree.data = prefer_type[cur_type][""].concat(prefer_type[cur_type][generation[i]])
        tree.renderVis()
    })
}
