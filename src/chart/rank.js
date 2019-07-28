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
      this.datasetDesc = null;
    }
    create() {
      // ソートして順位をつける-------------------------------------------------------------------
      if (prefOrCity === 'pref') this.dataset.shift();
      this.dataset.sort((a, b) => {
        if (a.data > b.data) return -1;
        if (a.data < b.data) return 1;
        return 0;
      });
      const isSSRank = storeBase.state.base.isSSRank;
      let target, colorScale;
      if (isSSRank) {
        target = 'standardScore';
        colorScale = d3.scaleLinear()
        .domain([20, 50, 70, 120])
        .range(['blue', 'white', 'red', 'brown']);
      } else {
        target = 'data';
        const maxLeft = d3.max(this.dataset, d => d.data);
        const minLeft = d3.min(this.dataset, d => d.data);
        colorScale = d3.scaleLinear()
        .domain([minLeft, maxLeft])
        .range(['white', 'red']);
      }
      this.dataset.forEach((value, index) => {
        value['rgb'] = colorScale(value[target]);
        value['top'] = index + 1
      });
      this.datasetDesc = JSON.parse(JSON.stringify(this.dataset));
      this.datasetDesc.sort((a, b) => {
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
  .style('overflow-x', 'hidden');
  const svg = containerDiv.append('svg')
  .attr('width', width - 25)
  .attr('height', dc.dataset.length * 15 * multi + 40)
  .attr('class', 'chart-svg');
  // 横棒(上位)--------------------------------------------------------------------------------
  const g = svg.append('g')
  .attr('transform', 'translate(' + (10 * multi) + ',25)')
  .selectAll('rect')
  .data(dc.dataset)
  .enter();
  const rectG1 = g.append('g');
  const rect1 = rectG1.append('rect')
  .attr('class', 'rank-rect-' + prefOrCity)
  .attr('width', 130 * multi)
  .attr('height', 15 * multi)
  .attr('transform', (d, i) => 'translate(0,' + (15 * i * multi) + ')')
  .attr('fill', d => {
    const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
    return isTarget ? 'orange' : d.rgb
  })
  .style('cursor', 'pointer');
  rect1
  .attr('opacity', 0)
  .transition()
  .duration(1000)
  .delay((d, i) => i * 50)
  .attr('opacity', 1.0);
  // テキスト------------------------------------------------------------------------------------
  const text1_1 = g.append('g')
  .append('text')
  .attr('transform', (d, i) => 'translate(0,' + (11 * multi + 15 * i * multi) + ')')
  .attr('text-anchor', 'start')
  .attr('font-size', 12 * multi + 'px')
  .text(d => d.top + ' ' + d.cityname )
  .attr('fill', d => {
    const rgb = d3.rgb(d.rgb);
    const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
    return cY > 150 ? 'black' : 'white';
  })
  .style('pointer-events', 'none');
  const text1_2 = g.append('g')
  .append('text')
  .attr('transform', (d, i) => 'translate(' + (130 * multi) + ',' + (11 * multi + 15 * i * multi) + ')')
  .attr('text-anchor', 'end')
  .attr('font-size', 12 * multi + 'px')
  .text(d => {
    const target = storeBase.state.base.isSSRank ? d.standardScore : d.data;
    return target.toLocaleString()
  })
  .attr('fill', d => {
    const rgb = d3.rgb(d.rgb);
    const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
    return cY > 150 ? 'black' : 'white';
  })
  .style('pointer-events', 'none');
  // 横棒(下位)--------------------------------------------------------------------------------
  const g2 = svg.append('g')
  .attr('class', 'g2')
  .attr('transform', 'translate(' + (145 * multi) + ',' + (25) + ')')
  .selectAll('rect')
  .data(dc.datasetDesc)
  .enter();
  const rectG2 = g2.append('g');
  const rect2 = rectG2.append('rect')
  .attr('class', 'rank-rect-' + prefOrCity)
  .attr('width', 130 * multi)
  .attr('height', 15 * multi)
  .attr('transform', (d, i) => 'translate(0,' + (15 * i * multi) + ')')
  .attr('fill', d => {
    const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
    return isTarget ? 'orange' : d.rgb
  })
  .style('cursor', 'pointer');
  rect2
  .attr('opacity', 0)
  .transition()
  .duration(1000)
  .delay((d, i) => i * 50)
  .attr('opacity', 1.0);
  // テキスト------------------------------------------------------------------------------------
  const text2_1 = g2.append('g')
  .append('text')
  .attr('transform', (d, i) => 'translate(0,' + (12 * multi + 15 * i * multi) + ')')
  .attr('text-anchor', 'start')
  .attr('font-size', 12 * multi + 'px')
  .text(d => d.top + ' ' + d.cityname)
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
  .text(d => {
    const target = storeBase.state.base.isSSRank ? d.standardScore : d.data;
    return target.toLocaleString()
  })
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
  rect1
  .on('click', function (d) {
    rectClick(d, d3.select(this))
  });
  rect2
  .on('click', function (d) {
    rectClick(d, d3.select(this))
  });
  // 表名---------------------------------------------------------------------------------------
  const statNameTextG = svg.append('g')
  .attr('transform', () => 'translate(5,17)')
  .attr('class', 'no-print');
  const statNameText = statNameTextG.append('text')
  .attr('font-size', '12px')
  .text(() => storeBase.state.base.isSSRank ? statName + '　偏差値' : statName + '　単位：' + unit);
  // 表示を偏差値に----------------------------------------------------------------------------
  const ssTextG = svg.append('g')
  .attr('transform', () => 'translate(' + (width - 30) + ',17)')
  .attr('class', 'no-print');
  ssTextG.append('text')
  .attr('font-size', '12px')
  .attr('text-anchor', 'end')
  .style('cursor', 'pointer')
  .text(() => storeBase.state.base.isSSRank ? '実数へ' : '偏差値へ')
  .on('click', function () {
    storeBase.commit('base/isSSRankChange');
    redraw();
    d3.select(this)
    .text(() => storeBase.state.base.isSSRank ? '実数へ' : '偏差値へ');
    //-----------------------------------------------------------------------
    const text = storeBase.state.base.isSSRank ? statName + '　偏差値' : statName + '　単位：' + unit;
    statNameText
    .text(text)
  })
  .on('mouseenter', function() { d3.select(this).attr('fill', 'orange') })
  .on('mouseleave', function() { d3.select(this).attr('fill', 'black') });
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
    // 横棒(上位)------------------------------------------------------------------------------
    rect1
    .data(dc.dataset, d => d.citycode)
    .attr('width', 130 * multi)
    .attr('height', 15 * multi)
    .attr('fill', d => {
      const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
      return isTarget ? 'orange' : d.rgb
    })
    .attr('transform', (d, i) => 'translate(0,' + (12 * multi + 15 * (i - 1) * multi) + ')');
    text1_1
    .data(dc.dataset, d => d.citycode)
    .attr('transform', (d, i) => 'translate(0,' + (11 * multi + 15 * i * multi) + ')')
    .text(d => d.top + ' ' + d.cityname)
    .attr('font-size', 12 * multi + 'px')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 150 ? 'black' : 'white';
    });
    text1_2
    .data(dc.dataset, d => d.citycode)
    .attr('transform', (d, i) => 'translate(' + (130 * multi) + ',' + (11 * multi + 15 * i * multi) + ')')
    .text(d => {
      const target = storeBase.state.base.isSSRank ? d.standardScore : d.data;
      return target.toLocaleString()
    })
    .attr('font-size', 12 * multi + 'px')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 150 ? 'black' : 'white';
    });
    // 横棒(下位)------------------------------------------------------------------------------
    svg.select('.g2')
    .attr('transform', 'translate(' + (10 * multi + 135 * multi) + ',25)');
    rect2
    .data(dc.datasetDesc, d => d.citycode)
    .attr('width', 130 * multi)
    .attr('height', 15 * multi)
    .attr('fill', d => {
      const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
      return isTarget ? 'orange' : d.rgb
    })
    .attr('transform', (d, i) => 'translate(' + (0) + ',' + (12 * multi + 15 * (i - 1) * multi) + ')');
    text2_1
    .data(dc.datasetDesc, d => d.citycode)
    .attr('transform', (d, i) => 'translate(' + (0) + ',' + (11 * multi + 15 * i * multi) + ')')
    .text(d => d.top + ' ' + d.cityname)
    .attr('font-size', 12 * multi + 'px')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 150 ? 'black' : 'white';
    });
    text2_2
    .data(dc.datasetDesc, d => d.citycode)
    .attr('transform', (d, i) => 'translate(' + (130 * multi) + ',' + (11 * multi + 15 * i * multi) + ')')
    .text(d => {
      const target = storeBase.state.base.isSSRank ? d.standardScore : d.data;
      return target.toLocaleString()
    })
    .attr('font-size', 12 * multi + 'px')
    .attr('fill', d => {
      const rgb = d3.rgb(d.rgb);
      const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
      return cY > 150 ? 'black' : 'white';
    });
    //-------------------------------------------------------------------------------------------
    ssTextG
    .attr('transform', () => 'translate(' + (width - 30) + ',17)')
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
