import { GroupeBarChart } from "./GroupBarChart.js";

const files = ["tendency.csv", "quantity.csv"];
let tendency, quantity;
let tendencyBar, quantityBar;

Promise.all(
    files.map(function (filename) {
        return d3.csv("./data/" + filename);
    })
)
    .then(function (result) {
        tendency = result[0];
        quantity = result[1];

        tendencyBar = new GroupeBarChart(
            { parentElement: "#tendency_bar", containerWidth: window.innerWidth * 0.6, containerHeight: window.innerHeight * 0.4, margin: { top: 10, right: window.innerWidth * 0.2, bottom: 20, left: window.innerWidth * 0.2 } },
            tendency,
            ["술, 술자리 모두 선호", "술은 선호하나 술자리는 비선호", "술은 비선호하나 술자리는 선호", "술과 술자리 모두 비선호"],
            ["세대", "세대별 음주 선호 성향 (%)"]
        );
        quantityBar = new GroupeBarChart(
            { parentElement: "#quantity_bar", containerWidth: window.innerWidth * 0.9, containerHeight: window.innerHeight * 0.4, margin: { top: 10, right: 30, bottom: 20, left: 50 } },
            quantity,
            ["집에서", "밖에서", "혼자 마실 때", "같이 마실 때"],
            ["세대", "세대별 소주 기준 1회 평균 주량 (잔)"]
        );
    })
    .catch((error) => {
        console.error("Error loading the data : ", error);
    });
