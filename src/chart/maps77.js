import storeBase from '../store/store-base'
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length -1 ];
  const palentDiv = d3.select(parentDiv);
  if (palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  if (val.estat) {
    const target = val.statData[val.statData.length - 1];
    dataset = target.data2;
    statName = val.statName;
  } else {
    dataset = val.statData.data;
    statName = val.statData.title;
  }
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  const multi = width / defaultWidth < 5 ? width / defaultWidth : 5;
  //トランジションフラグ----------------------------------------------------------------------------
  const transitionFlg = storeBase.state.statList.transition;
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor(dataset) {
      this.dataset = dataset;
      this.prefData = null;
      this.colorScale = null;
      this.maxLeft = null;
    }
    create() {
      if (prefOrCity === 'pref') this.dataset.shift();
      this.prefData = [];
      for (const value of storeBase.state.base.prefOptions) {
        this.prefData.push({
          prefcode: value.value,
          prefname: value.label,
          chihou8id: value.chihou8id
        })
      }
      this.prefData.sort((a, b) => {
        if (a.chihou8id.order < b.chihou8id.order) return -1;
        if (a.chihou8id.order > b.chihou8id.order) return 1;
        return 0;
      });
      this.prefData.unshift({prefcode: '99999', prefname: 'dummy'});
      // ソートして順位をつける-------------------------------------------------------------------
      this.dataset.sort((a, b) => {
        if (a.data > b.data) return -1;
        if (a.data < b.data) return 1;
        return 0;
      });
      this.dataset.forEach((v, i) => v['leftTop'] = i + 1);
      this.dataset.sort((a, b) => {
        if (a.citycode < b.citycode) return -1;
        if (a.citycode > b.citycode) return 1;
        return 0;
      });
      this.maxLeft = d3.max(this.dataset, d => d.data);
      const minLeft = d3.min(this.dataset, d => d.data);
      this.colorScale = d3.scaleLinear()
      .domain([minLeft, this.maxLeft])
      .range(['white', 'red']);
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
  .attr('viewBox', '0 0 '+ width + ' ' + height)
  .attr('preserveAspectRatio', 'xMidYMid')
  .classed("svg-content-responsive", true)
  .classed("chart-svg", true);
  //--------------------------------------------------------------------------------------------
  const g = svg.append('g')
  .attr('transform', 'translate(' + (15 * multi) + ',' + (10 * multi + 15) + ')')
  .selectAll('rect')
  .data(dc.prefData)
  .enter();
  //--------------------------------------------------------------------------------------------
  const rectSize = 38;
  const rectG = g.append('g')
  .attr('transform', (d, i) => {
    const y = rectSize * Math.floor(i / 7);
    const x = rectSize * (i % 7);
    return 'translate(' + (x * multi) + ',' + (y * multi) + ')';
  })
  .attr('fill', 'rgba(0,0,0,0)');
  //--------------------------------------------------------------------------------------------
  const rect =rectG.append('rect')
  .attr('width', rectSize * multi)
  .attr('height', rectSize * multi)
  .attr('display', (d, i) => i <= 1? 'none': 'block');
  //--------------------------------------------------------------------------------------------
  const dash = d => {
    if (d.chihou8id) {
      switch (d.chihou8id.stroke) {
        case 'tb':
          return rectSize * multi;
        case 'tl':case 'tr':
          return rectSize * 2 * multi + ',' + rectSize * 2 * multi;
        case 'tbl':
          return rectSize * multi + ',' + rectSize * multi + ',' + rectSize *2 * multi;
        case 'tlr':
          return rectSize * 2 * multi + ',' + rectSize * multi;
        case 'tblr':
          return rectSize * 4 * multi;
        case 'bl':
          return 0 + ',' + rectSize * 2 * multi + ',' + rectSize * 2 * multi;
        case 'br':
          return 0 + ',' + rectSize * multi + ',' + rectSize * multi;
        case 'blr':
          return 0 + ',' + rectSize * multi + ',' + rectSize *3 * multi;
        case 'l':case 'r':
          return 40 * multi + ',' + rectSize * 3 * multi;
        case 'lr':
          return 0 + ',' + rectSize * multi + ',' + 0;
        default:
          return '0,rectSize * 3'
      }
    }
  };
  const dashOffset = d => {
    if (d.chihou8id) {
      switch (d.chihou8id.stroke) {
        case 'tl':case 'l':
          return - rectSize * 3 * multi;
        case 'r':
          return - rectSize * multi;
        default:
      }
    }
  };
  // --------------------------------------------------------------------------------------------
  const rectColor = d => {
    if (d.chihou8id) {
      const chiku = d.chihou8id.chiku;
      switch (chiku) {
        case '9syuuokinawa':
          return '#b0c4de';
        case '4koku':
          return '#cb99ff';
        case 'cyuugoku':
          return '#6c8df2';
        case 'kinki':
          return '#99ffff';
        case 'cyuubu':
          return '#71ff94';
        case 'touhoku':
          return '#c0c0c0';
        case 'kantou':
          return '#cbff99';
        case 'hokkaidou':
          return '#87cefa'
      }
    }
  };
  if (transitionFlg) {
    rect.transition()
    .delay((d, i) => i * 20)
    .attr('fill', d => rectColor(d))
    .attr('stroke-dasharray', d => dash(d))
    .attr('stroke-dashoffset', d => dashOffset(d))
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
  } else {
    rect.attr('fill', d => rectColor(d))
    .attr('stroke-dasharray', d => dash(d))
    .attr('stroke-dashoffset', d => dashOffset(d))
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
  }
  // 県名---------------------------------------------------------------------------------------
  const prefText = rectG.append('text')
  .attr('display', (d, i) => i <= 1? 'none': 'block')
  .attr('font-size', 10 * multi + 'px')
  .attr('x', 5 * multi)
  .attr('y', 10 * multi)
  .attr('fill', 'black');
  if (transitionFlg) {
    prefText
    .transition()
    .delay((d, i) => i * 20)
    .text(d => d.prefname)
  } else {
    prefText.text(d => d.prefname)
  }
  // サークル------------------------------------------------------------------------------------
  const circleG = g.append('g')
  .attr('display', (d, i) => i <= 1? 'none': 'block')
  .attr('transform', (d, i) => {
    const y = rectSize * Math.floor(i / 7);
    const x = rectSize * (i % 7);
    return 'translate(' + (x * multi) + ',' + (y * multi) + ')';
  });
  const circle =circleG.append('circle')
  .attr('cx', rectSize / 2 * multi)
  .attr('cy', rectSize / 2 * multi + 5 * multi)
  .attr('fill', d => {
    if (d.chihou8id) {
      const result = dc.dataset.find(value => Number(value.citycode) === Number(d.prefcode));
      if (result) return dc.colorScale(result.data)
    }
  });
  if (transitionFlg) {
    circle .transition()
    .delay((d, i) => 1000 + i * 40)
    .attr('r', 12 * multi)
  } else {
    circle.attr('r', 12 * multi)
  }
  const circleText = circleG.append('text')
  .attr('x', rectSize / 2 * multi)
  .attr('y', rectSize / 2 * multi + 10 * multi)
  .attr('text-anchor', 'middle')
  .attr('font-size', 10 * multi + 'px')
  .attr('fill', function (d) {
    const result = dc.dataset.find(value => Number(value.citycode) === Number(d.prefcode));
    if (result) {
      const rgb = d3.rgb(dc.colorScale(result.data));
      const cY = 0.3*rgb.r + 0.6*rgb.g + 0.1*rgb.b;
      return cY > 200? 'gray': 'white';
    }
  });
  if (transitionFlg) {
    circleText .transition()
    .delay((d, i) => 1000 + (i * 40))
    .text(d => {
      if (d.chihou8id) {
        const result = dc.dataset.find(value => Number(value.citycode) === Number(d.prefcode));
        if (result) return result.leftTop
      }
    })
  } else {
    circleText
    .text(d => {
      if (d.chihou8id) {
        const result = dc.dataset.find(value => Number(value.citycode) === Number(d.prefcode));
        if (result) return result.leftTop
      }
    })
  }
  // 表名-------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', (12 * multi) + 'px')
  .attr('transform', () => 'translate(5,' + (12 * multi + 5) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text(statName);
  //--------------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', () => 'translate(20,' + (12 * multi + 35) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text('8地方区分');
  // -------------------------------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    const dc = new DataCreate(JSON.parse(JSON.stringify(val.statData[value].data2)));
    dc.create();
    circle
    .attr('fill', d => {
      if (d.chihou8id) {
        const result = dc.dataset.find(value => Number(value.citycode) === Number(d.prefcode));
        if (result) return dc.colorScale(result.data)
      }
    });
    circleText
    .text(d => {
      if (d.chihou8id) {
        const result = dc.dataset.find(value => Number(value.citycode) === Number(d.prefcode));
        if (result) return result.leftTop
      }
    });
  };
  //--------------------------------------------------------------------------------------------
  const type = ie? 'change': 'input';
  Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
  eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-' + prefOrCity + ' .year-range'), type, (() => {
    return e => rangeInput(e)
  })(1), false);
}
