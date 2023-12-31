# Trend of Alcohol

**[2023 정보 시각화 Assignmnet 2]**

# Basic Info

## Teaser
<p align="center">
    <image src="./docs/Untitled%2010.png" width="45%">
    <image src="./docs/Untitled%2011.png" width="45%">
</p>

## Feature

- 2개의 page 로 구성
1. **Main : 음주 성향 분석** 
    - 술과 술자리 선호 성향, 1회 평균 음주량에 대한 데이터를 제공
    - 세대별로 비교 가능
2. **Sub : 선호 주종 성향 분석** 
    - 각 상황에 따른 선호 주종 데이터를 제공
    - 세대별로 비교 가능

## Purpose

- 세대별 (Z, M, X 세대) 음주 성향 파악

## How to use?

- 코드 다운로드 후 porting 하면 바로 사용 사용 가능 
- 또는 아래 Git 페이지를 통해 접속 
[Link](https://rutuna.github.io/Trend_of_Alcohol/)

## User scenarios

- 메인 페이지를 통해 술과 술자리 선호 성향, 1회 평균 음주량에 대한 데이터 비교 가능
- 우측 상단 버튼을 사용하여 서브페이지로 이동하여 선호 주종 성향을 비교 가능

---

# Data

## Used Data

- 대학내일20대연구소(2023년 4월)에서 전국 18개 시도에서 19-53세의 1200명 남녀를 대상으로 최근 3개월 내 음주 경험을 조사하여 음주 행태, 인식, 소비 성향을 파악한 기본 자료를 사용
[https://www.20slab.org/Archives/38479](https://www.20slab.org/Archives/38479)
- 해당 데이터는 연령/세대별로 각 항목에 대한 조사 결과를 엑셀 파일로 제공하는 유료 데이터이며, 보호 파일이므로 원하는 형식으로 CSV 파일로 생성해야 함
- 해당 데이터의 저작권 관련 사용 문제는 사전에 이메일로 승낙을 받음

<image align="center" src="./docs/Untitled.png" width="40%">

- 본 데이터는 연령대 및 세대 범위로 분류되어 있으며, Z/M/X 세대, Z/후기 M/전기 M/X 세대로 분류
- 이 프로젝트에서는 Z/M/X 세대 간의 음주 성향을 분석하고자 하였으며, 각 세대의 기준은 다음과 같음
    - Z 세대: 대체로 1990년대 중반 - 2000년대 후반 출생자를 의미합니다. 본 데이터에서는 1996-2004년 출생자를 Z 세대로 지칭
    - M 세대 (밀레니얼 세대): 대체로 1980년대 초반 - 1990년대 중반 출생자를 의미합니다. 본 데이터에서는 1981-1995년 출생자를 M 세대로 지칭
    - X 세대: 대체로 1970년대 출생자를 의미합니다. 본 데이터에서는 1970-1980년 출생자를 X 세대로 지칭

- 이 프로젝트에서 세대별 음주 성향과 선호하는 주종의 비교를 하고자 했으므로 아래 데이터를 사용
    1. SQ5. 음주 선호 성향 (단수)
    2. A3. [홈술] 주 음용 주종 (경험 없음 응답자 제외, 복수)
    3. A3-1. [홈술] 1회 평균 음주량 1) 소주 (단수)
    4. A4. [밖술] 주 음용 주종 (경험 없음 응답자 제외, 복수)
    5. A4-1. [밖술] 1회 평균 음주량 1) 소주 (단수)
    6. A5-1. [혼술] 주 음용 주종 (복수)
    7. A5-2. [혼술] 1회 평균 음주량 1) 소주 (단수)
    8. A6-1. [떼술] 주 음용 주종 (복수)
    9. A6-2. [떼술] 1회 평균 음주량 1) 소주 (단수)

## Preprosessing of Data

- 원본 데이터에서 생성한 데이터는 다음과 같음
    1. tendency.csv → 음주 선호 성향
    2. quantity.csv → 상황별 1회 평균 음주량 (소주 기준)
    3. home.csv, outside.csv, alone.csv, together.csv → 상황별 주 음용 주종
