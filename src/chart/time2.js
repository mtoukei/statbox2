import store from "../store/store";
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length -1 ];
  const palentDiv = d3.select(parentDiv);
  if(palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  let unit;
    const target = val.statData[val.statData.length - 1];
    const allPrefData = target.data;
    dataset = val.statData;
    statName = val.statName;
    unit = allPrefData[0]['@unit'];
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 600;
  const multi = width / defaultWidth < 1.5? width / defaultWidth: 1.5;
  const margin = { 'top': 20 * multi, 'bottom': 30 * multi, 'right': 100 * multi, 'left': 60 * multi };
  //トランジションフラグ----------------------------------------------------------------------------
  let transitionFlg  = store.state.statList.transition;
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset;
      this.timeDataset = {};
      this.maxVal = 0;
      this.legendData = [];
    }
    create () {
      for (let i in this.dataset) {
        for (let j in this.dataset[i].data2) {
          if (!this.timeDataset[this.dataset[i].data2[j].citycode]) {
            this.timeDataset[this.dataset[i].data2[j].citycode] = []
          }
          this.timeDataset[this.dataset[i].data2[j].citycode].push({
            time: this.dataset[i].data2[j].time.substr(0,4),
            data: this.dataset[i].data2[j].data,
            citycode: this.dataset[i].data2[j].citycode,
            cityname: this.dataset[i].data2[j].cityname
          });
          if (this.dataset[i].data2[j].data > this.maxVal) {
            this.maxVal = this.dataset[i].data2[j].data
          }
        }
      }
      this.maxVal = this.maxVal * 1.1;
      // -----------------------------------------------------------------------------------------
      this.legendData = this.dataset[this.dataset.length -1].data2
    }
  }
  //---------------------------------------------------------------------------------------------
  let dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  palentDiv.select('#time2-container-div').remove();
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height)
  .classed("chart-svg", true);
  // -------------------------------------------------------------------------------------------
  const containerDiv = palentDiv.select('.resizers').append('div')
  .attr('id', 'time2-container-div')
  .style('position', 'absolute')
  .style('top', '40px')
  .style('right', 0)
  .style('width', (90 * multi) + 'px')
  .style('height',  (height - 40 * multi) + 'px')
  .style('overflow', 'auto');
  const svgRight = containerDiv.append('svg')
  .attr('width', 70 * multi)
  .attr('height', 999)
  .classed("chart-svg", true);
  const keys = Object.keys(dc.timeDataset);
  const timeData = dc.timeDataset[keys[0]];
  // 最大値に合わせて文字サイズと左マージンを設定
  const len = String(Math.floor(dc.maxVal)).length;
  let fontSize = '8px';
  if (len >= 6) {
    margin.left = 60;
    fontSize = 8 * multi + 'px'
  } else if (len >= 5) {
    margin.left = 50;
    fontSize = 10 * multi + 'px'
  } else if (len >= 3) {
    margin.left = 40;
    fontSize = 10 * multi + 'px'
  } else {
    margin.left = 30;
    fontSize = 10 * multi + 'px'
  }
  margin.left = margin.left * multi;

  // スケール------------------------------------------------------------------------------------
  const xScale = d3.scaleLinear()
  .domain([d3.min(timeData, d =>d.time), d3.max(timeData, d =>d.time)])
  .range([margin.left, width - margin.right]);
  const yScale = d3.scaleLinear()
  .domain([0, dc.maxVal])
  .range([height - margin.bottom, margin.top]);
  // --------------------------------------------------------------------------------------------
  // x軸
  svg.append('g')
  .attr("transform", "translate(" + 0 + "," + (height - margin.bottom) + ")")
  .attr('id', 'time-x-axis')
  .call(
    d3.axisBottom(xScale)
    .ticks((() => {
      return  timeData.length >10? 10: timeData.length
    })())
    .tickSize(margin.top + margin.bottom - height)
  )
  .selectAll('text')
  .text(d => String(d).substr(2,2))
  .attr('x', 0)
  .attr('y', 10)
  .attr('font-size', 10 * multi + 'px')
  .attr('fill', 'black');
  // y軸
  svg.append('g')
  .attr("transform", "translate(" + margin.left + "," + 0 + ")")
  .attr('id', 'time-y-axis')
  .call(
    d3.axisLeft(yScale)
    .tickSize(margin.left + margin.right - width)
  )
  .selectAll('text')
  .attr('font-size', fontSize);
  svg.selectAll(".tick line")
  .attr('stroke', '#ccc')
  .attr('stroke-width', '1px')
  .attr('stroke-dasharray', '2');
  // --------------------------------------------------------------------------------------------
  const colorScale = d3.scaleOrdinal(d3.schemeSet1);
  // パスをループで追加
  for (let key in dc.timeDataset) {
    svg.append("path")
    .datum(dc.timeDataset[key])
    // .classed('time-path', true)
    .attr('class', d => 'time-path time-path-' + d[0].citycode)
    .attr('id', d => 'time-path-' + d[0].citycode)
    .attr('fill', 'none')
    .attr('stroke', colorScale(Number(key)))
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return yScale(d.data); }));
  }
  // --------------------------------------------------------------------------------------------
  const legendG =svgRight.append('g')
  .attr("transform", "translate(" + (2) + "," + (1 * multi) + ")")
  .style('overflow', 'auto')
  .selectAll('text')
  .data(dc.legendData)
  .enter();
  // ボックス-------------------------------------------------------------------------------------
  legendG
  .append('rect')
  .attr('transform',(d,i) => 'translate(0,' + (20 * i * multi) + ')')
  .attr('id', d => 'time-legend-rect-' + d.citycode)
  .attr('class', 'time-legend-rect')
  .attr('width', 20 * multi)
  .attr('height', 12 * multi)
  .attr('stroke', 'black')
  .attr('stroke-width', '0.3px')
  .attr('fill', d => colorScale(Number(d.citycode)))
  .on('click', function() {
    textClick (this)
  });
  // テキスト-------------------------------------------------------------------------------------
  legendG
  .append('text')
  .attr('transform',(d,i) => 'translate(' + (22 * multi) + ',' + (10 * multi + 20 * i * multi) + ')')
  .attr('id', d => 'time-legend-text-' + d.citycode)
  .attr('class', 'time-legend-text')
  .attr('font-size', 10 * multi + 'px')
  .text(d => d.cityname)
  .style('cursor', 'pointer')
  .on('click', function() {
    textClick (this)
  });
  svg.selectAll('.time-path').style('display', 'none');
  svgRight.selectAll('.time-legend-rect').attr('fill', 'white');

  // textClick(svgRight.select('#time-legend-text-45000').node())
  textClick(svgRight.select('.time-legend-text').node());

  function textClick (target) {
    const cityCode = d3.select(target).attr('id').split('-')[3];
    const timePaths = svg.selectAll('.time-path');
    const timePath = svg.select('.time-path-' + cityCode);
    // const pathLength = timePath.node().getTotalLength();
    let maxData = 0;
    if (timePath.style('display') !== 'none') {
      timePath.style('display', 'none');
      // rectを白に-----------------------------------------------------------------------------
      d3.select('#time-legend-rect-' + cityCode)
      .attr('fill', 'white')
    } else {
      timePath.style('display', 'block');
      d3.select('#time-legend-rect-' + cityCode)
      .attr('fill', colorScale(Number(cityCode)))
    }
    // 全ての線での最大値を求める---------------------------------------------------------------
    timePaths.each( function() {
      if (d3.select(this).style('display') !== 'none') {
        const key = d3.select(this).attr('id').split('-')[2];
        const maxData0 = d3.max(dc.timeDataset[key], d =>d.data);
        if (maxData0 > maxData ) maxData = maxData0
      }
    });
    // 新しい最大値でy軸スケールを再作成-------------------------------------------------------
    const yScale = d3.scaleLinear()
    .domain([0, maxData * 1.1])
    .range([height - margin.bottom, margin.top]);
    // 新スケールで線を移動---------------------------------------------------------------------
    timePaths.each(function() {
      d3.select(this)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.data)))
      .attr('stroke-dasharray', 10000);
    });
    // 線をアニメで表示--------------------------------------------------------------------------
    timePath
    .attr("d", d3.line()
    .x(d => xScale(d.time))
    .y(d => yScale(d.data)));
    const pathLength = timePath.node().getTotalLength();
    timePath
    .attr('stroke-dasharray', pathLength)
    .attr('stroke-dashoffset', pathLength)
    .transition()
    .duration(1000)
    // .delay(500)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);
    // 新スケールでy軸表示を変更--------------------------------------------------------------
    svg.select("#time-y-axis")
    .transition()
    .duration(2000)
    .call(
      d3.axisLeft(yScale)
      .tickSize(margin.left + margin.right - width)
    )
    .selectAll('text')
    .attr('font-size', fontSize);
    // ------------------------------------------------------------------------------------------
    svg.selectAll(".tick line")
    .attr('stroke', '#ccc')
    .attr('stroke-width', '1px')
    .attr('stroke-dasharray', '2');
  }
  //--------------------------------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    let dc = new DataCreate(val.statData[value].data2);
    dc.create();
    transitionFlg = false;
    // histgramCreate(dc.dataset)
  };
  //--------------------------------------------------------------------------------------------
  const type = ie? 'change': 'input';
  Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
  eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-' + prefOrCity), type, (() => {
    return e => {
      rangeInput(e)
    }
  })(1), false);
}
