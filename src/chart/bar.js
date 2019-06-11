import storeBase from '../store/store-base'
import * as ss from 'simple-statistics'
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (barVal, pathVal, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length -1 ];
  const palentDiv = d3.select(parentDiv);
  if(palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  let unit;
  if (barVal.estat) {
    const target = barVal.statData[barVal.statData.length - 1];
    const allPrefData = target.data;
    dataset = target.data2;
    statName = barVal.statName;
    unit = allPrefData[0]['@unit'];
  } else {
    dataset = barVal.statData.data;
    statName = barVal.statData.title;
    unit = barVal.statData.unit;
  }
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 600;
  const multi = width / defaultWidth < 1.5? width / defaultWidth: 1.5;
  const margin = { 'top': 40 * multi, 'bottom': 60 * multi, 'right': 50 * multi, 'left': 50 * multi };
  //トランジションフラグ----------------------------------------------------------------------------
  const transitionFlg  = storeBase.state.statList.transition;
  // const transitionFlg = false
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset;
      this.maxVal = null;
      this.minVal = null;
      this.median = null
    }
    create () {
      if (prefOrCity === 'pref') this.dataset.shift();
      // ソートして順位をつける-------------------------------------------------------------------
      this.dataset.sort((a,b) => {
        if (a.data > b.data) return -1;
        if (a.data < b.data) return 1;
        return 0;
      });
      this.dataset.forEach((v,i) => v['leftTop'] = i + 1);
      this.dataset.sort((a,b) => {
        if (a.citycode < b.citycode) return -1;
        if (a.citycode > b.citycode) return 1;
        return 0;
      });
      if (barVal.estat) {
        this.maxVal = 0;
        this.minVal = 9999999999999999999;
        for (const value of barVal.statData) {
          for (const value of value.data2) {
            if (!isNaN(value.data)) {
              if (value.citycode !== '00000') {
                this.maxVal = this.maxVal < value.data ? value.data : this.maxVal;
                this.minVal = this.minVal > value.data ? value.data : this.minVal
              }
            }
          }
        }
      } else {
        this.maxVal = d3.max(this.dataset, d => d.data);
        this.minVal = d3.min(this.dataset, d => d.data);
      }
      if (this.minVal >= 0) {
        this.minVal = 0
      } else {
        this.minVal = this.minVal * 1.1
      }
      //-----------------------------------------------------------------------------------------
      const dataArr = [];
      for (let i in this.dataset) {
        dataArr.push(this.dataset[i].data)
      }
      this.median = ss.median(dataArr)
    }
  }
  //---------------------------------------------------------------------------------------------
  let dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg =
    palentDiv.select('.resizers').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 '+ width + ' '  + height)
    .attr('preserveAspectRatio', 'xMidYMid')
    .classed("svg-content-responsive", true)
    .classed("chart-svg", true);
    //-------------------------------------------------------------------------------------------
  let xScale = null;
  let xAxis = null;
  // 軸スケールの設定------------------------------------------------------------------------
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
  // バー横軸--------------------------------------------------------------------------------
  xScale = d3.scaleBand()
  .range([margin.left, width - margin.right])
  .padding(0.2)
  .domain(dc.dataset.map(d => d.cityname));
  // バー縦軸--------------------------------------------------------------------------------
  const yScale = d3.scaleLinear()
  .domain([dc.minVal, dc.maxVal])
  .range([height - margin.bottom, margin.top]);
  // 軸の表示--------------------------------------------------------------------------------
  // x軸
  const axisx = d3.axisBottom(xScale)
  .ticks(20);
  xAxis = svg.append('g')
  .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
  .call(axisx)
  .selectAll('text')
  .attr('x', 0)
  .attr('y', 3)
  .attr('writing-mode', 'vertical-rl')
  .style('-ms-writing-mode', 'tb-rl')
  .attr('letter-spacing', () => {
    if (!ie) return '-0.3em'
  })
  .attr('font-size', 10 * multi + 'px')
  .attr('fill','black')
  .attr('text-anchor','start');
  // y軸バー-------------------------------------------------------------------------------
  svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
  .call(d3.axisLeft(yScale))
  .selectAll('text')
  .attr('font-size', fontSize);
  // バーの表示------------------------------------------------------------------------------
  const g =svg.append('g')
  .selectAll('rect')
  .data(dc.dataset)
  .enter();
  const rect = g.append('rect')
  .attr('x', d => xScale(d.cityname))
  .attr('width', xScale.bandwidth())
  .attr('y', yScale(0))
  .attr('height', 0); //棒の長さ0
  if (transitionFlg) {
    rect.transition()
    .duration(1000)
    .attr('y', function (d){
      if (d.data>=0) {
        d3.select(this).attr('fill', 'slategray');
        return yScale(d.data)
      } else {
        d3.select(this).attr('fill', 'coral');
        return yScale(0)
      }
    })
    .attr('height', d => Math.abs(yScale(d.data) - yScale(0)));
  } else {
    rect.attr('y', function (d){
      if (d.data>=0) {
        d3.select(this).attr('fill', 'slategray');
        return yScale(d.data)
      } else {
        d3.select(this).attr('fill', 'coral');
        return yScale(0)
      }
    })
    .attr('height', d => Math.abs(yScale(d.data) - yScale(0)));
  }
  // ツールチップ-----------------------------------------------------------------------
  const tip = d3Tip().attr('class', 'd3-tip').html(d => d);
  svg.call(tip);
  rect
  .on('mouseover', function (d) {
    return tip.show(d.leftTop + '位　' + d.cityname + '<br>' + d.data.toLocaleString() + unit, this)
  })
  .on('mouseout', tip.hide);
  // 中央値------------------------------------------------------------------------------------
  const medianPolyline = svg.append('polyline')
  .attr('points', margin.left + ',' + yScale(dc.median) + ' ' + (width - margin.right) + ',' + yScale(dc.median))
  .attr('stroke', 'red')
  .attr('fill', 'none')
  .attr('stroke-width', 1);
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + (width - margin.right * multi) + ',15)')
  .attr('class' ,'no-print')
  .append('text')
  .text('赤線＝中央値')
  .attr('text-anchor', 'end');




  // バーの中に数値-------------------------------------------------------------------------
  // const g2 = svg.append('g')
  // .selectAll('text')
  // .data(dc.dataset)
  // .enter();
  // const text = g2
  // .append('text')
  // .attr('class', 'bar-text')
  // .text(d => {
  //   let data = Math.floor(d.data);
  //   if (data>=1000000) {
  //     data = (data / 1000).toLocaleString() + '千'
  //   } else {
  //     data = data.toLocaleString()
  //   }
  //   return data
  // })
  // .attr('text-anchor', 'start')
  // .attr('x', d => xScale(d.cityname) + 2)
  // .attr('y', d => yScale(d.data)- 5)
  // .attr('font-size', 8 * multi + 'px')
  // .attr('fill', 'rgba(0,0,0,0)');
  // if (transitionFlg) {
  //   text.transition()
  //   .duration(3000)
  //   .attr('fill', 'black');
  // } else {
  //   text.attr('fill', 'black');
  // }
  // 単位------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 10 * multi + 'px')
  .attr('transform', 'translate(10,15)')
  .append('text')
  .text('単位:' + unit);
  // 表名------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + 60 * multi + ',15)')
  .attr('class' ,'no-print')
  .append('text')
  .text('棒 = ' + statName)
  .attr('text-anchor', 'start');
  //--------------------------------------------------------------------------------------------
  dc = null;
  // -------------------------------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    let dc = new DataCreate(JSON.parse(JSON.stringify(barVal.statData[value].data2)));
    dc.create();
    rect
    .data(dc.dataset, d => d.citycode )
    .transition()
    .duration(200)
    .attr('height', d => Math.abs(yScale(d.data) - yScale(0)))
    .attr('y', function (d){
      if (d.data>=0) {
        d3.select(this).attr('fill', 'slategray');
        return yScale(d.data)
      } else {
        d3.select(this).attr('fill', 'coral');
        return yScale(0)
      }
    });
    // 中央値-----------------------------------------------------------------------------------
    medianPolyline
    .transition()
    .duration(200)
    .attr('points', margin.left + ',' + yScale(dc.median) + ' ' + (width - margin.right) + ',' + yScale(dc.median));


    // text
    // .data(dc.dataset, d => d.citycode )
    // .transition()
    // .duration(200)
    // .text(d => {
    //   let data = Math.floor(d.data);
    //   if (data>=1000000) {
    //     data = (data / 1000).toLocaleString() + '千'
    //   } else {
    //     data = data.toLocaleString()
    //   }
    //   return data
    // })
    // .attr('x', d => xScale(d.cityname) + 2)
    // .attr('y', d => yScale(d.data)- 5);
    dc = null
  };
  //--------------------------------------------------------------------------------------------
  const type = ie? 'change': 'input';
  Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
  eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-' + prefOrCity), type, (() => {
    return e => rangeInput(e)
  })(1), false);












