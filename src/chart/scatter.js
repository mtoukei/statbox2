import storeBase from '../store/store-base'
import * as ss from 'simple-statistics'
export default function (leftVal, rightVal) {
  if (!leftVal.stat) return;
  const leftDataset = JSON.parse(JSON.stringify(leftVal.statData.data));
  const leftStatName = leftVal.statData.title;
  const leftUnit = leftVal.statData.unit;
  const palentDiv = d3.select('#left-scatter');
  palentDiv.select('.chart-contents-div').remove();
  if (!rightVal.stat) return;
  const rightDataset = JSON.parse(JSON.stringify(rightVal.statData.data));
  const rightStatName = rightVal.statData.title;
  const rightUnit = rightVal.statData.unit;
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - d3.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 980;
  const multi = width / defaultWidth < 1.5? width / defaultWidth: 1.5;
  const margin = { 'top': 30 * multi, 'bottom': 100 * multi, 'right': 30 * multi, 'left': 60 * multi };
  //トランジションフラグ---------------------------------------------------------------------------
  const transitionFlg = storeBase.state.statList.leftStat.transition;
  //データセット作成-----------------------------------------------------------------------------
  const dataset = [];
  const leftDataAr = [], rightDataAr = [];
  const kaikiData = [];
  for (let i in leftDataset) {
    const obj = {
      cityname: leftDataset[i].cityname,
      leftData: leftDataset[i].data,
      rightData: rightDataset[i].data
    };
    dataset.push(obj);
    // 相関係数計算用-------------------------------------------------------------------------
    leftDataAr.push(leftDataset[i].data);
    rightDataAr.push(rightDataset[i].data);
    // 回帰直線計算用-------------------------------------------------------------------------
    const arr = [rightDataset[i].data,leftDataset[i].data];
    kaikiData.push(arr)
  }
  const soukan = ss.sampleCorrelation(leftDataAr, rightDataAr).toFixed(2);
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('svg').remove();
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height);
  // クリップ領域---------------------------------------------------------------------------------
  svg.append('defs').append('clipPath')
  .attr('transform', 'translate(' + (margin.left) + ',' + (margin.top) + ')')
  .attr('id', 'scatter-clip')
  .append('rect')
  .attr('width', width - margin.right - margin.left)
  .attr('height', height - margin.top - margin.bottom);
  // 表名---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 14 * multi + 'px')
  .attr('transform', 'translate(' + (width/2) + ',' + (14 * multi + 10 * multi) + ')')
  .attr('class' ,'no-print')
  .append('text')
  .text('縦=' + leftStatName + '　×　横=' + rightStatName)
  .attr('text-anchor', 'middle ')
  .attr('font-weight', 'normal');
  // 相関係数----------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + 10 + ',' + (12 * multi + height - 50 * multi) + ')')
  .append('text')
  .text('相関係数 = ' + soukan)
  .attr('id', 'soukan-text')
  .attr('text-anchor', 'start');
  // 相関係数の注釈---------------------------------------------------------------------------
  let str = '', fill = 'black';
  svg.append('g')
  .attr('transform', 'translate(' + (110 * multi) + ',' + (12 * multi + height - 50 * multi) + ')')
  .append('text')
  .text(function () {
    if (soukan >= 0.7) {
      str = '強い相関あり';
      fill = '#d50000'
    } else if (soukan >= 0.4) {
      str = 'やや相関あり';
      fill = '#ff8000'
    } else if (soukan >= 0.2) {
      str = '弱い相関あり';
      fill = '#00d500'
    } else if (soukan >= -0.2) {
      str = 'ほとんど相関なし';
      fill = 'black'
    } else if (soukan >= -0.4) {
      str = '弱い相関あり（負）';
      fill = '#00d500'
    } else if (soukan >= -0.7) {
      str = 'やや相関あり（負）';
      fill = '#ff8000'
    } else if (soukan >= -1) {
      str = '強い相関あり（負）';
      fill = '#d50000'
    }
    return str
  })
  .attr('text-anchor', 'start')
  .attr('font-size', 12 * multi + 'px')
  .attr('fill', () => fill);
  // 軸スケールの設定---------------------------------------------------------------------------
  const rightMax =d3.max(dataset, d => d.rightData);
  let rightMin =d3.min(dataset, d => d.rightData);
  const leftMax =d3.max(dataset, d => d.leftData);
  let leftMin =d3.min(dataset, d => d.leftData);
  if (leftMin > 0) leftMin = 0;
    rightMin = rightMin * 0.9;
    leftMin = leftMin * 0.9;
  const xScale = d3.scaleLinear()
  .domain([0, rightMax*1.1])
  .range([margin.left, width - margin.right]);
  const yScale = d3.scaleLinear()
  .domain([leftMin*1.1, leftMax*1.1])
  .range([height - margin.bottom, margin.top]);
  // 0のラインx----------------------------------------------------------------------------------
  const zeroLineX =svg.append('line')
  .attr('clip-path', 'url(#scatter-clip)')
  .attr('x1',margin.left)
  .attr('y1',yScale(0))
  .attr('x2',width -margin.right)
  .attr('y2',yScale(0))
  .attr('stroke-width', '1px')
  .attr('stroke', 'black');
  // 0のラインy----------------------------------------------------------------------------------
  const zeroLineY =svg.append('line')
  .attr('clip-path', 'url(#scatter-clip)')
  .attr('x1',xScale(0))
  .attr('y1',margin.top)
  .attr('x2',xScale(0))
  .attr('y2',height - margin.bottom)
  .attr('stroke-width', '1px')
  .attr('stroke', 'black');
  // 回帰直線----------------------------------------------------------------------------------
  const linReg = ss.linearRegression(kaikiData);
  const linRegLine = ss.linearRegressionLine(linReg);
  const kaikiLine = svg.append('g')
  .attr('clip-path', 'url(#scatter-clip)')
  .append('line')
  .attr('x1',xScale(rightMin))
  .attr('y1',yScale(linRegLine(rightMin)))
  .attr('x2',xScale(rightMin))
  .attr('y2',yScale(linRegLine(rightMin)))
  .attr('stroke-width', '1px')
  .attr('stroke', 'black')
  .attr('stroke-dasharray', '4,4');
  if (transitionFlg) {
    kaikiLine
    .transition()
    .duration(1000)
    .ease(d3.easeCircleOut)
    .attr('x2',xScale(rightMax))
    .attr('y2',yScale(linRegLine(rightMax)));
  } else {
    kaikiLine
    .attr('x2',xScale(rightMax))
    .attr('y2',yScale(linRegLine(rightMax)));
  }
  // 軸の表示----------------------------------------------------------------------------------
  const axisx = d3.axisBottom(xScale)
  .ticks(20)
  .tickSize((margin.top + margin.bottom)   - height);
  const axisy = d3.axisLeft(yScale)
  // .ticks(10)
  .tickSize((margin.left + margin.right)  - width);
  const gX =  svg.append('g')
  .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
  .attr('class', 'axis')
  .call(axisx);
  gX.selectAll('text')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'rotate(45)')
  .attr('text-anchor', 'start');
  const gY = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
  .attr('class', 'axis')
  .call(axisy);
  gY.selectAll('text')
  .attr('font-size', 12 * multi + 'px')
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
  const circle = svg.append('g')
  .attr('clip-path', 'url(#scatter-clip)')
  .selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(d.rightData))
  .attr('cy', d => yScale(d.leftData))
  .attr('fill', 'orange')
  .attr('r', 16);
  if (transitionFlg) {
    circle.transition()
    .delay((d, i) => i * 30)
    .attr('r', 6);
  } else {
    circle.attr('r', 6);
  }
  // ツールチップ---------------------------------------------------------------------------------
  const tip = d3Tip().attr('class', 'd3-tip').html(d => d);
  svg.call(tip);
  circle
  .on('mouseover', function (d) {
    return tip.show(d.cityname + '<br>' + d.leftData.toLocaleString() + leftUnit + '<br>' + d.rightData.toLocaleString() + rightUnit,this)
  })
  .on('mouseout', tip.hide);
  // テキスト表示--------------------------------------------------------------------------------
  const text = svg.append('g')
  .attr('clip-path', 'url(#scatter-clip)')
  .selectAll('text')
  .data(dataset)
  .enter()
  .append('text')
  .text(d => d.cityname)
  .attr('x', d => xScale(d.rightData) + 7)
  .attr('y', d => yScale(d.leftData) + 3)
  .attr('text-anchor', 'start')
  .attr('font-size', 10 * multi + 'px');
  if (transitionFlg) {
    text.attr('opacity', 0)
    .transition()
    .delay((d,i) => i * 30)
    .attr('opacity', '1');
  } else {
    text.attr('opacity', '1');
  }
  // 縦軸単位----------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + 20 * multi +',' + (12 * multi + 5 * multi) + ')')
  .append('text')
  .text('単位:' + leftUnit)
  .attr('text-anchor', 'start');
  // 横軸単位----------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + (width - margin.right) + ',' + (12 * multi + height - 50 * multi) + ')')
  .append('text')
  .text('単位:' + rightUnit)
  .attr('text-anchor', 'end')
  .attr('font-weight', 'normal');
  // ズーム--------------------------------------------------------------------------------------
  const zoomed = () => {
    const newXScale = d3.event.transform.rescaleX(xScale);
    const newYScale = d3.event.transform.rescaleY(yScale);
    // サークル-----------------------------------------------------------------------------------
    circle
    .attr('cx', d => newXScale(d.rightData))
    .attr('cy', d => newYScale(d.leftData));
    // テキスト-----------------------------------------------------------------------------------
    text
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
    .attr('x1',margin.left)
    .attr('y1',newYScale(0))
    .attr('x2',width -margin.right)
    .attr('y2',newYScale(0));
    // 0のラインy--------------------------------------------------------------------------------
    zeroLineY
    .attr('x1',newXScale(0))
    .attr('y1',margin.top)
    .attr('x2',newXScale(0))
    .attr('y2',height - margin.bottom);
    // 回帰直線--------------------------------------------------------------------------------
    kaikiLine
    .attr('x1',newXScale(rightMin))
    .attr('y1',newYScale(linRegLine(rightMin)))
    .attr('x2',newXScale(rightMax))
    .attr('y2',newYScale(linRegLine(rightMax)));
    //-------------------------------------------------------------------------------------------
    svg.selectAll('.axis line')
    .attr('stroke', 'lightgray')
    .attr('stroke-opacity', '0.5px')
    .attr('shape-rendering', 'crispEdges')
    .attr('stroke-dasharray', '2');
  };
  const zoom = d3.zoom().on('zoom', zoomed);
  svg.call(zoom);
}
