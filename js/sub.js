import { CircularPakingChart } from "./CircularPackingChart.js";
import { GroupeBarChart } from "./GroupBarChart.js";
import { TreemapChart } from "./TreemapChart.js";

const files = ["home.csv", "outside.csv", "alone.csv", "together.csv"];

let prefer_type = {};
let cur_generation = "Z"
let cur_type = "home"
let preferTree_Z, preferTree_M, preferTree_X, preferCircle_Z;

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

        preferTree_Z = new TreemapChart({ parentElement: '#test', containerWidth:  window.innerWidth*0.6, containerHeight: window.innerHeight/3, margin: {top: 10, right: 30, bottom: 20, left: 10}}, prefer_type[cur_type][""].concat(prefer_type[cur_type]["Z"]));
        preferTree_M = new TreemapChart({ parentElement: '#test', containerWidth: window.innerWidth*0.6, containerHeight:  window.innerHeight/3, margin: {top: 10, right: 30, bottom: 20, left: 10}}, prefer_type[cur_type][""].concat(prefer_type[cur_type]["M"]));
        preferTree_X = new TreemapChart({ parentElement: '#test', containerWidth: window.innerWidth*0.6, containerHeight:  window.innerHeight/3, margin: {top: 10, right: 30, bottom: 20, left: 10}}, prefer_type[cur_type][""].concat(prefer_type[cur_type]["X"]));
        // preferCircle_Z = new CircularPakingChart({ parentElement: '#circular_packing', containerWidth: 300, containerHeight: 300, margin: {top: 10, right: 10, bottom: 10, left: 10}}, prefer_type[cur_type][cur_generation], contry);

        // const genRadio = Array.from(document.getElementsByClassName('genRadio'));
        // genRadio.forEach((radio)=>{
        //     radio.addEventListener('change', handleGenRadio)
        //     })
        const typeRadio = Array.from(document.getElementsByClassName('typeRadio'));
        typeRadio.forEach((radio)=>{
            radio.addEventListener('change', handleTypeRadio)
            })
    }).catch(error => {
        console.error('Error loading the data : ', error);
    });

// function handleGenRadio(e) {
//     cur_generation = e.target.value;
//     console.log(prefer_type[cur_type][cur_generation])
//     preferCircle_Z.data = prefer_type[cur_type][cur_generation];
//     preferCircle_Z.renderVis();

//     preferTree_Z.data = prefer_type[cur_type][""].concat(prefer_type[cur_type][cur_generation])
//     preferTree_Z.renderVis()
// }

function handleTypeRadio(e) {
    cur_type = e.target.value;
    console.log(prefer_type[cur_type][cur_generation])
    // preferCircle_Z.data = prefer_type[cur_type][cur_generation];
    // preferCircle_Z.renderVis();

    preferTree_Z.data = prefer_type[cur_type][""].concat(prefer_type[cur_type]["Z"])
    preferTree_Z.renderVis()
    preferTree_M.data = prefer_type[cur_type][""].concat(prefer_type[cur_type]["M"])
    preferTree_M.renderVis()
    preferTree_X.data = prefer_type[cur_type][""].concat(prefer_type[cur_type]["X"])
    preferTree_X.renderVis()
}
