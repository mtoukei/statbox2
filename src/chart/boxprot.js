import storeBase from '../store/store-base'
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length - 1 ];
  const palentDiv = d3.select(parentDiv);
  const rangeDiv = d3.select('#year-range-' + prefOrCity);
  const isEStat = val.estat;
  if (palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  let unit;
  if (isEStat) {
    const target = val.statData[val.statData.length - 1];
    dataset = target.data2;
    statName = val.statName;
    unit = target.data[0]['@unit'];
    const year = val.statData[val.statData.length - 1].time.substr(0, 4);
    rangeDiv.select('.year-range-text').text(year);
  } else {
    dataset = val.statData.data;
    statName = val.statData.title;
    unit = val.statData.unit;
  }
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  let width = palentDiv.node().getBoundingClientRect().width;
  let height = palentDiv.node().getBoundingClientRect().height - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  const multi = width / defaultWidth < 1.5 ? width / defaultWidth : 1.5;
  const margin = { 'top': 30 * multi, 'bottom': 10 * multi, 'right': 10 * multi, 'left': 70 * multi };
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.datasetOriginal = dataset;
      this.data = null;
      this.yScale = null;
      this.circleData = null;
      this.q1 = null;
      this.median = null;
      this.q3 = null;
      this.min = null;
      this.max = null;
      this.minCitys = null;
      this.maxCitys = null;
      this.minAll = null;
      this.maxAll = null;
    }
    create () {
      if (prefOrCity === 'pref') this.datasetOriginal.shift();
      this.data = this.datasetOriginal.map(value => value.data);
      this.circleData = this.datasetOriginal.map(value => {
        return {
          data: value.data,
          cityname: value.cityname,
          citycode: value.citycode
        }
      });
      const dataSorted = this.data.sort(d3.ascending);
      this.q1 = d3.quantile(dataSorted, .25);
      this.median = d3.quantile(dataSorted, .5);
      this.q3 = d3.quantile(dataSorted, .75);
      if (isEStat) {
        this.maxAll = 0;
        this.minAll = 99999999;
        val.statData.forEach(value => {
          const data = value.data2;
          data.forEach(value2 => {
            if (!isNaN(value2.data)) {
              if (value2.citycode !== '00000') {
                this.maxAll = this.maxAll < value2.data ? value2.data : this.maxAll;
                this.minAll = this.minAll > value2.data ? value2.data : this.minAll
              }
            }
          });
        })
      } else {
        this.maxAll = d3.max(this.datasetOriginal, d => d.data);
        this.minAll = d3.min(this.datasetOriginal, d => d.data);
      }
      this.min = d3.min(this.data);
      this.max = d3.max(this.data);
      this.minCitys = this.datasetOriginal.filter(value => value.data === this.min).map(value => value.cityname);
      this.maxCitys = this.datasetOriginal.filter(value => value.data === this.max).map(value => value.cityname)
      this.yScale = d3.scaleLinear()
      .domain([this.minAll, this.maxAll * 1.05])
      .range([height - margin.bottom, margin.top]);
    }
  }
  //--------------------------------------------------------------------------------------------
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'chart-svg');
  // Y軸---------------------------------------------------------------------------------------
  // const yScale = d3.scaleLinear()
  // .domain([dc.minAll, dc.maxAll * 1.05])
  // .range([height - margin.bottom, margin.top]);
  svg.append('g')
  .attr('id', 'box-y-axis')
  .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
  .call(d3.axisLeft(dc.yScale));
  // --------------------------------------------------------------------------------------------
  const boxWidth = 100;
  const center = margin.left + boxWidth / 2 + 20;
  const jitterWidth = 95;
  // 縦線---------------------------------------------------------------------------------------
  const vLine = svg.append('line')
  .attr('x1', center)
  .attr('x2', center)
  .attr('y1', 0)
  .attr('y2', 0)
  .attr('stroke', 'black');
  vLine
  .transition()
  .duration(1000)
  .attr('y1', dc.yScale(dc.min) )
  .attr('y2', dc.yScale(dc.max) );
  // ボックス作成--------------------------------------------------------------------------------
  const box = svg.append('rect')
  .attr('x', center - boxWidth / 2)
  .attr('y', dc.yScale(dc.q3))
  .attr('height', 0)
  .attr('width', boxWidth)
  .attr('stroke', 'black')
  .style('fill', 'slategrey');
  box
  .transition()
  .duration(1000)
  .attr('height', (dc.yScale(dc.q1) - dc.yScale(dc.q3)) );
  // 最小値、中央値、最大値 横線-------------------------------------------------------------
  const hLine = svg.selectAll('.horizontal-line')
  .data([dc.min, dc.median, dc.max])
  .enter()
  .append('line')
  .attr('x1', center - boxWidth / 2)
  .attr('x2', center + boxWidth / 2)
  .attr('y1', 0)
  .attr('y2', 0)
  .attr('stroke', 'black');
  hLine
  .transition()
  .duration(1000 )
  .attr('y1', d => dc.yScale(d))
  .attr('y2', d => dc.yScale(d));
  // 最小値、中央値、最大値テキスト------------------------------------------------------------
  const hLineText = svg.selectAll('.horizontal-line-text')
  .data([
    {data: dc.min, text: 'min ', citys: dc.minCitys},
    {data: dc.median, text: '中央値 ', citys: ''},
    {data: dc.max, text: 'max ', citys: dc.maxCitys}
  ])
  .enter()
  .append('text')
  .attr('x', center + boxWidth / 2 + 5)
  .attr('y', 0)
  .attr('font-size', 10 * multi + 'px')
  .attr('fill', 'black')
  .text(d => {
    const citys = d.citys ? d.citys.join() : '';
    const data = (Math.floor(d.data * 10) / 10).toLocaleString() + unit;
    return `${d.text}${data} ${citys}`
  });
  hLineText
  .transition()
  .duration(1000)
  .attr('y', d => dc.yScale(d.data));
  // 散布イメージ-------------------------------------------------------------------------------
  const circle = svg.selectAll('circle')
  .data(dc.circleData)
  .enter()
  .append('circle')
  .attr('class', 'box-circle-' + prefOrCity)
  .attr('cx', () => center - jitterWidth / 2 + Math.random() * jitterWidth )
  .attr('cy', d => dc.yScale(d.data))
  .attr('r', 0)
  .attr('fill', d => {
    const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
    return isTarget ? 'orange' : 'white'
  })
  .attr('stroke', 'black')
  .style('cursor', 'pointer');
  const radius = dc.circleData.length > 30 ? 4 : 6;
  circle
  .transition()
  .delay((d, i) => i * 40)
  .attr('r', radius);
  // クリックでカレントに色を塗る------------------------------------------------------------------
  circle
  .on('click', function (d) {
    // 実際の色塗りはwatch.jsで塗っている。
    const payload = {
      citycode: d3.select(this).attr('fill') === 'orange' ? '' : d.citycode,
      prefOrCity: prefOrCity
    };
    storeBase.commit('base/targetCitycodeChange', payload);
  });
  // ツールチップ---------------------------------------------------------------------------------
  const tip = d3Tip().attr('class', 'd3-tip').html(d => d);
  svg.call(tip);
  circle
  .on('mouseover', function (d) {
    return tip.show(`${d.cityname}<br>${d.data.toLocaleString()}${unit}`, this)
  })
  .on('mouseout', tip.hide);
  // 単位---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(10,15)')
  .append('text')
  .text('単位:' + unit);
  // 表名---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + 70 * multi + ',15)')
  .attr('class', 'no-print')
  .append('text')
  .text(statName)
  .attr('text-anchor', 'start');
  // 散布イメージonoff--------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 10 * multi + 'px')
  .attr('transform', 'translate(' + (width / 2) + ',30)')
  .attr('class', 'no-print')
  .append('text')
  .text('イメージonoff')
  .attr('text-anchor', 'start')
  .attr('cursor', 'pointer')
  .on('mouseenter', function() { d3.select(this).attr('fill', 'orange') })
  .on('mouseleave', function() { d3.select(this).attr('fill', 'black') })
  .on('click', () => {
    if (circle.style('display') !== 'none') {
      circle.style('display', 'none')
    } else {
      circle.style('display', 'block')
    }
  });
  // --------------------------------------------------------------------------------------------
  const redraw = () => {
    svg.attr('width', width);
    svg.attr('height', height);
    let target;
    if (isEStat) {
      const value = Number(d3.select('#year-range-' + prefOrCity).select('.year-range').property("value"));
      target = val.statData[value].data2;
    } else {
      target = dataset
    }
    const dc = new DataCreate(JSON.parse(JSON.stringify(target)));
    dc.create();
    svg.select('#box-y-axis')
    .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
    .call(d3.axisLeft(dc.yScale));
    vLine
    .attr('y1', dc.yScale(dc.min))
    .attr('y2', dc.yScale(dc.max));
    box
    .attr('y', dc.yScale(dc.q3))
    .attr('height', dc.yScale(dc.q1) - dc.yScale(dc.q3));
    hLine
    .data([dc.min, dc.median, dc.max])
    .attr('y1', d => dc.yScale(d))
    .attr('y2', d => dc.yScale(d));
    hLineText
    .data([
      {data: dc.min, text: 'min ', citys: dc.minCitys},
      {data: dc.median, text: '中央値 ', citys: ''},
      {data: dc.max, text: 'max ', citys: dc.maxCitys}
    ])
    .text(d => {
      const citys = d.citys ? d.citys.join() : '';
      const data = (Math.floor(d.data * 10) / 10).toLocaleString() + unit;
      return `${d.text}=${data} ${citys}`
    })
    .attr('y', d => dc.yScale(d.data));
    // 散布イメージ-------------------------------------------------------------------------------
    circle
    .data(dc.circleData)
    .attr('cy', d => dc.yScale(d.data))
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
  if (isEStat) {
    const type = ie ? 'change' : 'input';
    Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
    eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-' + prefOrCity + ' .year-range'), type, (() => {
      return () => redraw()
    })(1), false);
    if (prefOrCity === 'pref') {
      storeBase.commit('statList/yearRangePrefChange', val.statData.length - 1)
    } else {
      storeBase.commit('statList/yearRangeCityChange', val.statData.length - 1)
    }
  }
}
