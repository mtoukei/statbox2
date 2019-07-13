import storeBase from '../store/store-base'
export default function (val, palentDiv) {
  const tooltip = d3.select('.d3-tooltip');
  const endStat = val.endStat;
  palentDiv = d3.select(palentDiv);
  palentDiv.select('svg').remove();
  if (!val.statData.length) return;
  const statDatas = val.statData;
  if (!statDatas.length) return;
  const dataset = statDatas[0].data;
  const unit = statDatas[0].unit;
  let unit2;
  statDatas.forEach(value => {
    if (value.unit !== unit) {
      unit2 = value.unit
    }
  });
  // 大元のSVG領域の大きさを設定-----------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 1200;
  const multi = width / defaultWidth < 1 ? width / defaultWidth : 1;
  const margin = { 'top': 40 * multi, 'bottom': 200 * multi, 'right': 100 * multi, 'left': 100 * multi };
    // SVG領域作成---------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg =
    palentDiv.select('.resizers').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMidYMid')
    .classed("svg-content-responsive", true)
    .classed("chart-svg", true);
  // クリップ領域-------------------------------------------------------------------------------
  svg.append('defs').append('clipPath')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('id', 'time-clip')
  .append('rect')
  .attr('width', width - margin.right - margin.left)
  .attr('height', height - margin.top - margin.bottom);
  // 年---------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', 'translate(' + (width - margin.right + 5) + ',' + (height - margin.bottom + 25) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text('年');
  // 単位----------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', () => 'translate(' + (margin.left - 20) + ',' + (12 * multi + margin.top - 30 * multi) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text('単位:' + unit);
  // 単位2--------------------------------------------------------------------------------------
  if (unit2) {
    svg.append('g')
    .attr('font-size', 12 * multi + 'px')
    .attr('transform', () => 'translate(' + (width - margin.right + 10) + ',' + (12 * multi + margin.top - 30) + ')')
    .attr('class', 'no-print')
    .append('text')
    .text('単位:' + unit2);
  }
  // 最大値取得-------------------------------------------------------------------------------
  const minYear = d3.min(dataset, d => d.year);
  // const minYear = 1898;
  const maxYear = d3.max(dataset, d => d.year);
  let minData = 0;
  let maxData = 0;
  let minData2 = 0;
  let maxData2 = 0;
  statDatas.forEach(value => {
    const min = d3.min(value.data, d => d.data);
    const max = d3.max(value.data, d => d.data);
    if (value.unit === unit) {
      if (minData > min) minData = min;
      if (maxData < max) maxData = max;
    } else {
      if (minData2 > min) minData2 = min;
      if (maxData2 < max) maxData2 = max;
    }
  });
  maxData = Math.ceil(maxData * 1.05);
  maxData2 = Math.ceil(maxData2 * 1.05);
  // フォントスケール-----------------------------------------------------------------------------
  const fontScale = d3.scaleLinear()
  .domain([1, String(maxData).length])
  .range([20 * multi, 14 * multi]);
  const fontScale2 = d3.scaleLinear()
  .domain([1, String(maxData2).length])
  .range([20 * multi, 14 * multi]);
  // 軸スケールの設定---------------------------------------------------------------------------
  const xScale = d3.scaleLinear()
  .domain([minYear, maxYear])
  .range([margin.left, width - margin.right]);
  const yScale = d3.scaleLinear()
  .domain([minData, maxData])
  .range([height - margin.bottom, margin.top]);
  let yScale2;
  if (unit2) {
    yScale2 = d3.scaleLinear()
    .domain([minData2, maxData2])
    .range([height - margin.bottom, margin.top]);
  } else {
    yScale2 = d3.scaleLinear()
    .domain([minData, maxData])
    .range([height - margin.bottom, margin.top]);
  }
  // 軸の表示----------------------------------------------------------------------------------
  // x軸
  svg.append('g')
  .attr("transform", "translate(" + 0 + "," + (height - margin.bottom) + ")")
  .call(
    d3.axisBottom(xScale)
    .tickSize(margin.top + margin.bottom - height)
  )
  .selectAll('text')
  .text(d => d) //三桁区切りになるのであえて設定
  .attr('x', 0)
  .attr('y', 10)
  .attr('font-size', 14 * multi + 'px')
  .attr('fill', 'black');
  // y軸
  svg.append('g')
  .attr("transform", "translate(" + margin.left + "," + 0 + ")")
  .call(
    d3.axisLeft(yScale)
    .tickSize(margin.left + margin.right - width)
    // .ticks(5)
  )
  .selectAll('text')
  .attr('font-size', d => {
    let len = String(d).length;
    if (len === 1) len = 2;
    return fontScale(len) + 'px'
  });
  // y軸2
  svg.append('g')
  .attr("transform", "translate(" + (width - margin.right) + "," + 0 + ")")
  .call(
    d3.axisRight(yScale2)
    // .tickSize(margin.left + margin.right - width)
    // .ticks(5)
  )
  .selectAll('text')
  .attr('font-size', d => {
    let len = String(d).length;
    if (len === 1) len = 2;
    if (unit2) {
      return fontScale2(len) + 'px'
    }
      return fontScale(len) + 'px'

  });
  svg.selectAll(".tick line")
  .attr('stroke', '#ccc')
  .attr('stroke-width', '1px')
  .attr('stroke-dasharray', '2');
  // focus時の縦線----------------------------------------------------------------------------
  const focus = svg.append("g")
  .attr("class", "focus")
  .style("visibility", "hidden");
  focus.append("line")
  .attr('transform', 'translate(0,' + margin.top + ')')
  .attr('stroke', 'blue')
  .attr('stroke-width', '1')
  .attr('stroke-dasharray', '2')
  .attr("y1", 0)
  .attr("y2", height - margin.top - margin.bottom);
  // ツールチップ---------------------------------------------------------------------------------
  const bisectDate = d3.bisector(d => { return d.year; }).left;
  // focusの判定用のoverlayを追加
  svg.append("rect")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .attr("width", width - margin.left - margin.right)
  .attr("height", height - margin.bottom - margin.top)
  .on("mouseover", () => {
    tooltip.style("visibility", "visible");
    focus.style("visibility", "visible"); })
  .on("mouseout", () => {
    tooltip.style("visibility", "hidden");
    focus.style("visibility", "hidden");
    palentDiv.selectAll('circle')
    .transition()
    .attr('r', 2);
    })
  .on("mousemove", function() {
      let yearMIn = 9999;
      let dYearMIn;
      let offset = 0;
      if ((width - margin.left - margin.right) / 2 < d3.mouse(this)[0]) {
        offset = Number(tooltip.style('width').replace('px', '')) + 20;
      }
      tooltip
      .style('visibility', 'visible')
      .style('left', (d3.event.clientX + 10 - offset) + 'px')
      .style('top', (d3.event.pageY + 10) + 'px')
      .style('text-align', 'left')
      .html(() => {
        const strAr = [];
        let str = '';
        statDatas.forEach(value => {
          const x0 = xScale.invert(d3.mouse(this)[0] + margin.left);
          //下三行の０は要変更。毎年データがある線を選ぶ必要がある
          const ii = bisectDate(statDatas[0].data, x0, 1);
          const d0 = statDatas[0].data[ii - 1];
          const d1 = statDatas[0].data[ii];
          const d2 = x0 - d0.year > d1.year - x0 ? d1 : d0;
          // ↓西暦でもう一回フィルター。スパンが揃っていない線に対応するため
          const d = value.data.find(el => el.year === d2.year);
          if (d) {
            let nen = d.nen;
            if (!nen) {
              const heisei = Number(d.year) - 1988;
              const syouwa = Number(d.year) - 1925;
              if (heisei > 0) {
                nen = '平成' + heisei + '年'
              } else {
                nen = '昭和' + syouwa + '年'
              }
            }
            strAr.push({
              title: value.title,
              nen: nen,
              year: d.year,
              data: d.data,
              unit: value.unit,
            });
            if (yearMIn > d.year) {
              yearMIn = d.year;
              dYearMIn = d
            }
            palentDiv.selectAll('circle')
            .transition()
            .attr('r', 2);
            palentDiv.selectAll('.year' + d.year)
            .transition()
            .duration(100)
            .attr('r', 5)
          }
        });
        strAr.sort((a, b) => {
          if (a.data > b.data) return -1;
          if (a.data < b.data) return 1;
          return 0;
        });
        // 複数あるラインのうち最も古い年を取得する
        const minYear = d3.min(strAr, d => d.year);
        strAr.forEach(value => {
            let dataUnit;
            if (!value.data) {
              dataUnit = 'データ無'
            } else {
              dataUnit = value.data.toLocaleString() + value.unit
            }
            // データがないラインには反応させない。
            if (minYear === value.year) {
              str += value.year + '年(' + value.nen + ')　' + dataUnit + '　' + value.title + '<br>'
            }
        });
        return str
      });
      if (dYearMIn) {
        focus.attr("transform", "translate(" + parseInt(xScale(dYearMIn.year)) + "," + 0 + ")")
        .style("visibility", "visible")
        .select(".x-hover-line")
        .attr("y2", height - margin.top)
      }
  });
  // データセットをコピーしてデータのない行を削除する。--------------------------------------------
  const colorScale = d3.scaleOrdinal(d3.schemeSet1);
  statDatas.forEach((value, index) => {
    const datasetCopy = JSON.parse(JSON.stringify(value.data)).filter(value => value.data !== '');
    // ラインの表示-------------------------------------------------------------------------------
    const path = svg.append('path')
    .datum(datasetCopy)
    .attr('class', 'line-graph')
    .attr('id', 'line-graph-' + index)
    .attr('clip-path', 'url(#time-clip)')
    .attr('fill', 'none')
    .attr('stroke', colorScale(index))
    .attr("stroke-width", 2.0)
    .attr('stroke-dasharray', '20,5')
    .attr('d', d3.line()
    .x(d => xScale(d.year))
    .y(d => value.unit === unit ? yScale(d.data) : yScale2(d.data)));
    // 丸の表示
    const gc = svg.append('g')
    .selectAll('.circle' + index)
    .data(datasetCopy)
    .enter();
    const circle = gc.append('circle')
    .attr('class', d => 'circle' + index + ' year' + d.year)
    .attr('r', 0)
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => value.unit === unit ? yScale(d.data) : yScale2(d.data))
    .attr('fill', colorScale(index));
    if (value.stat === endStat) {
      circle.transition()
      .delay((d, i) => 1000 + (i * 20))
      .attr('r', () => {
        if(datasetCopy.length === 1) {
          return 10
        }
          return 2
      });
    } else {
      circle.attr('r', () => {
        if(datasetCopy.length === 1) {
          return 10
        }
          return 2
      });
    }
    //パスの長さを取得----------------------------------------------------------------------------
    const pathLength = path.node().getTotalLength();
    const isTransition = storeBase.state.statList.leftStatTime.transition;
    path
    .attr('stroke-dasharray', pathLength)
    .attr('stroke-dashoffset', pathLength);
    if (value.stat === endStat && isTransition) {
      path.transition()
      .duration(800)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .transition()
      .duration(0)
      .attr('stroke-dasharray', () => value.unit === unit ? pathLength : '10 2')
    } else {
      path.attr('stroke-dashoffset', 0)
      .attr('stroke-dasharray', () => value.unit === unit ? pathLength : '10 2')
    }
  });
  // 凡例---------------------------------------------------------------------------------------
  const g2 = svg.append('g')
  .attr('transform', 'translate(' + (margin.left) + ',' + (height - margin.bottom + 30) + ')')
  .selectAll('rect')
  .data(statDatas)
  .enter();
  g2.append('rect')
  .attr('transform', (d, i) => {
    if(d.stat.split('/')[2] === unit) {
      return 'translate(0,' + (25 * i ) + ')'
    }
      return 'translate(25,' + (25 * i ) + ')'
  })
  .attr('id', (d, i) => 'rect-' + i)
  .style('cursor', 'pointer')
  .attr('width', 20)
  .attr('height', 20)
  .attr('stroke', 'black')
  .attr('stroke-width', '0.3px')
  .attr('fill', (d, i) => colorScale(Number(i)))
  .on('click', (d, i) => lineHide(i));
  g2.append('text')
  .text(d => d.title)
  .attr('font-size', 14 + 'px')
  .attr('transform', (d, i) => {
    if (d.stat.split('/')[2] === unit) {
      return 'translate(25,' + (14 * multi + 25 * i ) + ')'
    }
      return 'translate(50,' + (14 * multi + 25 * i ) + ')'
  })
  .style('cursor', 'pointer')
  .style('text-decoration', 'underline')
  .on('click', (d, i) => lineHide(i));
  //---------------------------------------------------------------------------------------------
  const lineHide = i => {
    const line = svg.select('#line-graph-' + i);
    const rect = svg.select('#rect-' + i);
    const circles = svg.selectAll('.circle' + i);
    const pathLength = line.node().getTotalLength();
    line
    .attr('stroke-dasharray', pathLength)
    .attr('stroke-dashoffset', pathLength)
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0)
    .transition()
    .duration(0)
    .attr('stroke-dasharray', () => statDatas[i].unit === unit ? pathLength : '10 2');
    if (line.style('display') !== 'none') {
      line.style('display', 'none');
      rect.style('opacity', '0.2');
      circles.style('display', 'none')
    } else {
      line.style('display', 'block');
      rect.style('opacity', '1.0');
      circles
      .transition()
      .delay(500)
      .style('display', 'block')
    }
  }
}