- 3번 data의 경우 treemap 과 piechart 생성을 위해 세대별로 데이터를 분리하는 추가 과정이 진행되

---

# Visual Method

- 2가지 페이지에 각자 다른 데이터를 표시

## 음주 선호 성향 & 상황별 1회 평균 음주량

### Visual encoding

<p align="center">
    <image src="./docs/Untitled%201.png" width="45%">
    <image src="./docs/Untitled%202.png" width="45%">
</p>

- Category Attribute  2가지 (세대, 성향/상황), Quantity Attribute 가 1가지를 가지고 있는 Tabular Data 사용
- 이를 잘 표현할 수 있는 Group Bar Chart 를 사용
- color mark 는 성향/상황를 기준으로 색상을 사용
- category attribute 이기에 비교가 쉬운 색상을 사용

### Interaction

<image align="center" src="./docs/Untitled%203.png" width="90%">

- 세대별로 group 이 나눠져 있기에 세대별 성향/상황을 직접적으로 비교하기는 다소 복잡할 수 있다
- 그렇기에 mouse hover 에 따라 Highliting을 추가하여 비교할 수 있기 쉽게 하였다

## 상황별 주 음용 주종

### Visual encoding

<image align="center" src="./docs/Untitled%204.png" width="90%">

**Treemap**

- Network Data 로 그 중 Hirachy 구조가 있는 Tree Data 를 사용
- 주종 별로 hirachy 구조를 가지고 있으며 leaf Node 는 각 비율을 나타내는 Quantity Attribute 를 가지고 있다
- 원래 Circular packing 사용을 고려했으나 여러 단점이 있었고 (아래에 설명) 이러한 단점을 보완하고자 Treemap 을 사용하기로 하였다
- Quantity Attribute 를 encoding 하는데 각 entity 의 area를 size mark 로 사용하였다
- color mark 는 대분류를 기준으로 동일한 색상을 사용하였고 category attribute 이기에 비교가 쉬운 색상을 사용하였다

**Pie Chart**

- Treemap 의 경우 respect ratio 로 인해 area의 절대적인 값을 비교하기 어렵다는 문제가 있다
- 값을 비교하기 쉽게끔 multi view 를 사용하였고 다른 view 로 treemap 과 연결된 pie chart 를 사용하였다
- legend 를 추가하여 절대적인 값을 확인할 수 있고, 대분류 명칭을 pie chart 중앙에 표시하였다
- color mark 는 소분류를 기준으로 동일한 색상을 사용하였고 category attribute 이기에 비교가 쉬운 색상을 사용하였다

### Interaction

**Mouse Hover**

<p align="center">
    <image src="./docs/Untitled%205.png" width="60%">
    <image src="./docs/Untitled%206.png" width="30%">
</p>

- 세대별로 Treemap 과 pie chart가  나눠져 있기에 세대별 선호 주종을 직접적으로 비교하기는 다소 복잡할 수 있다.
- 그렇기에 Treemap 과 pichart 에서 mouse hover 에 따라 Highliting을 추가하여 비교할 수 있기 쉽게 하였다

**Mouse Click**

- Treemap 에서 대분류를 선택하면 pie chart 가 link 되어 해당 대분류에 속하는 소분류 값들을 보여준다
- 이 interaction은 모든 세대 chart 에 동일하게 적용된다

### Filtering

<image src="./docs/Untitled%207.png" width="90%">

- 각 상황에 따라 선호하는 주종이 달라질 수 있다
- 이를 확인할 수 있게 Radio 버튼을 추가하여 필터링 기능을 사용했다
- 본 task 의 목적은 세대별 비교이기에 상황별 비교는 상대적으로 덜 중요하다고 생각하였다.
- 그렇기에 모든 세대의 chart를 한번에 보여주고, 상황별 chart는 필터링 방식을 사용했다.

### Animation

- interaction 에 따라 treemap과 pie chart에 변화 animation을 추가해주었다
- 이는 treemap 이 달라질 때 동일한 값의 변화를 쉽게 볼 수 있게끔 하기 위함이다

** +) Circular Packing**
<p align="center">
    <image src="./docs/Untitled%208.png" width="45%">
    <image src="./docs/Untitled%209.png" width="45%">
