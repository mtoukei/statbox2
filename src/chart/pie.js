import storeBase from "../store/store-base";
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
  let height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  const multi = width / defaultWidth < 1.5 ? width / defaultWidth : 1.5;
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset;
      this.radius = null;
    }
    create () {
      if (prefOrCity === 'pref') this.dataset.shift();
      // ソートして順位をつける-------------------------------------------------------------------
      this.dataset.sort((a, b) => {
        if (a.data > b.data) return -1;
        if (a.data < b.data) return 1;
        return 0;
      });
      // this.dataset.forEach((value, index) => value['leftTop'] = index + 1); // 全部表示するときはこれだけ
      // 5分の1をその他にする↓
      const sum = Common.sum(this.dataset, "data");
      let kei = 0, hoka = 0;
      this.dataset.forEach((value, index) => {
        kei += value.data;
        value['leftTop'] = index + 1;
        value['percent'] = value.data / sum * 100;
        value.cityname = index + 1 + ' ' + value.cityname;
        if (kei > sum * 4 / 5) {
          hoka += value.data;
          value.data = 0
        }
      });
      const zeloIndex = this.dataset.findIndex(value => value.data === 0);
      this.dataset.splice(zeloIndex, 0, {
        citycode: '99999',
        cityname: 'その他',
        data: hoka
      });
      this.radius = Math.min(width, height) / 2 - 10
    }
  }
  //---------------------------------------------------------------------------------------------
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // SVG領域作成---------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'chart-svg');
  const colorScale = d3.scaleOrdinal(d3.schemeSet1);
  //--------------------------------------------------------------------------------------------
  const g = svg.append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
  //--------------------------------------------------------------------------------------------
  const pie = d3.pie()
  .value(d => d.data)
  .sort(null);
  //--------------------------------------------------------------------------------------------
  const pieGroup = g.selectAll('.pie')
  .data(pie(dc.dataset))
  .enter()
  .append('g')
  .attr('class', 'pie');
  // 扇形---------------------------------------------------------------------------------------
  const arc = d3.arc()
  .outerRadius(dc.radius)
  .innerRadius(40 * multi);
  const path = pieGroup.append('path')
  .attr('id', d => 'pie-path-' + d.data.citycode)
  .attr('class', 'pie-path-' + prefOrCity)
  .attr('fill', d => {
    if (d.data.citycode === '99999') {
      return 'slategrey'
    } else if (isEStat) {
      if (prefOrCity === 'pref') {
        return colorScale(Number(d.data.citycode.substr(0, 2)))
      }
      return colorScale(Number(d.data.citycode.substr(3, 2)))
    }
    return colorScale(d.index)
  })
  .attr('stroke', d => {
    if (String(d.data.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity])) {
      if ((d.data.data !== 0)) return 'orange'
    }
    return 'whitesmoke'
  })
  .attr('stroke-width', d => {
    if (String(d.data.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity])) {
      if ((d.data.data !== 0)) return '8px'
    }
    return 0
  });
  path
  .transition()
  .duration(70)
  .delay((d, i) => i * 60)
  .attrTween('d', d => {
    const interpolate = d3.interpolate(
      {startAngle: d.startAngle, endAngle: d.startAngle},
      {startAngle: d.startAngle, endAngle: d.endAngle}
    );
    return t => arc(interpolate(t));
  });
  //---------------------------------------------------------------------------------------------
  const text = d3.arc()
  .outerRadius(dc.radius - 30 * multi)
  .innerRadius(dc.radius - 30 * multi);
  const textP = pieGroup.append('text')
  .attr('fill', function (d) {
    let rgb;
    if (val.estat) {
      if (prefOrCity === 'pref') {
        rgb = d3.rgb(colorScale(Number(d.data.citycode.substr(0, 2))))
      } else{
        rgb = d3.rgb(colorScale(Number(d.data.citycode.substr(3, 2))))
      }
    } else {
      rgb = d3.rgb(colorScale(d.index));
    }
    const cY = 0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b;
    return cY > 200 ? 'black' : 'white';
  })
  .attr('transform', d => 'translate(' + text.centroid(d) + ')')
  .attr('dy', '5px')
  .attr('font-size', d => {
    let fontSize = 10 * multi + 'px';
    const angle = d.endAngle - d.startAngle;
    if (angle > 0.4) {
      fontSize = 14 * multi + 'px'
    } else if (angle > 0.3) {
      fontSize = 12 * multi + 'px'
    }
    return fontSize
  })
  .attr('text-anchor', 'middle');
  textP
  .transition()
  .duration(80)
  .delay((d, i) => i * 70)
  .text(d => d.data.data !== 0 ? d.data.cityname : '');
  // クリックでカレントに色を塗る-------------------------------------------------------------------
  const elClick = (d, path) => {
    // 実際の色塗りはwatch.jsで塗っている。;
    const payload = {
      citycode: path.attr('stroke') === 'orange' ? '' : d.data.citycode,
      prefOrCity: prefOrCity
    };
    storeBase.commit('base/targetCitycodeChange', payload);
  };
  path
  .on('click', function (d) {
    elClick(d, d3.select(this))
  });
  textP
  .on('click', function (d) {
    elClick(d, d3.select('#pie-path-' + d.data.citycode))
  });
  // ツールチップ---------------------------------------------------------------------------------
  const tip = d3Tip().attr('class', 'd3-tip').html(d => d);
  svg.call(tip);
  textP
  .on('mouseover', function (d) {
    if (d.data.leftTop) return tip.show(`${d.data.cityname}<br>${d.data.data}${unit}<br>${Math.floor(d.data.percent * 10) / 10}%`, this)
  })
  .on('mouseout', tip.hide);
  // 表名-------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', (12 * multi) + 'px')
  .attr('transform', () => 'translate(5,' + (12 * multi + 5) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text(statName);
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
    g
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    arc
    .outerRadius(dc.radius);
    path
    .data(pie(dc.dataset, d => d.citycode))
    .transition()
    .duration(500)
    .attr('d', arc)
    .attr('fill', d => {
      if (val.estat) {
        if (d.data.citycode === '99999') {
          return 'slategrey'
        } else if (prefOrCity === 'pref') {
          return colorScale(Number(d.data.citycode.substr(0, 2)))
        }
        return colorScale(Number(d.data.citycode.substr(3, 2)))
      }
      return colorScale(d.index)
    })
    .attr('stroke', d => {
      if (String(d.data.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity])) {
        if ((d.data.data !== 0)) return 'orange'
      }
      return 'whitesmoke'
    })
    .attr('stroke-width', d => {
      if (String(d.data.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity])) {
        if ((d.data.data !== 0)) return '8px'
      }
      return 0
    });
    text
    .outerRadius(dc.radius - 30 * multi)
    .innerRadius(dc.radius - 30 * multi);
    textP
    .data(pie(dc.dataset, d => d.citycode))
    .transition()
    .duration(500)
    .attr('transform', d => 'translate(' + text.centroid(d) + ')')
    .text(d => {
      if (d.data.data !== 0) return d.data.cityname
    })
    .attr('fill', d => {
      let rgb;
      if (isEStat) {
        if (prefOrCity === 'pref') {
          rgb = d3.rgb(colorScale(Number(d.data.citycode.substr(0, 2))))
        } else{
          rgb = d3.rgb(colorScale(Number(d.data.citycode.substr(3, 2))))
        }
      } else {
        rgb = d3.rgb(colorScale(d.index));
      }
      if (0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b > 200) {
        return "black";
      }
      return "white";
    })
    .attr('font-size', d => {
      let fontSize = 10 * multi + 'px';
      const angle = d.endAngle - d.startAngle;
      if (angle > 0.4) {
        fontSize = 14 * multi + 'px'
      } else if (angle > 0.3) {
        fontSize = 12 * multi + 'px'
      }
      return fontSize
    })
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
