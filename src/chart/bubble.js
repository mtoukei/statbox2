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
  let height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset;
      this.data = null;
      this.colorScale = null;
    }
    create () {
      if (prefOrCity === 'pref') this.dataset.shift();
      const children = [];
      for (const datasetValue of this.dataset) {
        const obj = {
          citycode: datasetValue.citycode,
          name: datasetValue.cityname,
          val: datasetValue.data
        };
        children.push(obj)
      }
      children.sort((a, b) => {
        if (a.val > b.val) return -1;
        if (a.val < b.val) return 1;
        return 0;
      });
      children.forEach((value, index) => value['top'] = index + 1);
      const data_set = {children: children};
      const bubble = d3.pack()
      .size([width, height])
      .padding(1.5);//バブル間の間隔
      const nodes = d3.hierarchy(data_set)
      .sum(d => d.val);// バブルの半径： val要素使用
      // d3.packのdescendantsメソッドですべてのバブル描画データを変換
      const bubble_data = bubble(nodes).descendants();
      // データ-----------------------------------------------------------------------------------
      // parentがないデータを返す
      const no_root_bubble = bubble_data.filter(d => d.parent !== null);
      this.data = no_root_bubble;
      // 変換されたバブルデータにある半径の最大値/最小値の割り出し-----------------------------
      const maxVal = d3.max(no_root_bubble, d => d.r);
      const minVal = d3.min(no_root_bubble, d => d.r);
      // 色のスケール作成------------------------------------------------------------------------
      const colorScale = d3.scaleLinear()
      .domain([minVal, maxVal])
      .range(['white', 'red']);
      this.data.forEach((value, index) => {
        value['rgb'] = colorScale(value.r);
        value['top'] = index + 1
      });
    }
  }
  //--------------------------------------------------------------------------------------------
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  palentDiv.style('background', '#d0d0d0');
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'chart-svg');
  // バブル作成---------------------------------------------------------------------------------
  const bubbles = svg.append('g')
  .selectAll('.bubble')
  .data(dc.data)
  .enter()
  .append('g')
  .attr('class', 'bubble')
  .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
  const circle = bubbles.append('circle')
  .attr('class', 'bubble-circle-' + prefOrCity)
  .attr('fill', d => String(d.data.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]) ? 'orange' : d.rgb)
  .style('cursor', 'pointer')
  .attr('r', 0);
  circle
  .transition()
  .delay((d, i) => i * 70)
  .attr('r', d => d.r);
  // バブルのテキスト
  const text = bubbles.append('text')
  .text(d => d.r !== 0 ? d.data.name : '')
  .attr('font-size', d => d.r / 2)
  .attr('transform', d => 'translate(0,' + (d.r / 2 / 3 ) + ')')
  .attr('text-anchor', 'middle')
  .attr('fill', d => {
    const rgb = d3.rgb(d.rgb);
    const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
    return cY > 200 ? 'black' : 'white';
  })
  .style('cursor', 'pointer')
  .attr('opacity', 0);
  text
  .transition()
  .delay((d, i) => i * 70)
  .attr('opacity', 1);
  // クリックでカレントに色を塗る------------------------------------------------------------------
  bubbles
  .on('click', function (d) {
    // 実際の色塗りはwatch.jsで塗っている。
    const payload = {
      citycode: d3.select(this).select('circle').attr('fill') === 'orange' ? '' : d.data.citycode,
      prefOrCity: prefOrCity
    };
    storeBase.commit('base/targetCitycodeChange', payload);
  });
  // ツールチップ---------------------------------------------------------------------------------
  const tip = d3Tip().attr('class', 'd3-tip').html(d => d);
  svg.call(tip);
  bubbles
  .on('mouseover', function (d) {
    return tip.show(`${d.data.top}位 ${d.data.name}<br>${d.data.val}${unit}`, this)
  })
  .on('mouseout', tip.hide);
  // 表名---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', '12px')
  .attr('transform', () => 'translate(5,17)')
  .attr('class', 'no-print')
  .append('text')
  .text(statName);
  //--------------------------------------------------------------------------------------------
  rangeDiv.select('.year-range')
  .attr('max', String(val.statData.length - 1));
  const length = val.statData.length;
  const quarter = Math.floor((length - 1) / 4);
  rangeDiv.select('.year-range-ticks').selectAll('.tick').remove();
  rangeDiv.select('.year-range-ticks')
  .selectAll('span')
  .data(val.statData)
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
  // --------------------------------------------------------------------------------------------
  const redraw = () => {
    svg.attr('width', width);
    svg.attr('height', height);
    let target;
    if (isEStat) {
      const value = Number(rangeDiv.select('.year-range').property("value"));
      target = val.statData[value].data2;
    } else {
      target = dataset
    }
    const dc = new DataCreate(JSON.parse(JSON.stringify(target)));
    dc.create();
    bubbles
    .data(dc.data, d => d.data.citycode)
    .transition()
    .duration(500)
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    circle
    .data(dc.data, d => d.data.citycode)
    .attr('r', d => d.r)
    .attr('fill', d => String(d.data.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]) ? 'orange' : d.rgb);
    text
    .data(dc.data, d => d.data.citycode)
    .text(d => d.r !== 0 ? d.data.name : '')
    .attr('font-size', d => d.r / 2)
    .attr('transform', d => 'translate(0,' + (d.r / 2 / 3 ) + ')')
    .attr('text-anchor', 'middle')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 200 ? 'black' : 'white';
    });
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