//
//
//
//
//   // 右データがないときは抜ける
//   if (!pathVal.stat) return;
//
//   //--------------------------------------------------------------------------------------------
//   const datasetP = JSON.parse(JSON.stringify(pathVal.statData.data));
//   const statNameP = pathVal.statData.title;
//   const unitP = pathVal.statData.unit;
//   // ソートして順位をつける-------------------------------------------------------------------
//   datasetP.sort((a,b) => {
//     if (a.data > b.data) return -1;
//     if (a.data < b.data) return 1;
//     return 0;
//   });
//   for (let i in datasetP) {
//     datasetP[i]['rightTop'] = Number(i) + 1
//   }
//   datasetP.sort((a,b) => {
//     if(a.citycode < b.citycode) return -1;
//     if(a.citycode > b.citycode) return 1;
//     return 0;
//   });
//   // 軸スケールの設定------------------------------------------------------------------------
//   if (!xScale) {
//     xScale = d3.scaleBand()
//     .rangeRound([margin.left, width - margin.right])
//     .padding(0.1)
//     .domain(datasetP.map(d => d.cityname));
//   }
//   if (!xAxis) {
//     xAxis = svg.append('g')
//     .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom + 0) + ')')
//     // .attr('class', 'x_text')
//     .call(d3.axisBottom(xScale))
//     .selectAll('text')
//     .attr('x', 0)
//     .attr('y', 3)
//     .style('text-anchor','start');
//   }
//   // 折れ線縦軸-----------------------------------------------------------------------------
//   const yScale2 = d3.scaleLinear()
//   .domain([0, d3.max(datasetP, d => d.data)])
//   .range([height - margin.bottom, margin.top]);
//   svg.append('g')
//   .attr('transform', 'translate(' + (width - margin.right) + ',' + 0 + ')')
//   .call(d3.axisRight(yScale2));
//   //折れ線（パス）の表示-------------------------------------------------------------------
//   const datasetPath = [];
//   for(let i = 0; i < datasetP.length; i++){
//     if(datasetP[i].data !== null){
//       datasetPath.push(datasetP[i])
//     }
//   }
//   const path = svg.append('path')
//   .datum(datasetPath)
//   .attr('fill', 'none')
//   .attr('stroke', 'gray')
//   .attr('stroke-width', 1)
//   .attr('d', d3.line()
//   .x(function (d) {
//     return xScale(d.cityname) + xScale.bandwidth()/2;
//   })
//   .y(function (d) {
//     return yScale2(d.data);
//   }));
//   //パスの長さを取得-------------------------------------------------------------------------
//   const pathLength = path.node().getTotalLength();
//   path.attr('stroke-dasharray', pathLength + ' ' + pathLength)
//   .attr('stroke-dashoffset', pathLength);
//   if (transitionFlg) {
//     path.transition()
//     .duration(1500)
//     .ease(d3.easeLinear)
//     .attr('stroke-dashoffset', 0);
//   } else {
//     path.attr('stroke-dashoffset', 0);
//   }
//   //サークル設置-----------------------------------------------------------------------------
//   const g3 = svg.append('g')
//   .selectAll('circle')
//   .data(datasetPath)
//   .enter();
//   const circle = g3.append('circle')
//   .on('mouseover', function (d)  {
//     tooltip.style('visibility', 'visible')
//     .html('折れ線<br>' + d.rightTop + '位　' + d.cityname + '<br>' + d.data + unitP);
//     d3.select(this)
//     .attr('r', 8)
//     .attr('style', 'fill:rgb(0,0,255)');
//   })
//   .on('mousemove', () => {
//     tooltip.style('top', (d3.event.pageY - 20) + 'px')
//     .style('left', (d3.event.pageX + 10) + 'px');
//   })
//   .on('mouseout', function ()  {
//     tooltip.style('visibility', 'hidden');
//     d3.select(this)
//     .attr('r', 4)
//     .attr('style', 'orange');
//   })
//   .attr('r', 0)
//   .attr('cx', d => xScale(d.cityname) + xScale.bandwidth()/2)
//   .attr('cy', d => yScale2(d.data))
//   .attr('fill', 'orange');
//   if (transitionFlg) {
//     circle.transition()
//     .delay((d,i) => {
//       return 1000 + (i * 50);
//     })
//     .attr('r', 4);
//   } else {
//     circle.attr('r', 4);
//   }
//   // 単位------------------------------------------------------------------------------------
//   svg.append('g')
//   .attr('font-size', 10 * multi + 'px')
//   .attr('transform', 'translate(' + (width - margin.right) + ',' + 15 + ')')
//   .append('text')
//   .text('単位:' + unitP);
//   // 表名------------------------------------------------------------------------------------
//   svg.append('g')
//   .attr('font-size', 12 * multi + 'px')
//   .attr('transform', 'translate(' + (width - margin.right - 30) + ',' + 15 + ')')
//   .attr('class' ,'no-print')
//   .append('text')
//   .text('折れ線 = ' + statNameP)
//   .attr('text-anchor', 'end');
}
