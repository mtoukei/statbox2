import storeBase from '../store/store-base'
import * as ss from 'simple-statistics'
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length -1 ];
  const palentDiv = d3.select(parentDiv);
  const isEStat = val.estat === true;
  if(palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  let unit;
  if (isEStat) {
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
      if (val.estat) {
        this.maxVal = 0;
        this.minVal = 99999999;
        for (const value of val.statData) {
          const data = value.data2;
          for (const value of data) {
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
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg =
    palentDiv.select('.resizers').append('svg')
    .attr('width', width)
    .attr('height', height)
    .classed("chart-svg", true);
  // 最大値に合わせて文字サイズと左マージンを設定---------------------------------------------
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
  const xScale = d3.scaleBand()
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
  svg.append('g')
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
  // -------------------------------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    const dc = new DataCreate(JSON.parse(JSON.stringify(val.statData[value].data2)));
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
  };
  //--------------------------------------------------------------------------------------------
  if (isEStat) {
    const type = ie? 'change': 'input';
    Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
    eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-' + prefOrCity + ' .year-range'), type, (() => {
      return e => rangeInput(e)
    })(1), false);
  }

}
