import storeBase from '../store/store-base'
import * as ss from 'simple-statistics'
import * as Common from './common'
const eventkey = {};
export default function (leftVal, rightVal, prefOrCity, palentDiv) {
  if (!leftVal.statData.length) return;
  const leftDataset = JSON.parse(JSON.stringify(leftVal.statData));
  const leftStatName = leftVal.statName;
  const leftUnit = leftVal.unit;
  palentDiv = d3.select(palentDiv);
  const rangeDiv = d3.select('#year-range-scatter-' + prefOrCity);
  d3.select('#scatter-msg').remove();
  if (!rightVal.statData.length) return;
  palentDiv.select('.chart-contents-div').remove();
  const rightDataset = JSON.parse(JSON.stringify(rightVal.statData));
  const rightStatName = rightVal.statName;
  const rightUnit = rightVal.unit;
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 980;
  const multi = width / defaultWidth < 1 ? width / defaultWidth : 1;
  const margin = { 'top': 50 * multi, 'bottom': 100 * multi, 'right': 30 * multi, 'left': 70 * multi };
  // データセットの元を作成----------------------------------------------------------------------
  const mixDataset = [];
  for (const i in leftDataset) {
    const leftTiime = leftDataset[i].data[0]['@time'];
    const rightData = rightDataset.find(value => value.data[0]['@time'] === leftTiime);
    if (rightData) {
      mixDataset.push({
        time: leftTiime,
        left: leftDataset[i],
        right: rightData
      })
    }
  }
  // --------------------------------------------------------------------------------------------
  const year = mixDataset[mixDataset.length - 1].time.substr(0, 4);
  rangeDiv.select('.year-range-text').text(year);
  // データ等を作るクラス-------------------------------------------------------------------------
  // 年に応じてデータセットと相関係数計算用と回帰直線計算用を作成する。
  class DataCreate {
    constructor (i) {
      this.mixDataset = mixDataset[i];
      this.dataset = [];
      this.soukan = null;
      this.linRegLine = null;
    }
    create () {
      const time = this.mixDataset.time;
      const tgtLeftData = this.mixDataset.left.data2;
      const tgtRightData = this.mixDataset.right.data2;
      const leftDataAr = [];
      const rightDataAr = [];
      const kaikiData = [];
      // ４７都道府県でループ
      for (const i in tgtLeftData) {
        if (tgtLeftData[i].citycode !== '00000') {
          const leftData = Number(tgtLeftData[i].data);
          const rightData = Number(tgtRightData[i].data);
          const obj = {
            time: time,
            cityname: tgtLeftData[i].cityname,
            leftData: leftData,
            rightData: rightData
          };
          // バインドするデータ dataset
          this.dataset.push(obj);
          // 相関係数計算用---------------------------------------------
          leftDataAr.push(leftData);
          rightDataAr.push(rightData);
          // 回帰直線計算用---------------------------------------------
          const arr = [rightData, leftData];
          kaikiData.push(arr)
        }
      }
      this.soukan = ss.sampleCorrelation(leftDataAr, rightDataAr).toFixed(2);
      const linReg = ss.linearRegression(kaikiData);
      this.linRegLine = ss.linearRegressionLine(linReg);
    }
  }
  const dc = new DataCreate(mixDataset.length - 1);
  dc.create();
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height)
  .classed("chart-svg", true);
  // クリップ領域-------------------------------------------------------------------------------
  svg.append('defs').append('clipPath')
  .attr('transform', 'translate(' + (margin.left) + ',' + (margin.top) + ')')
  .attr('id', 'scatter-estat-clip-' + prefOrCity)
  .append('rect')
  .attr('width', width - margin.right - margin.left)
  .attr('height', height - margin.top - margin.bottom);
  // 表名------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 14 * multi + 'px')
  .attr('transform', 'translate(' + (width / 2) + ',' + (14 * multi + 20 * multi) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text('縦=' + leftStatName + '　×　横=' + rightStatName)
  .attr('text-anchor', 'middle ')
  .attr('font-weight', 'normal');
  // 相関係数---------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + (10 * multi) + ',' + (12 * multi + height - 70 * multi) + ')')
  .append('text')
  .text('相関係数 = ' + dc.soukan)
  .attr('id', 'soukan-text')
  .attr('text-anchor', 'start');
  // 相関係数の注釈-------------------------------------------------------------------------
  let str = '', fill = 'black';
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + (10 * multi) + ',' + (12 * multi + height - 50 * multi) + ')')
  .append('text')
  .text(() => {
    if (dc.soukan >= 0.7) {
      str = '強い相関あり';
      fill = '#d50000'
    } else if (dc.soukan >= 0.4) {
      str = 'やや相関あり';
      fill = '#ff8000'
    } else if (dc.soukan >= 0.2) {
      str = '弱い相関あり';
      fill = '#00d500'
    } else if (dc.soukan >= -0.2) {
      str = 'ほとんど相関なし';
      fill = 'black'
    } else if (dc.soukan >= -0.4) {
      str = '弱い相関あり（負）';
      fill = '#00d500'
    } else if (dc.soukan >= -0.7) {
      str = 'やや相関あり（負）';
      fill = '#ff8000'
    } else if (dc.soukan >= -1) {
      str = '強い相関あり（負）';
      fill = '#d50000'
    }
    return str
  })
  .attr('text-anchor', 'start')
  .attr('font-size', 12 * multi + 'px')
  .attr('fill', () => fill);
  // 軸スケールの設定-------------------------------------------------------------------------
  const rightMax = d3.max(dc.dataset, d => d.rightData);
  const rightMin = d3.min(dc.dataset, d => d.rightData);
  const leftMax = d3.max(dc.dataset, d => d.leftData);
  let leftMin = d3.min(dc.dataset, d => d.leftData);
  if (leftMin > 0) leftMin = 0;
  const xScale = d3.scaleLinear()
  .domain([0, rightMax * 1.1])
  .range([margin.left, width - margin.right]);
  const yScale = d3.scaleLinear()
  .domain([leftMin * 1.1, leftMax * 1.1])
  .range([height - margin.bottom, margin.top]);
  // 0のラインx----------------------------------------------------------------------------------
  const zeroLineX = svg.append('line')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .attr('x1', margin.left * multi)
  .attr('y1', yScale(0))
  .attr('x2', width - margin.right * multi)
  .attr('y2', yScale(0))
  .attr('stroke-width', '1px')
  .attr('stroke', 'black');
  // 0のラインy----------------------------------------------------------------------------------
  const zeroLineY = svg.append('line')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .attr('x1', xScale(0))
  .attr('y1', margin.top * multi)
  .attr('x2', xScale(0))
  .attr('y2', height - margin.bottom * multi)
  .attr('stroke-width', '1px')
  .attr('stroke', 'black');
  // 回帰直線----------------------------------------------------------------------------------
  const kaikiLine = svg.append('g')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .append('line')
  .attr('id', 'kaiki-line')
  .attr('x1', xScale(rightMin))
  .attr('y1', yScale(dc.linRegLine(rightMin)))
  .attr('x2', xScale(rightMax))
  .attr('y2', yScale(dc.linRegLine(rightMax)))
  .attr('stroke-width', '1px')
  .attr('stroke', 'black')
  .attr('stroke-dasharray', '4,4');
  // 軸の表示-----------------------------------------------------------------------------------
  const axisx = d3.axisBottom(xScale)
  .ticks(20)
  .tickSize((margin.top + margin.bottom) - height);
  const axisy = d3.axisLeft(yScale)
  // .ticks(10)
  .tickSize((margin.left + margin.right) - width);
  const gX = svg.append('g')
  .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
  .attr('class', 'axis')
  .call(axisx);
  gX.selectAll('text')
  .attr('font-size', 10 * multi + 'px')
  .attr('transform', 'rotate(45)')
  .attr('text-anchor', 'start');
  const gY = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
  .attr('class', 'axis')
  .call(axisy);
  gY.selectAll('text')
  .attr('font-size', 10 * multi + 'px')
  .attr('text-anchor', 'end');
  svg.selectAll('.axis path')
  .attr('stroke', 'black')
  .attr('stroke-width', '1px');
  svg.selectAll('.axis line')
  .attr('stroke', 'lightgray')
  .attr('stroke-opacity', '0.5px')
  .attr('shape-rendering', 'crispEdges')
  .attr('stroke-dasharray', '2');
  // サークルの表示-----------------------------------------------------------------------------
  let tgtprefCode;
  if (d3.select('#scatter-pref-input').size()) {
    const tgtPrefName = d3.select('#scatter-pref-input').property("value");
    const prefOptions = storeBase.state.base.prefOptions;
    tgtprefCode = prefOptions.find(value => value.label === tgtPrefName).value
  } else {
    tgtprefCode = '45000'
  }
  const circle = svg.append('g')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .selectAll('circle')
  .data(dc.dataset)
  .enter()
  .append('circle')
  .attr('id', d => 'circle' + d.cityname)
  .attr('cx', d => xScale( d.rightData ))
  .attr('cy', d => yScale( d.leftData ))
  .attr('fill', d => d.cityname === tgtprefCode ? 'red' : 'orange')
  .attr('r', 6);
  // テキスト表示--------------------------------------------------------------------------------
  const textG = svg.append('g')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .selectAll('text')
  .data(dc.dataset)
  .enter()
  .append('text')
  .text(d => d.cityname)
  .attr('x', d => xScale(d.rightData) + 7)
  .attr('y', d => yScale(d.leftData) + 3)
  .attr('text-anchor', 'start')
  .attr('font-size', 10 * multi + 'px');
  // 縦軸単位----------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', () => 'translate(' + (20 * multi) + ',' + (12 * multi + 10) + ')')
  .append('text')
  .text('単位:' + leftUnit)
  .attr('text-anchor', 'start');
  // 横軸単位----------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + (width - 30) + ',' + (height - 40) + ')')
  .append('text')
  .text('単位:' + rightUnit)
  .attr('text-anchor', 'end')
  .attr('font-weight', 'normal');
  // 年-----------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 50 * multi + 'px')
  .attr('transform', () => 'translate(' + (margin.left + 10) + ',' + (50 * multi + margin.top + 10) + ')')
  .append('text')
  .text(mixDataset[mixDataset.length - 1].time.substr(0, 4))
  .attr('id', 'year-text-' + prefOrCity)
  .attr('text-anchor', 'start')
  .attr('font-weight', 'normal')
  .attr('fill', 'gray')
  .style('font-style', 'italic');
  //--------------------------------------------------------------------------------------------
  // ズーム時にもスケールを対応させるために
  let newXScale = xScale;
  let newYScale = yScale;
  // インプットレンジの関数-----------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    const year = mixDataset[value].time.substr(0, 4);
    d3.select('#year-text-' + prefOrCity).text(year);
    rangeDiv.select('.year-range-text').text(year);
    const dc = new DataCreate(value);
    dc.create();
    circle
    .data(dc.dataset, d => d.cityname)
    .transition()
    .attr('cx', d => newXScale(d.rightData))
    .attr('cy', d => newYScale(d.leftData));
    textG
    .data(dc.dataset, d => d.cityname)
    .transition()
    .attr('x', d => newXScale(d.rightData) + 7)
    .attr('y', d => newYScale(d.leftData) + 3);
    d3.select('#soukan-text').text('相関係数 = ' + dc.soukan);
    // 回帰直線--------------------------------------------------------------------------------
    const rightMin = d3.min(dc.dataset, d => d.rightData);
    const rightMax = d3.max(dc.dataset, d => d.rightData);
    kaikiLine
    .transition()
    .attr('x1', newXScale(rightMin))
    .attr('y1', newYScale(dc.linRegLine(rightMin)))
    .attr('x2', newXScale(rightMax))
    .attr('y2', newYScale(dc.linRegLine(rightMax)));
  };
  // インプットレンジ------------------------------------------------------------------------------
  rangeDiv.select('.year-range')
  .attr('max', String(mixDataset.length - 1));
  const length = mixDataset.length;
  const quarter = Math.floor((length - 1) / 4);
  rangeDiv.select('.year-range-ticks').selectAll('.tick').remove();
  rangeDiv.select('.year-range-ticks')
  .selectAll('span')
  .data(mixDataset)
  .enter()
  .append('span')
  .attr('class', 'tick')
  .text((d, i) => {
    if (length <= 10) {
      return d.time.substr(0, 4)
    } else if (i === 0 || i === length - 1) {
      return d.time.substr(2, 2)
    } else if (i % quarter === 0) {
      return d.time.substr(2, 2)
    }
  });
  // インプットテキスト----------------------------------------------------------------------------
  const textInput = cityName => {
    circle.attr('fill', d => d.cityname === cityName ? 'red' : 'orange')
  };
  if (!d3.select('#scatter-pref-input-' + prefOrCity).size()) {
    palentDiv.append('div')
    .attr('id', 'pref-select-div')
    .style('position', 'absolute')
    .style('footer-info.vue', '10px')
    .style('left', () => '50%')
    .style('bottom', '10px')
    .style('margin-left', '-230px')
    .append('input')
    .attr('type', 'text')
    .attr('id', 'scatter-pref-input-' + prefOrCity)
    .attr('value', () => {
      if (prefOrCity === 'pref') {
        return '宮崎県'
      } 
        return '宮崎市'
      
    })
    .style('width', '70px')
  }
  d3.select('#scatter-pref-input-' + prefOrCity)
  .on('input', function () {
    textInput(this.value)
  })
  .on('change', function () {
    textInput(this.value)
  });
  const value = d3.select('#scatter-pref-input-' + prefOrCity).property('value');
  textInput(value);
  // ツールチップ---------------------------------------------------------------------------------
  const tip = d3Tip().attr('class', 'd3-tip').html(d => d);
  svg.call(tip);
  circle
  .on('mouseover', function (d) {
    return tip.show(d.cityname + '<br>' + d.leftData.toLocaleString() + leftUnit + '<br>' + d.rightData.toLocaleString() + rightUnit, this)
  })
  .on('mouseout', tip.hide);
  // ズーム--------------------------------------------------------------------------------------
  const zoomed = () => {
    newXScale = d3.event.transform.rescaleX(xScale);
    newYScale = d3.event.transform.rescaleY(yScale);
    // サークル----------------------------------------------------------------------------------
    circle
    .attr('cx', d => newXScale(d.rightData))
    .attr('cy', d => newYScale(d.leftData));
    textG
    .attr('x', d => newXScale(d.rightData) + 7)
    .attr('y', d => newYScale(d.leftData) + 3);
    gX.call(axisx.scale(d3.event.transform.rescaleX(xScale)))
    .selectAll('text')
    .attr('font-size', 10 * multi + 'px')
    .attr('transform', 'rotate(45)')
    .attr('text-anchor', 'start');
    gY.call(axisy.scale(d3.event.transform.rescaleY(yScale)))
    .selectAll('text')
    .attr('font-size', 10 * multi + 'px')
    .attr('text-anchor', 'end');
    // 0のラインx--------------------------------------------------------------------------------
    zeroLineX
    .attr('x1', margin.left * multi)
    .attr('y1', newYScale(0))
    .attr('x2', width - margin.right * multi)
    .attr('y2', newYScale(0));
    // 0のラインy--------------------------------------------------------------------------------
    zeroLineY
    .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
    .attr('x1', newXScale(0))
    .attr('y1', margin.top * multi)
    .attr('x2', newXScale(0))
    .attr('y2', height - margin.bottom * multi);
    // 回帰直線--------------------------------------------------------------------------------
    const rightMin = d3.min(dc.dataset, d => d.rightData);
    const rightMax = d3.max(dc.dataset, d => d.rightData);
    kaikiLine
    .attr('x1', newXScale(rightMin))
    .attr('y1', newYScale(dc.linRegLine(rightMin)))
    .attr('x2', newXScale(rightMax))
    .attr('y2', newYScale(dc.linRegLine(rightMax)));
    //-------------------------------------------------------------------------------------------
    svg.selectAll('.axis line')
    .attr('stroke', 'lightgray')
    .attr('stroke-opacity', '0.5px')
    .attr('shape-rendering', 'crispEdges')
    .attr('stroke-dasharray', '2');
  };
  const zoom = d3.zoom().on('zoom', zoomed);
  svg.call(zoom);
  //--------------------------------------------------------------------------------------------
  const type = ie ? 'change' : 'input';
  Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
  eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-scatter-' + prefOrCity + ' .year-range'), type, (() => {
    return e => rangeInput(e)
  })(1), false);
  if (prefOrCity === 'pref') {
    storeBase.commit('statList/yearRangeScatterPrefChange', mixDataset.length - 1)
  } else {
    storeBase.commit('statList/yearRangeScatterCityChange', mixDataset.length - 1)
  }
}
