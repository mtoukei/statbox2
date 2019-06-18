import storeBase from "../store/store-base";
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
  if (val.estat) {
    const target = val.statData[val.statData.length - 1];
    const allPrefData = target.data;
    dataset = target.data2;
    statName = val.statName;
    unit = allPrefData[0]['@unit'];
  } else {
    dataset = val.statData.data;
    statName = val.statData.title;
    unit = val.statData.unit;
  }
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  const multi = width / defaultWidth < 1.5? width / defaultWidth: 1.5;
  const margin = { 'top': 60 * multi, 'bottom': 60 * multi, 'right': 60 * multi, 'left': 20 * multi };
  //トランジションフラグ----------------------------------------------------------------------------
  let transitionFlg  = storeBase.state.statList.transition;
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset
    }
    create () {
      if (prefOrCity === 'pref') this.dataset.shift();
    }
  }
  //---------------------------------------------------------------------------------------------
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // --------------------------------------------------------------------------------------------
  const histgramCreate = dataset => {
    // SVG領域作成---------------------------------------------------------------------------
    palentDiv.select('.chart-svg').remove();
    const svg = palentDiv.select('.resizers').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 '+ width + ' '  + height)
    .attr('preserveAspectRatio', 'xMidYMid')
    .classed("svg-content-responsive", true)
    .classed("chart-svg", true);
    // -------------------------------------------------------------------------------------------
    const map = dataset.map( d => d.data);
    // console.log(map)
    // xスケール----------------------------------------------------------------------------------
    const xScale = d3.scaleLinear()
    .rangeRound([0, width - margin.left - margin.right])
    .domain([0,d3.max(map)]);
    // ヒストグラムデータ---------------------------------------------------------------------------
    const histoData = d3.histogram()
    .domain(xScale.domain())
    .thresholds(xScale.ticks(6))(map);
    // console.log(histoData)
    // yスケール----------------------------------------------------------------------------------
    const yScale= d3.scaleLinear()
    .domain([0, d3.max(histoData, d => d.length)])
    .range([height - margin.top - margin.bottom, 0]);
    // バー---------------------------------------------------------------------------------------
    const bar = svg.selectAll(".bar")
    .data(histoData)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d) {
      return "translate(" + (xScale(d.x0) + margin.left )+ "," + margin.top + ")";
    });
// バー-----------------------------------------------------------------------------------------
//     var tip = d3Tip()
//     .attr('class', 'd3-tip')
//     .offset([-10, 0])
//     .html(function(d) {
//       return "Frequency: <span>888888"  + "</span>";
//     })
    const rect = bar.append("rect")
    .attr("x", 1)
    .attr("width", xScale(histoData[0].x1) - xScale(histoData[0].x0) - 3)
    .attr('fill', 'slategray')
    .attr('y', yScale(0))
    .attr('height', 0);
    if (transitionFlg) {
      rect.transition()
      .duration(1500)
      .attr('y',  d => yScale(d.length))
      .attr("height", d => height - yScale(d.length) - margin.bottom - margin.top);
    } else {
      rect.attr('y',  d => yScale(d.length))
      .attr("height", d => height - yScale(d.length) - margin.bottom - margin.top);
    }
    // const tip = d3Tip().attr('class', 'd3-tip').html(function(d) { return d; });
    // svg.call(tip)
    // rect
    // .on('mouseover', function (d) {
    //   return tip.show(11,this)
    // }) /* tooltipを表示 */
    // .on('mouseout', tip.hide)  /* tooltipを非表示 */


    // バーのテキスト-----------------------------------------------------------------------------
    const text = bar.append("text")
    .attr('fill', 'black')
    .attr('font-size', 10 * multi + 'px')
    .attr("text-anchor", "middle")
    .text(d => { if (d.length) return d.length + '市町村' })
    .attr("x", (xScale(histoData[0].x1) - xScale(histoData[0].x0)) / 2)
    .attr('y',  d => yScale(d.length) - 5)
    .attr('opacity', 0);
    if (transitionFlg) {
      text.transition()
      .duration(4000)
      .attr('opacity', 1);
    } else {
      text.attr('opacity', 1);
    }
    // x軸描画---------------------------------------------------------------------------------
    const kankaku = histoData[0].x1 - histoData[0].x0;
    const tick = histoData.map((d,i) => kankaku * (i + 1) - kankaku / 2);
    const xAxis = d3.axisBottom(xScale)
    .tickValues(tick);
    svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + (height- margin.bottom) + ")")
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', 10 * multi + 'px')
    .attr('transform', 'rotate(45)')
    .attr('text-anchor', 'start');
    // 単位------------------------------------------------------------------------------------
    svg.append('g')
    .attr('transform', 'translate(' + (width - 20) +  ',' + (height - margin.bottom + 35) + ')')
    .append('text')
    .text('単位:' + unit)
    .attr('text-anchor', 'end')
    .attr('font-size', 10 * multi + 'px');
    // 表名-------------------------------------------------------------------------------------
    svg.append('g')
    .attr('font-size', 12 * multi + 'px')
    .attr('transform', () => 'translate(5,' + (12 * multi + 5)  + ')')
    .attr('class' ,'no-print')
    .append('text')
    .text(statName);
  };
  histgramCreate(dc.dataset);
  //--------------------------------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    const dc = new DataCreate(JSON.parse(JSON.stringify(val.statData[value].data2)));
    dc.create();
    transitionFlg = false;
    histgramCreate(dc.dataset)
  };
  //--------------------------------------------------------------------------------------------
  const type = ie? 'change': 'input';
  Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
  eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-' + prefOrCity + ' .year-range'), type, (() => {
    return e => rangeInput(e)
  })(1), false);
}
