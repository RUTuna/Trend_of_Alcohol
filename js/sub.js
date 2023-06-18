import { CircularPakingChart } from "./CircularPackingChart.js";
import { TreemapPirPair } from "./TreemapPiePair.js";

const files = ["home.csv", "outside.csv", "alone.csv", "together.csv"];

let prefer_type = {};
let cur_generation = "Z";
let cur_type = "home";
let preferTree = [];
let generation = ["Z", "M", "X"];

Promise.all(
    files.map(function (filename) {
        return d3.csv("./data/" + filename);
    })
)
    .then(function (result) {
        prefer_type = {
            home: {},
            outside: {},
            alone: {},
            together: {},
        };

        // 세대별 데이터 분리
        let i;
        for (i = 0; i < 4; i++) {
            const type = files[i].split(".")[0];
            result[i].forEach(function (d) {
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
            X: prefer_type[cur_type][""].concat(prefer_type[cur_type]["X"]),
        };

        preferTree[0] = new TreemapPirPair(
            { parentElement: "#chartZ", containerWidth: window.innerWidth, containerHeight: window.innerHeight * 0.3, margin: { top: 10, right: 10, bottom: 10, left: 0 } },
            processData.Z
        );
        preferTree[1] = new TreemapPirPair(
            { parentElement: "#chartM", containerWidth: window.innerWidth, containerHeight: window.innerHeight * 0.3, margin: { top: 10, right: 10, bottom: 10, left: 0 } },
            processData.M
        );
        preferTree[2] = new TreemapPirPair(
            { parentElement: "#chartX", containerWidth: window.innerWidth, containerHeight: window.innerHeight * 0.3, margin: { top: 10, right: 10, bottom: 10, left: 0 } },
            processData.X
        );

        // event listener 추가
        preferTree.forEach((tree) => {
            tree.treemap.svg.selectAll("rect").on("click", handlePie);
        });

        const typeRadio = Array.from(document.getElementsByClassName("typeRadio"));
        typeRadio.forEach((radio) => {
            radio.addEventListener("change", handleTypeRadio);
        });
    })
    .catch((error) => {
        console.error("Error loading the data : ", error);
    });

/* Treemap 대분류 선택시, 선택에 따라 pie chart data를 변경 */
function handlePie(e, d) {
    preferTree.forEach((tree) => {
        tree.curParent = d.parent.id;
        tree.pie.name = tree.curParent;
        tree.pie.data = tree.pieData[tree.curParent];
        tree.pie.renderVis();
    });
}

/* 선택한 상황에 따른 chart 변경 */
function handleTypeRadio(e) {
    cur_type = e.target.value;
    console.log(prefer_type[cur_type][cur_generation]);
    // preferCircle_Z.data = prefer_type[cur_type][cur_generation];
    // preferCircle_Z.renderVis();

    preferTree.forEach((tree, i) => {
        tree.data = prefer_type[cur_type][""].concat(prefer_type[cur_type][generation[i]]);
        tree.renderVis();
    });
}
