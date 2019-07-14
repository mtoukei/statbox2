import * as Common from './common'
import storeBase from "../store/store-base";
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length - 1 ];
  const palentDiv = d3.select(parentDiv);
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
  } else {
    dataset = val.statData.data;
    statName = val.statData.title;
    unit = val.statData.unit;
  }
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  let width = palentDiv.node().getBoundingClientRect().width;
  let height = palentDiv.node().getBoundingClientRect().height - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  let multi = width / defaultWidth < 5 ? width / defaultWidth : 5;
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor(dataset) {
      this.dataset = dataset;
      this.dataset2 = null;
    }
    create() {
      // ソートして順位をつける-------------------------------------------------------------------
      if (prefOrCity === 'pref') this.dataset.shift();
      this.dataset.sort((a, b) => {
        if (a.data > b.data) return -1;
        if (a.data < b.data) return 1;
        return 0;
      });
      const maxLeft = d3.max(this.dataset, d => d.data);
      const minLeft = d3.min(this.dataset, d => d.data);
      const colorScale = d3.scaleLinear()
      .domain([minLeft, maxLeft])
      .range(['white', 'red']);
      this.dataset.forEach((value, index) => {
        value['rgb'] = colorScale(value.data);
        value['leftTop'] = index + 1
      });
      this.dataset2 = JSON.parse(JSON.stringify(this.dataset));
      this.dataset2.sort((a, b) => {
        if (a.data < b.data) return -1;
        if (a.data > b.data) return 1;
        return 0;
      });
    }
  }
  //--------------------------------------------------------------------------------------------
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  palentDiv.select('#rank-container-div').remove();
  palentDiv.style('background', '#d0d0d0');
  const containerDiv = palentDiv.select('.resizers').append('div')
  .attr('id', 'rank-container-div')
  .style('height', (height - 20 * multi) + 'px')
  .style('overflow', 'auto');
  const svg = containerDiv.append('svg')
  .attr('width', width - 25)
  .attr('height', dc.dataset.length * 15 * multi + 40)
  .classed("chart-svg", true);
  //--------------------------------------------------------------------------------------------
  const g = svg.append('g')
  .attr('transform', 'translate(' + (10 * multi) + ',' + (10 * multi + 15) + ')')
  .selectAll('rect')
  .data(dc.dataset)
  .enter();
  // 横棒(上位)--------------------------------------------------------------------------------
  const rectG1 = g.append('g')
  .append('rect')
  .attr('class', 'rank-rect-' + prefOrCity)
  .attr('width', 130 * multi)
  .attr('height', 15 * multi)
  .attr('transform', (d, i) => 'translate(' + (0) + ',' + (15 * i * multi) + ')')
  .attr('fill', d => {
    const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
    return isTarget ? 'orange' : d.rgb
  })
  .attr('stroke', 'black')
  .attr('stroke-width', 0.2)
  .style('cursor', 'pointer');
  // テキスト------------------------------------------------------------------------------------
  const text1_1 = g.append('g')
  .append('text')
  .attr('transform', (d, i) => 'translate(' + (0) + ',' + (12 * multi + 15 * i * multi) + ')')
  .attr('text-anchor', 'start')
  .attr('font-size', 12 * multi + 'px')
  .text(d => d.leftTop + ' ' + d.cityname )
  .attr('fill', d => {
    const rgb = d3.rgb(d.rgb);
    const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
    return cY > 150 ? 'black' : 'white';
  })
  .style('pointer-events', 'none');
  const text1_2 = g.append('g')
  .append('text')
  .attr('transform', (d, i) => 'translate(' + (130 * multi) + ',' + (12 * multi + 15 * i * multi) + ')')
  .attr('text-anchor', 'end')
  .attr('font-size', 12 * multi + 'px')
  .text(d => d.data.toLocaleString())
  .attr('fill', d => {
    const rgb = d3.rgb(d.rgb);
    const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
    return cY > 150 ? 'black' : 'white';
  })
  .style('pointer-events', 'none');
  //--------------------------------------------------------------------------------------------
  const g2 = svg.append('g')
  .attr('id', 'g2')
  .attr('transform', 'translate(' + (10 * multi + 135 * multi) + ',' + (10 * multi + 15) + ')')
  .selectAll('rect')
  .data(dc.dataset2)
  .enter();
  // 横棒(下位)--------------------------------------------------------------------------------
  const rectG2 = g2.append('g')
  .append('rect')
  .attr('class', 'rank-rect-' + prefOrCity)
  .attr('width', 130 * multi)
  .attr('height', 15 * multi)
  .attr('transform', (d, i) => 'translate(0,' + (15 * i * multi) + ')')
  .attr('fill', d => {
    const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
    return isTarget ? 'orange' : d.rgb
  })
  .attr('stroke', 'black')
  .attr('stroke-width', 0.2)
  .style('cursor', 'pointer');
  // テキスト------------------------------------------------------------------------------------
  const text2_1 = g2.append('g')
  .append('text')
  .attr('transform', (d, i) => 'translate(0,' + (12 * multi + 15 * i * multi) + ')')
  .attr('text-anchor', 'start')
  .attr('font-size', 12 * multi + 'px')
  .text(d => d.leftTop + ' ' + d.cityname)
  .attr('fill', d => {
    const rgb = d3.rgb(d.rgb);
    const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
    return cY > 150 ? 'black' : 'white';
  })
  .style('pointer-events', 'none');
  const text2_2 = g2.append('g')
  .append('text')
  .attr('transform', (d, i) => 'translate(' + (130 * multi) + ',' + (12 * multi + 15 * i * multi) + ')')
  .attr('text-anchor', 'end')
  .attr('font-size', 12 * multi + 'px')
  .text(d => d.data.toLocaleString())
  .attr('fill', d => {
    const rgb = d3.rgb(d.rgb);
    const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
    return cY > 150 ? 'black' : 'white';
  })
  .style('pointer-events', 'none');
  // クリックでカレントに色を塗る------------------------------------------------------------------
  const rectClick = (d, rect) => {
    // 実際の色塗りはwatch.jsで塗っている。
    const payload = {
      citycode: rect.attr('fill') === 'orange' ? '' : d.citycode,
      prefOrCity: prefOrCity
    };
    storeBase.commit('base/targetCitycodeChange', payload);
  };
  rectG1
  .on('click', function (d) {
    rectClick(d, d3.select(this))
  });
  rectG2
  .on('click', function (d) {
    rectClick(d, d3.select(this))
  });
  // 表名-------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', (12 * multi) + 'px')
  .attr('transform', () => 'translate(5,' + (12 * multi + 5) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text(statName + '　単位：' + unit);
  // --------------------------------------------------------------------------------------------
  const redraw = () => {
    multi = width / defaultWidth < 5 ? width / defaultWidth : 5;
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
    palentDiv.select('#rank-container-div')
    .style('height', (height - 20 * multi) + 'px');
    rectG1
    .data(dc.dataset, d => d.citycode)
    .attr('width', 130 * multi)
    .attr('height', 15 * multi)
    .attr('fill', d => {
      const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
      return isTarget ? 'orange' : d.rgb
    })
    .attr('transform', (d, i) => {
      return 'translate(0,' + (12 * multi + 15 * (i - 1) * multi) + ')'
    });
    text1_1
    .data(dc.dataset, d => d.citycode)
    .attr('transform', (d, i) => 'translate(0,' + (12 * multi + 15 * i * multi) + ')')
    .text(d => d.leftTop + ' ' + d.cityname)
    .attr('font-size', 12 * multi + 'px')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 150 ? 'black' : 'white';
    });
    text1_2
    .data(dc.dataset, d => d.citycode)
    .attr('transform', (d, i) => 'translate(' + (130 * multi) + ',' + (12 * multi + 15 * i * multi) + ')')
    .text(d => d.data.toLocaleString())
    .attr('font-size', 12 * multi + 'px')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 150 ? 'black' : 'white';
    });
    //-------------------------------------------------------------------------------------------
    svg.select('#g2')
    .attr('transform', 'translate(' + (10 * multi + 135 * multi) + ',' + (10 * multi + 15) + ')');
    rectG2
    .data(dc.dataset2, d => d.citycode)
    .attr('width', 130 * multi)
    .attr('height', 15 * multi)
    .attr('fill', d => {
      const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
      return isTarget ? 'orange' : d.rgb
    })
    .attr('transform', (d, i) => 'translate(' + (0) + ',' + (12 * multi + 15 * (i - 1) * multi) + ')');
    text2_1
    .data(dc.dataset2, d => d.citycode)
    .attr('transform', (d, i) => 'translate(' + (0) + ',' + (12 * multi + 15 * i * multi) + ')')
    .text(d => d.leftTop + ' ' + d.cityname)
    .attr('font-size', 12 * multi + 'px')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 150 ? 'black' : 'white';
    });
    text2_2
    .data(dc.dataset2, d => d.citycode)
    .attr('transform', (d, i) => 'translate(' + (130 * multi) + ',' + (12 * multi + 15 * i * multi) + ')')
    .text(d => d.data.toLocaleString())
    .attr('font-size', 12 * multi + 'px')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 150 ? 'black' : 'white';
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
  }
}
