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
      this.colorScale = d3.scaleLinear()
      .domain([20, 50, 70, 120])
      .range(['blue', 'white', 'red', 'brown']);
      this.legendDataSet = [];
      for (let i = 120; i > 20; i -= 3) {
        this.legendDataSet.push({
          color: this.colorScale(i),
        })
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
  .attr('fill', 'rgba(255,255,255,0.1)')
  .style('cursor', 'pointer');
  // ツールチップ--------------------------------------------------------------------------------
  pathG
  .on('mouseover', function(d) {
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
  .on('mouseout', function () {
    tooltip.style('visibility', 'hidden');
    d3.select(this)
  });
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
  .transition()
  .delay((d, i) => i * 50)
  .attr("fill", d => {
    if (d.properties.citycode) {
      const result = dc.dataset.find(value => Number(value.citycode) === Number(d.properties.citycode));
      return result ? dc.colorScale(result.standardScore) : 'rgba(0,0,0,0)'
    }
    return 'rgba(0,0,0,0)'
  });
  // 凡例---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('transform', 'translate(' + (5) + ',' + (30 * multi) + ')')
  .selectAll('rect')
  .data(dc.legendDataSet)
  .enter()
  .append('rect')
  .attr('transform', (d, i) => 'translate(0,' + (2.5 * i * multi) + ')')
  .attr('width', 20 * multi)
  .attr('height', 20 * multi)
  .attr('fill', 'rgba(255,255,255,0.1)')
  .transition()
  .delay((d, i) => i * 10)
  .attr('fill', d => d.color);
  // 表名---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', () => 'translate(5,' + (12 * multi + 5) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text(statName);
  // 偏差値説明--------------------------------------------------------------------------------
  svg.append('g')
  .attr('id', 'ssText')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', () => 'translate(5,' + (height - 5) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text('偏差値　赤＝大　白＝50　青＝小');
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
        return result ? dc.colorScale(result.standardScore) : 'rgba(0,0,0,0)'
      }
      return 'rgba(0,0,0,0)'
    });
    svg.select('#ssText')
    .attr('transform', () => 'translate(5,' + (height - 5) + ')')
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
