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
  let width = palentDiv.node().getBoundingClientRect().width;
  let height = palentDiv.node().getBoundingClientRect().height - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 980;
  let multi = width / defaultWidth < 1 ? width / defaultWidth : 1;
  const margin = { 'top': 50 * multi, 'bottom': 100 * multi, 'right': 30 * multi, 'left': 70 * multi };
  // データセットの元を作成----------------------------------------------------------------------
  const mixDataset = [];
  leftDataset.forEach(value => {
    const leftTiime = value.data[0]['@time'];
    const rightData = rightDataset.find(val => val.data[0]['@time'] === leftTiime);
    if (rightData) {
      mixDataset.push({
        time: leftTiime,
        left: value,
        right: rightData
      })
    }
  });
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
      this.rightMax = null;
      this.rightMin = null;
      this.xScale = null;
      this.yScale = null;
    }
    create () {
      const time = this.mixDataset.time;
      const tgtLeftData = this.mixDataset.left.data2;
      const tgtRightData = this.mixDataset.right.data2;
      const leftDataAr = [];
      const rightDataAr = [];
      const kaikiData = [];
      // ４７都道府県でループ
      tgtLeftData.forEach((value, index) => {
        if (value.citycode !== '00000') {
          const leftData = Number(value.data);
          const rightData = Number(tgtRightData[index].data);
          const obj = {
            time: time,
            cityname: value.cityname,
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
      });
      this.soukan = ss.sampleCorrelation(leftDataAr, rightDataAr).toFixed(2);
      const linReg = ss.linearRegression(kaikiData);
      this.linRegLine = ss.linearRegressionLine(linReg);
      this.rightMax = d3.max(this.dataset, d => d.rightData);
      this.rightMin = d3.min(this.dataset, d => d.rightData);
      const leftMax = d3.max(this.dataset, d => d.leftData);
      let leftMin = d3.min(this.dataset, d => d.leftData);
      if (leftMin > 0) leftMin = 0;
      this.xScale = d3.scaleLinear()
      .domain([0, this.rightMax * 1.1])
      .range([margin.left, width - margin.right]);
      this.yScale = d3.scaleLinear()
      .domain([leftMin * 1.1, leftMax * 1.1])
      .range([height - margin.bottom, margin.top]);
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
  const clip = svg.append('defs').append('clipPath')
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
  const soukanTextG = svg.append('g')
  .attr('transform', 'translate(' + (10 * multi) + ',' + (12 * multi + height - 70 * multi) + ')');
  const soukanTextD = soukanTextG.selectAll('text')
  .data([dc.soukan])
  .enter();
  const soukanText = soukanTextD.append('text')
  .text(d =>'相関係数 = ' + d)
  .attr('font-size', 12 * multi + 'px')
  .attr('text-anchor', 'start');
  // 相関係数の注釈-------------------------------------------------------------------------
  const cyuuSyaku = d => {
    {
      if (d >= 0.7) {
        str = '強い相関あり';
        fill = '#d50000'
      } else if (d >= 0.4) {
        str = 'やや相関あり';
        fill = '#ff8000'
      } else if (d >= 0.2) {
        str = '弱い相関あり';
        fill = '#00d500'
      } else if (d >= -0.2) {
        str = 'ほとんど相関なし';
        fill = 'black'
      } else if (d >= -0.4) {
        str = '弱い相関あり（負）';
        fill = '#00d500'
      } else if (d >= -0.7) {
        str = 'やや相関あり（負）';
        fill = '#ff8000'
      } else if (d >= -1) {
        str = '強い相関あり（負）';
        fill = '#d50000'
      }
      return str
    }
  };
  let str = '', fill = 'black';
  const soukanTextCyuuG = svg.append('g')
  .attr('transform', 'translate(' + (10 * multi) + ',' + (12 * multi + height - 50 * multi) + ')');
  const soukanTextCyuuD = soukanTextCyuuG.selectAll('text')
  .data([dc.soukan])
  .enter();
  const soukanTextCyuu = soukanTextCyuuD.append('text')
  .text(d => cyuuSyaku(d))
  .attr('text-anchor', 'start')
  .attr('font-size', 12 * multi + 'px')
  .attr('fill', () => fill);
  // 0のラインx----------------------------------------------------------------------------------
  const zeroLineX = svg.append('line')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .attr('x1', margin.left * multi)
  .attr('y1', dc.yScale(0))
  .attr('x2', width - margin.right * multi)
  .attr('y2', dc.yScale(0))
  .attr('stroke-width', '1px')
  .attr('stroke', 'black');
  // 0のラインy----------------------------------------------------------------------------------
  const zeroLineY = svg.append('line')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .attr('x1', dc.xScale(0))
  .attr('y1', margin.top * multi)
  .attr('x2', dc.xScale(0))
  .attr('y2', height - margin.bottom * multi)
  .attr('stroke-width', '1px')
  .attr('stroke', 'black');
  // 回帰直線----------------------------------------------------------------------------------
  const kaikiLine = svg.append('g')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .append('line')
  .attr('id', 'kaiki-line')
  .attr('x1', dc.xScale(dc.rightMin))
  .attr('y1', dc.yScale(dc.linRegLine(dc.rightMin)))
  .attr('x2', dc.xScale(dc.rightMax))
  .attr('y2', dc.yScale(dc.linRegLine(dc.rightMax)))
  .attr('stroke-width', '1px')
  .attr('stroke', 'black')
  .attr('stroke-dasharray', '4,4');
  // 軸の表示-----------------------------------------------------------------------------------
  const axisx = d3.axisBottom(dc.xScale)
  .ticks(20)
  .tickSize((margin.top + margin.bottom) - height);
  const axisy = d3.axisLeft(dc.yScale)
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
  // 丸の表示----------------------------------------------------------------------------------
  let tgtprefCode;
  if (d3.select('#scatter-pref-input').size()) {
    const tgtPrefName = d3.select('#scatter-pref-input').property("value");
    const prefOptions = storeBase.state.base.prefOptions;
    tgtprefCode = prefOptions.find(value => value.label === tgtPrefName).value
  } else {
    tgtprefCode = '45000'
  }
  const circleG = svg.append('g')
  .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
  .selectAll('circle')
  .data(dc.dataset)
  .enter()
  .append('circle')
  .attr('id', d => 'circle' + d.cityname)
  .attr('cx', d => dc.xScale( d.rightData ))
  .attr('cy', d => dc.yScale( d.leftData ))
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
  .attr('x', d => dc.xScale(d.rightData) + 7)
  .attr('y', d => dc.yScale(d.leftData) + 3)
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
  //--------------------------------------------------------------------------------------------
  // ズーム時にもスケールを対応させるために
  let newXScale = dc.xScale;
  let newYScale = dc.yScale;
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
    circleG.attr('fill', d => d.cityname === cityName ? 'red' : 'orange')
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
    .attr('value', () => prefOrCity === 'pref' ? '宮崎県' : '宮崎市')
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
  circleG
  .on('mouseover', function (d) {
    return tip.show(`${d.cityname}<br>${d.leftData.toLocaleString()}${leftUnit}<br>${d.rightData.toLocaleString()}${rightUnit}`, this)
  })
  .on('mouseout', tip.hide);
  // ズーム--------------------------------------------------------------------------------------
  const zoomed = () => {
    multi = width / defaultWidth < 1 ? width / defaultWidth : 1;
    const value = Number(d3.select('#year-range-' + prefOrCity).select('.year-range').property("value"));
    const dc = new DataCreate(value);
    dc.create();
    newXScale = d3.event.transform.rescaleX(dc.xScale);
    newYScale = d3.event.transform.rescaleY(dc.yScale);
    // クリップ領域-------------------------------------------------------------------------------
    clip
    .attr('width', width - margin.right - margin.left)
    .attr('height', height - margin.top - margin.bottom);
    // サークル----------------------------------------------------------------------------------
    circleG
    .attr('cx', d => newXScale(d.rightData))
    .attr('cy', d => newYScale(d.leftData));
    textG
    .attr('x', d => newXScale(d.rightData) + 7)
    .attr('y', d => newYScale(d.leftData) + 3);
    // x軸--------------------------------------------------------------------------------------
    const axisx = d3.axisBottom(newXScale)
    .ticks(20)
    .tickSize((margin.top + margin.bottom) - height);
    gX.call(axisx)
    .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
    .selectAll('text')
    .attr('font-size', 10 * multi + 'px')
    .attr('transform', 'rotate(45)')
    .attr('text-anchor', 'start');
    // y軸--------------------------------------------------------------------------------------
    const axisy = d3.axisLeft(newYScale)
    .tickSize((margin.left + margin.right) - width);
    gY.call(axisy)
    .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
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
    kaikiLine
    .attr('x1', newXScale(dc.rightMin))
    .attr('y1', newYScale(dc.linRegLine(dc.rightMin)))
    .attr('x2', newXScale(dc.rightMax))
    .attr('y2', newYScale(dc.linRegLine(dc.rightMax)));
    //-------------------------------------------------------------------------------------------
    svg.selectAll('.axis line')
    .attr('stroke', 'lightgray')
    .attr('stroke-opacity', '0.5px')
    .attr('shape-rendering', 'crispEdges')
    .attr('stroke-dasharray', '2');
  };
  const zoom = d3.zoom().on('zoom', zoomed);
  svg.call(zoom);
  // --------------------------------------------------------------------------------------------
  const redraw = () => {
    multi = width / defaultWidth < 1 ? width / defaultWidth : 1;
    svg.attr('width', width);
    svg.attr('height', height);
    const value = Number(d3.select('#year-range-' + prefOrCity).select('.year-range').property("value"));
    const year = mixDataset[value].time.substr(0, 4);
    rangeDiv.select('.year-range-text').text(year);
    const dc = new DataCreate(value);
    dc.create();
    // クリップ領域-------------------------------------------------------------------------------
    clip
    .attr('width', width - margin.right - margin.left)
    .attr('height', height - margin.top - margin.bottom);
    // x軸--------------------------------------------------------------------------------------
    const axisx = d3.axisBottom(dc.xScale)
    .ticks(20)
    .tickSize((margin.top + margin.bottom) - height);
    gX
    .call(axisx)
    .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
    .selectAll('text')
    .attr('font-size', 10 * multi + 'px')
    .attr('transform', 'rotate(45)')
    .attr('text-anchor', 'start');
    // y軸--------------------------------------------------------------------------------------
    const axisy = d3.axisLeft(dc.yScale)
    .tickSize((margin.left + margin.right) - width);
    gY
    .call(axisy)
    .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
    .selectAll('text')
    .attr('font-size', 10 * multi + 'px')
    .attr('text-anchor', 'end');
    // 丸---------------------------------------------------------------------------------------
    circleG
    .data(dc.dataset, d => d.cityname)
    .transition()
    .attr('cx', d => dc.xScale(d.rightData))
    .attr('cy', d => dc.yScale(d.leftData));
    // テキスト-----------------------------------------------------------------------------------
    textG
    .data(dc.dataset, d => d.cityname)
    .transition()
    .attr('x', d => dc.xScale(d.rightData) + 7)
    .attr('y', d => dc.yScale(d.leftData) + 3);
    // 相関係数--------------------------------------------------------------------------------
    soukanTextG
    .attr('transform', 'translate(' + (10 * multi) + ',' + (12 * multi + height - 70 * multi) + ')');
    soukanText
    .data([dc.soukan])
    .text(d => '相関係数 = ' + d);
    soukanTextCyuuG
    .attr('transform', 'translate(' + (10 * multi) + ',' + (12 * multi + height - 50 * multi) + ')');
    soukanTextCyuu
    .data([dc.soukan])
    .attr('font-size', 12 * multi + 'px')
    .text(d => cyuuSyaku(d));
    // 0のラインx--------------------------------------------------------------------------------
    zeroLineX
    .attr('x1', margin.left * multi)
    .attr('y1', dc.yScale(0))
    .attr('x2', width - margin.right * multi)
    .attr('y2', dc.yScale(0));
    // 0のラインy--------------------------------------------------------------------------------
    zeroLineY
    .attr('clip-path', 'url(#scatter-estat-clip-' + prefOrCity + ')')
    .attr('x1', dc.xScale(0))
    .attr('y1', margin.top * multi)
    .attr('x2', dc.xScale(0))
    .attr('y2', height - margin.bottom * multi);
    // 回帰直線--------------------------------------------------------------------------------
    const rightMin = d3.min(dc.dataset, d => d.rightData);
    const rightMax = d3.max(dc.dataset, d => d.rightData);
    kaikiLine
    .transition()
    .attr('x1', dc.xScale(rightMin))
    .attr('y1', dc.yScale(dc.linRegLine(rightMin)))
    .attr('x2', dc.xScale(rightMax))
    .attr('y2', dc.yScale(dc.linRegLine(rightMax)));
    // 罫線-------------------------------------------------------------------------------------
    svg.selectAll('.axis line')
    .attr('stroke', 'lightgray')
    .attr('stroke-opacity', '0.5px')
    .attr('shape-rendering', 'crispEdges')
    .attr('stroke-dasharray', '2');
  };
  // リサイズ検知--------------------------------------------------------------------------------
  const isFirst = {miyazaki: true, pref: true, city: true};
  const resizeObserver = new ResizeObserver(entries => {
    if (!isFirst[prefOrCity]) { // 最初(統計を選択した時) は動作させない。
      if (!storeBase.state.base.menuChange) { // メニュー移動時も動作させない。
        for (const entry of entries) {
          width = entry.contentRect.width;
          height = entry.contentRect.height - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
          redraw()
        }
      }
    }
    isFirst[prefOrCity] = false
  });
  const target = palentDiv.node();
  resizeObserver.observe(target);
  //--------------------------------------------------------------------------------------------
  const type = ie ? 'change' : 'input';
  Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
  eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-scatter-' + prefOrCity + ' .year-range'), type, (() => {
    return () => redraw()
  })(1), false);
  if (prefOrCity === 'pref') {
    storeBase.commit('statList/yearRangeScatterPrefChange', mixDataset.length - 1)
  } else {
    storeBase.commit('statList/yearRangeScatterCityChange', mixDataset.length - 1)
  }
}
