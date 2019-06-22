import storeBase from "../store/store-base";
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length - 1 ];
  const palentDiv = d3.select(parentDiv);
  const isEStat = val.estat === true;
  if(palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  // let unit;
  if (isEStat) {
    const target = val.statData[val.statData.length - 1];
    // const allPrefData = target.data;
    dataset = target.data2;
    statName = val.statName;
    // unit = allPrefData[0]['@unit'];
  } else {
    dataset = val.statData.data;
    statName = val.statData.title;
    // unit = val.statData.unit;
  }
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  const multi = width / defaultWidth < 1.5 ? width / defaultWidth : 1.5;
  const radius = Math.min(width, height) / 2 - 10;
  //トランジションフラグ----------------------------------------------------------------------------
  const transitionFlg = storeBase.state.statList.transition;
  // const transitionFlg = false
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset;
    }
    create () {
      if (prefOrCity === 'pref') this.dataset.shift();
      // ソートして順位をつける-------------------------------------------------------------------
      this.dataset.sort((a, b) => {
        if (a.data > b.data) return -1;
        if (a.data < b.data) return 1;
        return 0;
      });
      this.dataset.forEach((v, i) => v['leftTop'] = i + 1);
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
  .classed("chart-svg", true);
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
  //--------------------------------------------------------------------------------------------
  const arc = d3.arc()
  .outerRadius(radius)
  .innerRadius(40 * multi);
  const path = pieGroup.append('path')
  .attr('fill', d => {
    if (val.estat) {
      if (prefOrCity === 'pref') {
        return colorScale(Number(d.data.citycode.substr(0, 2)))
      }
        return colorScale(Number(d.data.citycode.substr(3, 2)))
    }
      return colorScale(d.index)
  })
  .attr('stroke', 'whitesmoke');
  if (transitionFlg) {
    path.transition()
    .duration(70)
    .delay((d, i) => 60 * i)
    .attrTween('d', d => {
      const interpolate = d3.interpolate(
        {startAngle: d.startAngle, endAngle: d.startAngle},
        {startAngle: d.startAngle, endAngle: d.endAngle}
      );
      return t => arc(interpolate(t));
    });
  } else {
    path.attr('d', arc)
  }
  //---------------------------------------------------------------------------------------------
  const text = d3.arc()
  .outerRadius(radius - 30 * multi)
  .innerRadius(radius - 30 * multi);
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
    if (0.3 * rgb.r + 0.6 * rgb.g + 0.1 * rgb.b > 200) {
      return "black";
    }
      return "white";
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
  if (transitionFlg) {
    textP.transition()
    .duration(80)
    .delay((d, i) => 70 * i)
    .text(d => {
      const angle = d.endAngle - d.startAngle;
      if (angle > 0.1) return d.data.cityname
    });
  } else {
    textP.text(d => {
      const angle = d.endAngle - d.startAngle;
      if (angle > 0.1) return d.data.cityname
    });
  }
  // 表名-------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', (12 * multi) + 'px')
  .attr('transform', () => 'translate(5,' + (12 * multi + 5) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text(statName);
  // -------------------------------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    const dc = new DataCreate(JSON.parse(JSON.stringify(val.statData[value].data2)));
    dc.create();
    path
    .data(pie(dc.dataset, d => d.citycode))
    .transition()
    .duration(500)
    .attr('d', arc)
    .attr('fill', d => {
      if (val.estat) {
        if (prefOrCity === 'pref') {
          return colorScale(Number(d.data.citycode.substr(0, 2)))
        }
          return colorScale(Number(d.data.citycode.substr(3, 2)))
      }
        return colorScale(d.index)
    });
    textP
    .data(pie(dc.dataset, d => d.citycode))
    .transition()
    .duration(500)
    .attr('transform', d => 'translate(' + text.centroid(d) + ')')
    .text(d => {
      const angle = d.endAngle - d.startAngle;
      if (angle > 0.1) return d.data.cityname
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
    });
  };
  //--------------------------------------------------------------------------------------------
  if (isEStat) {
    const type = ie ? 'change' : 'input';
    Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
    eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-' + prefOrCity + ' .year-range'), type, (() => {
      return e => rangeInput(e)
    })(1), false);
  }
}