</p>

- 초기에는 circular packing 사용을 고려하였고 구현 또한 완료한 상황이었다.
- Quantity Attribute 를 encoding 하는데 circle 의 radius 를 size mark 를 사용하였다
- drag interaction 을 추가하여 circle 을 drag 로 옮기며 다른 mark 과 크기 비교를 할 수 있게 하였다
- mouse hover interaction 를 추가하여 hover 하면 tooltip 이 나타나 상세한 값을 볼 수 있게 하였다
- 하지만 라벨을 하나하나 달지 못 하여 값 비교를 위해선 하나하나 기억해야한다는 load overhead 문제에 의해 사용이 기각되었다.

---

# Observation Result

## 음주 선호 성향

- 세대간 비슷한 선호 성향을 보인다. 술과 술자리 모두 선호하는 사람이 가장 많았으며, 술과 술자리 모두 비선호하는 사람이 가장 적었다. 최근 3개월간 음주 경험이 있는 사람을 대상으로 조사하였기에 이러한 결과가 보인 것으로 예상된다
- 술은 선호하지 않지만 술자리는 선호하는 사람이 2번째로 많았다
- 세대간 큰 차이는 없으나 X 세대로 갈 수록 술과 술자리 모두 선호하는 사람의 비율이 늘어나고, 술은 빈선호하나 술자리를 선호하는 사람의 비율이 줄어든다. 이는 나이가 많아질 수록 술을 선호하는 사람만 술을 마신다고 생각할 수 있다.

## 상황별 1회 평균 음주량

- 상황에 따른 값은 세대간 비슷한 경향을 보인다.
- Z 세대로 갈 수록 평균 음주량이 늘어난다. 하지만 오히려 X 세대로 갈 수록 혼자 음주를 할 때 마시는 양이 늘어난다.  젊은 나이 층에서는 사람들과 어울릴 때 술을 더 많이 마시는 경향이 있다는 것을 확인할 수 있다.

## 상황별 주 음용 주종

- 맥주를 가장 많이 마시고 소주를 그 다음으로 많이 마신다는 경향은 세대별로 동일하다. 하지만 Z 세대로 갈 수록 과일 맥주, 과일 소주 와 같은 달콤한 류의 술을 선호한다는 점을 알 수 있다.
- Z 세대로 갈 수록 탄산주, 사과주, 사케 등의 도수가 낮고 다양한 종류의 술이 선호되는 경향을 볼 수 있고, X 세대로 갈 수록 막걸리의 선호 비중이 높아지는 것을 알 수 있다. 보통 어른들이 막걸리를 좋아한다고 하는데 그러한 경향이 사실임을 확인할 수 있었다.
- 양주에 대한 선호도는 비슷하지만 X 세대로 갈 수록 와인과 위스키의 비중이 높아진다. 젊은 세대에는 다양한 술을 음용하는 것을 선호하나, 경험이 많아질 수록 취향에 맞는 술을 마신다고 생각할 수 있다.
- 혼자 술을 마시거나 집에서 술을 마시는 경우는 맥주의 비중이 앞도적으로 높지만, 타인과 혹은 밖에서 술을 마시는 경우는 맥주 외의 주종의 비율이 높아지는 것을 확인 할 수 있었다. 이는 맥주가 다른 술에 비해 접근성이 낮으며, 도수가 낮아 혼자 마시기에 편하기 때문이라고 볼 수 있다. 또한 맥주나 소주가 다른 종류에 비해 가격이 낮기에 혼자 마실 때 부담이 덜하다는 이유도 있습니다. 

---

## **Discussion**

- 바쁜 일정으로 인해 2일이라는 짧은 시간 동안 제작했습니다. 그렇기에 디테일한 점이라던가, 디자인을 깔끔하게 구상하지 못 한 점이 아쉽다. 시간이 가능하다면 더 많은 데이터를 추가하고 색상 또한 major category 간 동일한 계열의 색상을 사용하는 방향으로 수정하고 싶습니다. 
- 흥미있는 주제에 대해서 과제를 할 수 있어서 재밌었습니다. 과제를 위하여 다소 비싼 데이터를 구매했지만 후회없는 선택이었습니다. 