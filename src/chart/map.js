import storeBase from "../store/store-base";
import * as GeoPref from './geo-pref'
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length - 1];
  const palentDiv = d3.select(parentDiv);
  const isEStat = val.estat;
  if(palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  let unit;
  if (isEStat) {
    const target = val.statData[val.statData.length - 1];
    dataset = target.data2;
    statName = val.statName;
    unit = target.data[0]['@unit'];
  } else {
    dataset = val.statData.data;
    statName = val.statData.title;
    unit = val.statData.unit;
  }
  const tooltip = d3.select('.d3-tooltip');
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  let width = palentDiv.node().getBoundingClientRect().width;
  let height = palentDiv.node().getBoundingClientRect().height - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  const multi = width / defaultWidth < 1.5 ? width / defaultWidth : 1.5;
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset;
      this.colorScale = null;
      this.legendDataSet = null;
      this.prefCode = null;
      this.geoPath = null
    }
    create () {
      if (prefOrCity === 'pref') this.dataset.shift();
      // ソートして順位をつける-------------------------------------------------------------------
      this.dataset.sort((a, b) => {
        if (a.data > b.data) return -1;
        if (a.data < b.data) return 1;
        return 0;
      });
      this.dataset.forEach((value, index) => value['top'] = index + 1);
      this.dataset.sort((a, b) => {
        if (a.citycode < b.citycode) return -1;
        if (a.citycode > b.citycode) return 1;
        return 0;
      });
      const isSSMap = storeBase.state.base.isSSMap;
      const maxLeft = d3.max(this.dataset, d => d.data);
      const minLeft = d3.min(this.dataset, d => d.data);
      this.legendDataSet = [];
      if (isSSMap) {
        this.colorScale = d3.scaleLinear()
        .domain([20, 50, 70, 120])
        .range(['blue', 'white', 'red', 'brown']);
        for (let i = 120; i > 20; i -= 3) {
          this.legendDataSet.push({
            color: this.colorScale(i),
          })
        }
      } else {
        this.colorScale = d3.scaleLinear()
        .domain([minLeft, maxLeft])
        .range(['white', 'red']);
        const value = maxLeft / 5;
        for (let i = 0; i < 5; i++) {
          this.legendDataSet.push({
            color: this.colorScale(value * (5 - i)),
            value: value * (5 - i)
          })
        }
      }
      const data0 = String(this.dataset[0].citycode).substr(0, 2);
      const data1 = String(this.dataset[1].citycode).substr(0, 2);
      this.prefCode = data0 !== data1 ? '00' : data0
      // projectionを定義----------------------------------------------------------------------
      let projection;
      if (this.prefCode === '00') {
        projection = d3.geoMercator()
        .center([138.141, 38.219])
        .translate([width / 2, height / 2]) // svgの中心
        .scale(2.5 * (width < height ? width : height));
      } else if ((this.prefCode === '13')) {
        projection = d3.geoMercator()
        .center([139.360, 35.6941])
        .translate([width / 2, height / 2]) // svgの中心
        .scale(50 * (width < height ? width : height));
      } else {
        const json = GeoPref['pref' + dc.prefCode];
        projection = d3.geoMercator()
        .fitExtent([[20, 20], [width - 10, height - 20]], json)
      }
      // pathを定義
      this.geoPath = d3.geoPath(projection);
    }
  }
  //---------------------------------------------------------------------------------------------
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // SVG領域作成---------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  palentDiv.style('background', '#d0d0d0');
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'chart-svg');
  // -------------------------------------------------------------------------------------------
  const json = GeoPref['pref' + dc.prefCode];
  const g = svg.append('g')
  .selectAll('path')
  .data(json.features)
  .enter();
  const pathG = g.append('path')
  .attr('class', 'map-path-' + prefOrCity)
  .attr('d', dc.geoPath)
  .attr('stroke', d => String(d.properties.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]) ? 'orange' : 'gray')
  .attr('stroke-width', d => String(d.properties.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]) ? '3px' : '0.2px')
  .style('cursor', 'pointer');
  // ツールチップ--------------------------------------------------------------------------------
  pathG
  .on('mouseover', d => {
    const result = dataset.find(el => Number(el.citycode) === Number(d.properties.citycode));
    if (result) {
      tooltip
      .style('visibility', 'visible')
      .html(`${result.cityname}<br>${result.data.toLocaleString()}${unit}<br>偏差値 ${result.standardScore.toLocaleString()}`);
    }
  })
  .on('mousemove', () => {
    tooltip
    .style('top', (d3.event.pageY - 45) + 'px')
    .style('left', (d3.event.pageX + 20) + 'px');
  })
  .on('mouseout', () => tooltip.style('visibility', 'hidden'));
  // クリックでカレントに色を塗る------------------------------------------------------------------
  pathG
  .on('click', function (d) {
    // 実際の色塗りはwatch.jsで塗っている。
    const payload = {
      citycode: d3.select(this).attr('stroke') === 'orange' ? '' : d.properties.citycode,
      prefOrCity: prefOrCity
    };
    storeBase.commit('base/targetCitycodeChange', payload);
  });
  // --------------------------------------------------------------------------------------------
  pathG
  .attr('fill', 'rgba(255,255,255,0.1)')
  .transition()
  .duration(1000)
  .delay((d, i) => i * 1000 / dc.dataset.length)
  .attr("fill", d => {
    if (d.properties.citycode) {
      const result = dc.dataset.find(value => Number(value.citycode) === Number(d.properties.citycode));
      const isSSMap = storeBase.state.base.isSSMap;
      if (result) {
        const target = isSSMap ? result.standardScore : result.data;
        return result ? dc.colorScale(target) : 'rgba(0,0,0,0)'
      } else {
        return 'rgba(0,0,0,0)'
      }
    }
    return 'rgba(0,0,0,0)'
  });
  const isSSMap = storeBase.state.base.isSSMap;
  let legendG;
  const legendCreate = dataset => {
    // 凡例（実数用）-------------------------------------------------------------------------
    legendG = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (5) + ',' + (30 * multi) + ')')
    .selectAll('rect')
    .data(dataset)
    .enter();
    legendG.append('rect')
    .attr('transform', (d, i) => 'translate(0,' + (20 * i * multi) + ')')
    .attr('width', 20 * multi)
    .attr('height', 20 * multi)
    .attr('stroke', 'black')
    .attr('stroke-width', '0.3px')
    .attr('fill', 'rgba(255,255,255,0.1)')
    .transition()
    .delay((d, i) => i * 100)
    .attr('fill', d => d.color);
    legendG.append('text')
    .attr('font-size', 10 * multi + 'px')
    .attr('transform', (d, i) => 'translate(' + (22 * multi) + ',' + (10 * multi + 20 * i * multi) + ')')
    .text(d => Math.floor(d.value).toLocaleString() + ' ' + unit);
  };
  if (!isSSMap) {
    legendCreate(dc.legendDataSet)
  }
  // 表名---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', '12px')
  .attr('transform', () => 'translate(5,17)')
  .attr('class', 'no-print')
  .append('text')
  .text(statName);
  // 偏差値説明--------------------------------------------------------------------------------
  const ssDescriptionG = svg.append('g')
  .attr('transform', () => 'translate(5,' + (height - 5) + ')')
  .attr('class', 'no-print');
  ssDescriptionG.append('text')
  .attr('font-size', '12px')
  .text('偏差値　赤＝高　白＝50　青＝低');
  // 表示を偏差値に----------------------------------------------------------------------------
  const ssTextG = svg.append('g')
  .attr('transform', () => 'translate(' + (width - 5) + ',17)')
  .attr('class', 'no-print');
  ssTextG.append('text')
  .attr('font-size', '12px')
  .attr('text-anchor', 'end')
  .style('cursor', 'pointer')
  .text(() => storeBase.state.base.isSSMap ? '実数へ' : '偏差値へ')
  .on('click', function () {
    storeBase.commit('base/isSSMapChange');
    redraw();
    d3.select(this)
    .text(() => storeBase.state.base.isSSMap ? '実数へ' : '偏差値へ');
  })
  .on('mouseenter', function() { d3.select(this).attr('fill', 'orange') })
  .on('mouseleave', function() { d3.select(this).attr('fill', 'black') });
  // ズーム--------------------------------------------------------------------------------------
  const zoom =
    d3.zoom()
    .on('zoom', () => svg.selectAll('path').attr("transform", d3.event.transform));
  svg.call(zoom);
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
    pathG
    .attr('d', dc.geoPath, d => d.properties.citycode)
    .attr("fill", d => {
      if (d.properties.citycode) {
        const result = dc.dataset.find(value => Number(value.citycode) === Number(d.properties.citycode));
        const isSSMap = storeBase.state.base.isSSMap;
        const target = isSSMap ? result.standardScore : result.data;
        return result ? dc.colorScale(target) : 'rgba(0,0,0,0)'
      }
      return 'rgba(0,0,0,0)'
    });
    ssDescriptionG
    .attr('transform', () => 'translate(5,' + (height - 5) + ')');
    const isSSMap = storeBase.state.base.isSSMap;
    if (isSSMap) {
      svg.selectAll('.legend').style('display', 'none')
    } else {
      if(legendG) {
        svg.selectAll('.legend').style('display', 'block');
        legendG
        .selectAll('rect')
        .data(dc.legendDataSet)
        .attr('fill', d => d.color);
        legendG.selectAll('text')
        .data(dc.legendDataSet)
        .text(d => Math.floor(d.value).toLocaleString() + ' ' + unit);
      } else {
        legendCreate(dc.legendDataSet)
      }
    }
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
  }
}
