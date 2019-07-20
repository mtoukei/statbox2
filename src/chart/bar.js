import storeBase from '../store/store-base'
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length - 1 ];
  const palentDiv = d3.select(parentDiv);
  const isEStat = val.estat;
  if(palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  let unit;
  if (isEStat) {
    const target = val.statData[val.statData.length - 1];
    dataset = target;
    statName = val.statName;
    unit = target.data[0]['@unit'];
  } else {
    dataset = val.statData;
    statName = val.statData.title;
    unit = val.statData.unit;
  }
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  let width = palentDiv.node().getBoundingClientRect().width;
  let height = palentDiv.node().getBoundingClientRect().height - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 600;
  let multi = width / defaultWidth < 1.5 ? width / defaultWidth : 1.5;
  const margin = { 'top': 40 * multi, 'bottom': 60 * multi, 'right': 10 * multi, 'left': 50 * multi };
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset, orderType) {
      this.datasetOriginal = dataset;
      this.dataset = null;
      this.xScale = null;
      this.yScale = null;
      this.yFontSize = '8px';
      this.orderType = orderType;
      this.maxVal = null;
      this.minVal = null;
      this.median = null;
      this.mean = null;
      this.standardDeviation = null;
    }
    create () {
      const data2 = isEStat ? this.datasetOriginal.data2 : this.datasetOriginal.data;
      if (prefOrCity === 'pref') data2.shift();
      // ソートして順位をつける-------------------------------------------------------------------
      data2.sort((a, b) => {
        if (a.data > b.data) return -1;
        if (a.data < b.data) return 1;
        return 0;
      });
      data2.forEach((v, i) => v['top'] = i + 1);
      if(this.orderType === 'original') {
        data2.sort((a, b) => {
          if (a.citycode < b.citycode) return -1;
          if (a.citycode > b.citycode) return 1;
          return 0;
        });
      } else if (this.orderType === 'asc') {
        data2.sort((a, b) => {
          if (a.data < b.data) return -1;
          if (a.data > b.data) return 1;
          return 0;
        });
      }
      if (isEStat) {
        this.maxVal = 0;
        this.minVal = 99999999;
        val.statData.forEach(value => {
          const data = value.data2;
          data.forEach(value2 => {
            if (!isNaN(value2.data)) {
              if (value2.citycode !== '00000') {
                this.maxVal = this.maxVal < value2.data ? value2.data : this.maxVal;
                this.minVal = this.minVal > value2.data ? value2.data : this.minVal
              }
            }
          });
        })
      } else {
        this.maxVal = d3.max(data2, d => d.data);
        this.minVal = d3.min(data2, d => d.data);
      }
      if (this.minVal >= 0) {
        this.minVal = 0
      } else {
        this.minVal = this.minVal * 1.1
      }
      this.dataset = data2;
      // 最大値に合わせて文字サイズと左マージンを設定---------------------------------------------
      const len = String(Math.floor(this.maxVal)).length;
      if (len >= 6) {
        margin.left = 60;
        this.yFontSize = 8 * multi + 'px'
      } else if (len >= 5) {
        margin.left = 50;
        this.yFontSize = 10 * multi + 'px'
      } else if (len >= 3) {
        margin.left = 40;
        this.yFontSize = 10 * multi + 'px'
      } else {
        margin.left = 30;
        this.yFontSize = 10 * multi + 'px'
      }
      margin.left = margin.left * multi;
      this.xScale = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.2)
      .domain(this.dataset.map(d => d.cityname));
      this.yScale = d3.scaleLinear()
      .domain([this.minVal, this.maxVal])
      .range([height - margin.bottom, margin.top]);
      // 統計------------------------------------------------------------------------------------
      this.mean = this.datasetOriginal.mean;
      this.median = this.datasetOriginal.median;
      this.standardDeviation = this.datasetOriginal.standardDeviation;
    }
  }
  //---------------------------------------------------------------------------------------------
  const orderType = storeBase.state.base.barSort;
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)), orderType);
  dc.create();
  // SVG領域作成-----------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg =
    palentDiv.select('.resizers').append('svg')
    .attr('width', width)
    .attr('height', height)
    .classed("chart-svg", true);

  // 軸の表示----------------------------------------------------------------------------------
  // x軸
  const axisx = d3.axisBottom(dc.xScale)
  .ticks(20);
  const cityNameText = svg.append('g')
  .attr('id', 'bar-x-axis')
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
  .attr('fill', 'black')
  .attr('text-anchor', 'start')
  .style('cursor', 'pointer');
  // y軸----------------------------------------------------------------------------------------
  const yText = svg.append('g')
  .attr('id', 'bar-y-axis')
  .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
  .call(d3.axisLeft(dc.yScale))
  .selectAll('text')
  .attr('font-size', dc.yFontSize);
  // 棒の表示-----------------------------------------------------------------------------------
  const g = svg.append('g')
  .selectAll('rect')
  .data(dc.dataset)
  .enter();
  const rect = g.append('rect')
  .attr('class', 'bar-rect-' + prefOrCity)
  .attr('x', d => dc.xScale(d.cityname))
  .attr('width', dc.xScale.bandwidth())
  .attr('y', dc.yScale(0))
  .attr('height', 0)
  .style('cursor', 'pointer');
  rect
  .transition()
  .duration(1000)
  .delay((d, i) => i * 1000 / dc.dataset.length)
  .attr('y', d => d.data >= 0 ? dc.yScale(d.data) : dc.yScale(0))
  .attr('fill', d => {
    const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
    if (d.data >= 0) {
      return isTarget ? 'orange' : 'slategray';
    }
    return isTarget ? 'orange' : 'coral'
  })
  .attr('height', d => Math.abs(dc.yScale(d.data) - dc.yScale(0)));
  // 平均値-------------------------------------------------------------------------------------
  const meanPolyline = svg.append('polyline')
  .attr('stroke', 'blue')
  .attr('stroke-width', 1)
  .attr('points', margin.left + ',' + 0 + ' ' + (width - margin.right) + ',' + 0)
  .transition()
  .duration(1000)
  .attr('points', margin.left + ',' + dc.yScale(dc.mean) + ' ' + (width - margin.right) + ',' + dc.yScale(dc.mean));
  const meanTextG = svg.append('g')
  .attr('transform', 'translate(' + (width - margin.right * multi) + ',15)')
  .attr('class', 'no-print');
  const meanText = meanTextG.append('text')
  .text(`青線：平均値＝${(Math.floor(dc.mean * 10) / 10).toLocaleString()}${unit}`)
  .attr('font-size', '12px')
  .attr('text-anchor', 'end')
  .style('cursor', 'pointer')
  .on('mouseenter', function() { d3.select(this).attr('fill', 'orange') })
  .on('mouseleave', function() { d3.select(this).attr('fill', 'black') })
  .on('click', () => {
    meanPolyline.style('display', () => meanPolyline.style('display') !== 'none' ? 'none' : 'block')
  });
  // 中央値-------------------------------------------------------------------------------------
  const medianPolyline = svg.append('polyline')
  .attr('stroke', 'red')
  .attr('stroke-width', 1)
  .attr('points', margin.left + ',' + 0 + ' ' + (width - margin.right) + ',' + 0)
  .transition()
  .duration(2000)
  .attr('points', margin.left + ',' + dc.yScale(dc.median) + ' ' + (width - margin.right) + ',' + dc.yScale(dc.median));
  const medianTextG = svg.append('g')
  .attr('transform', 'translate(' + (width - margin.right * multi) + ',32)')
  .attr('class', 'no-print');
  const medianText = medianTextG.append('text')
  .text(`赤線：中央値＝${(Math.floor(dc.median * 100) / 100).toLocaleString()}${unit}`)
  .attr('font-size', '12px')
  .attr('text-anchor', 'end')
  .style('cursor', 'pointer')
  .on('mouseenter', function() { d3.select(this).attr('fill', 'orange') })
  .on('mouseleave', function() { d3.select(this).attr('fill', 'black') })
  .on('click', () => {
    medianPolyline.style('display', () => medianPolyline.style('display') !== 'none' ? 'none' : 'block')
  });
  // 標準偏差----------------------------------------------------------------------------------
  const sdTextG = svg.append('g')
  .attr('transform', 'translate(' + (width - margin.right * multi) + ',49)')
  .attr('class', 'no-print');
  const sdText = sdTextG.append('text')
  .text(`標準偏差＝${(Math.floor(dc.standardDeviation * 100) / 100).toLocaleString()}`)
  .attr('font-size', '12px')
  .attr('text-anchor', 'end')
  .style('cursor', 'pointer');
  // 偏差値------------------------------------------------------------------------------------
  const standardScoreCompute = dataset => {
    if (!storeBase.state.base.targetCitycode) return 'X';
    const result = dataset.find(value => String(value.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]));
    if (result) {
      return result.standardScore.toLocaleString()
    }
    return 'XX'
  };
  //---------------------------------------------------------------------------------------------
  const ssTextG = svg.append('g')
  .attr('transform', 'translate(' + (width - margin.right * multi) + ',66)')
  .attr('class', 'no-print');
  const ssText = ssTextG.append('text')
  .text(`偏差値＝${standardScoreCompute(dc.dataset)}`)
  .attr('class', 'standard-score-text-' + prefOrCity)
  .attr('font-size', '12px')
  .attr('text-anchor', 'end')
  .style('cursor', 'pointer');
  // ツールチップ---------------------------------------------------------------------------------
  const tip = d3Tip().attr('class', 'd3-tip').html(d => d);
  svg.call(tip);
  rect
  .on('mouseover', function (d) {
    return tip.show(`${d.top}位 ${d.cityname}<br><br>${d.data.toLocaleString()}${unit}<br><br>偏差値 ${d.standardScore.toLocaleString()}`, this)
  })
  .on('mouseout', tip.hide);
  // クリックでカレントに色を塗る+偏差値を計算する-----------------------------------------------
  rect
  .on('click', function (d) {
    // 実際の色塗りはwatch.jsで塗っている。
    const payload = {
      citycode: d3.select(this).attr('fill') === 'orange' ? '' : d.citycode,
      prefOrCity: prefOrCity
    };
    storeBase.commit('base/targetCitycodeChange', payload);
    // ------------------------------------------------------------------------------------------
    ssText.text(`偏差値＝${d.standardScore.toLocaleString()}`)
  });
  cityNameText
  .on('click', function (d) {
    // 実際の色塗りはwatch.jsで塗っている。
    const target = d.cityname ? d.cityname : d;// 逃げのコード
    const cityCode = dc.dataset.find(value => value.cityname === target).citycode;
    const payload = {
      citycode: storeBase.state.base.targetCitycode === cityCode ? '' : cityCode,
      prefOrCity: prefOrCity
    };
    storeBase.commit('base/targetCitycodeChange', payload);
    // ------------------------------------------------------------------------------------------
    ssText.text(`偏差値＝${d.standardScore.toLocaleString()}`)
  });
  // 単位---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', '12px')
  .attr('transform', 'translate(10,15)')
  .append('text')
  .text('単位:' + unit);
  // 表名---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', '12px')
  .attr('transform', 'translate(' + 70 * multi + ',15)')
  .attr('class', 'no-print')
  .append('text')
  .text(statName)
  .attr('text-anchor', 'start');
  // ソートのグループ-----------------------------------------------------------------------------
  const sortG = svg.append('g')
  .attr('transform', 'translate(' + (width / 2 - 100) + ',30)')
  .attr('class', 'no-print')
  .attr('cursor', 'pointer');
  // 降順---------------------------------------------------------------------------------------
  sortG
  .append('text')
  .attr('font-size', '12px')
  .text('降順')
  .attr('text-anchor', 'start')
  .on('mouseenter', function() { d3.select(this).attr('fill', 'orange') })
  .on('mouseleave', function() { d3.select(this).attr('fill', 'black') })
  .on('click', () => order('desc'));
  // 昇順---------------------------------------------------------------------------------------
  sortG
  .append('text')
  .attr('transform', 'translate(' + 40 * multi + ',0)')
  .attr('font-size', '12px')
  .text('昇順')
  .attr('text-anchor', 'start')
  .on('mouseenter', function() { d3.select(this).attr('fill', 'orange') })
  .on('mouseleave', function() { d3.select(this).attr('fill', 'black') })
  .on('click', () => order('asc'));
  // 元の並び（シティコード順）-----------------------------------------------------------------
  sortG
  .append('text')
  .attr('transform', 'translate(' + 80 * multi + ',0)')
  .attr('font-size', '12px')
  .text('元の並び')
  .attr('text-anchor', 'start')
  .on('mouseenter', function() { d3.select(this).attr('fill', 'orange') })
  .on('mouseleave', function() { d3.select(this).attr('fill', 'black') })
  .on('click', () => order('original'));
  // 昇順、降順の関数-------------------------------------------------------------------------
  const order = orderType => {
    storeBase.commit('base/barSortChange', orderType);
    let dc;
    if (isEStat) {
      const rangeValue = d3.select('#year-range-' + prefOrCity + ' .year-range').property('value');
      dc = new DataCreate(JSON.parse(JSON.stringify(val.statData[rangeValue])), orderType);
    } else {
      dc = new DataCreate(JSON.parse(JSON.stringify(dataset)), orderType);
    }
    dc.create();
    rect
    .data(dc.dataset)
    .transition()
    .duration(200)
    .attr('height', d => Math.abs(dc.yScale(d.data) - dc.yScale(0)))
    .attr('y', d => {
      if (d.data >= 0) return dc.yScale(d.data);
      return dc.yScale(0)
    })
    .attr('fill', d => {
      const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
      if (d.data >= 0) return isTarget ? 'orange' : 'slategray';
      return isTarget ? 'orange' : 'coral'
    });
    cityNameText
    .data(dc.dataset)
    .text(d => d.cityname);
  };
  // --------------------------------------------------------------------------------------------
  const redraw = () => {
    const orderType = storeBase.state.base.barSort;
    svg.attr('width', width);
    svg.attr('height', height);
    let target;
    if (isEStat) {
      const value = Number(d3.select('#year-range-' + prefOrCity).select('.year-range').property("value"));
      target = val.statData[value];
    } else {
      target = dataset
    }
    const dc = new DataCreate(JSON.parse(JSON.stringify(target)), orderType);
    dc.create();
    // x軸--------------------------------------------------------------------------------------
    const axisx = d3.axisBottom(dc.xScale)
    .ticks(20);
    svg.select("#bar-x-axis")
    .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
    .call(axisx);
    multi = width / defaultWidth < 1.5 ? width / defaultWidth : 1.5;
    cityNameText
    .attr('font-size', 10 * multi + 'px');
   // y軸---------------------------------------------------------------------------------------
    svg.select("#bar-y-axis")
    .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
    .call(d3.axisLeft(dc.yScale));
    yText
    .attr('font-size', dc.yFontSize);
    // 棒----------------------------------------------------------------------------------------
    rect
    .data(dc.dataset)
    .attr('height', d => Math.abs(dc.yScale(d.data) - dc.yScale(0)))
    .attr('y', d => d.data >= 0 ? dc.yScale(d.data) : dc.yScale(0))
    .attr('x', d => dc.xScale(d.cityname))
    .attr('width', dc.xScale.bandwidth())
    .attr('fill', d => {
      const isTarget = String(d.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity]);
      if (d.data >= 0) return isTarget ? 'orange' : 'slategray';
      return isTarget ? 'orange' : 'coral';
    });
    cityNameText
    .data(dc.dataset)
    .text(d => d.cityname);
    // 平均値-----------------------------------------------------------------------------------
    meanPolyline
    .attr('points', margin.left + ',' + dc.yScale(dc.mean) + ' ' + (width - margin.right) + ',' + dc.yScale(dc.mean));
    meanTextG.attr('transform', 'translate(' + (width - margin.right * multi) + ',15)');
    meanText.text(`青線：平均値＝${(Math.floor(dc.mean * 10) / 10).toLocaleString()}${unit}`);
    // 中央値-----------------------------------------------------------------------------------
    medianPolyline
    .attr('points', margin.left + ',' + dc.yScale(dc.median) + ' ' + (width - margin.right) + ',' + dc.yScale(dc.median));
    medianTextG.attr('transform', 'translate(' + (width - margin.right * multi) + ',32)');
    medianText.text(`赤線：中央値＝${(Math.floor(dc.median * 100) / 100).toLocaleString()}${unit}`);
    // 標準偏差--------------------------------------------------------------------------------
    sdTextG.attr('transform', 'translate(' + (width - margin.right * multi) + ',49)');
    sdText.text(`標準偏差＝${(Math.floor(dc.standardDeviation * 100) / 100).toLocaleString()}`);
    // 偏差値-----------------------------------------------------------------------------------
    ssTextG.attr('transform', 'translate(' + (width - margin.right * multi) + ',66)');
    ssText.text(`偏差値＝${standardScoreCompute(dc.dataset)}`);
    // ソートグループ-----------------------------------------------------------------------------
    sortG.attr('transform', 'translate(' + (width / 2 - 100) + ',30)');
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
