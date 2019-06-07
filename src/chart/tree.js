import store from "../store/store";
import * as Common from './common'
const eventkey = {};
// ---------------------------------------------------------------------------------------------
export default function (val, parentDiv) {
  const prefOrCity = parentDiv.split('-')[parentDiv.split('-').length -1 ];
  const palentDiv = d3.select(parentDiv);
  if(palentDiv.style('display') === 'none') return;
  let dataset;
  let statName;
  let unit;
  if (val.estat) {
    const target = val.statData[val.statData.length - 1];
    const allPrefData = target.data;
    dataset = target.data2;
    statName = val.statName;
    unit = allPrefData[0]['@unit'];
  } else {
    dataset = val.statData.data;
    statName = val.statData.title;
    unit = val.statData.unit;
  }
  // 大元のSVG領域の大きさを設定-------------------------------------------------------------
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  const multi = width / defaultWidth < 1.5? width / defaultWidth: 1.5;
  //トランジションフラグ----------------------------------------------------------------------------
  const transitionFlg  = store.state.statList.transition;
  // const transitionFlg = false
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset;
      this.root = null;
      this.fontScale = null;
    }
    create () {
      if (prefOrCity === 'pref') this.dataset.shift();
      // 圏域---------------------------------------------------------------------------------------
      let dataKeniki;
      const japanKeniki = {
        "children": [
          {
            "name": "北海道地方",
            "color": "orangered",
            "children": [
              { "name": "北海道"}
            ]
          },
          {
            "name": "東北地方",
            "color": "palevioletred",
            "children": [
              { "name": "青森県"}, { "name": "岩手県"},{ "name": "宮城県"}, { "name": "秋田県"},{ "name": "山形県"}, { "name": "福島県"}
            ]
          },
          {
            "name": "関東地方",
            "color": "lightsteelblue",
            "children": [
              { "name": "茨城県"}, { "name": "栃木県"},{ "name": "群馬県"}, { "name": "埼玉県"}, { "name": "千葉県"},{ "name": "東京都"}, { "name": "神奈川県"}
            ]
          },
          {
            "name": "中部地方",
            "color": "gold",
            "children": [
              { "name": "新潟県"}, { "name": "富山県"},{ "name": "石川県"}, { "name": "福井県"}, { "name": "山梨県"},{ "name": "長野県"}, { "name": "岐阜県"}, { "name": "静岡県"}, { "name": "愛知県"}
            ]
          },
          {
            "name": "近畿地方",
            "color": "mediumseagreen",
            "children": [
              { "name": "大阪府"}, { "name": "京都府"},{ "name": "兵庫県"}, { "name": "奈良県"}, { "name": "三重県"},{ "name": "滋賀県"}, { "name": "和歌山県"}
            ]
          },
          {
            "name": "中国・四国地方",
            "color": "olive",
            "children": [
              { "name": "鳥取県"}, { "name": "島根県"},{ "name": "岡山県"}, { "name": "広島県"}, { "name": "山口県"},{ "name": "徳島県"}, { "name": "香川県"}, { "name": "愛媛県"}, { "name": "高知県"}
            ]
          },
          {
            "name": "九州・沖縄地方",
            "color": "royalblue",
            "children": [
              { "name": "福岡県"}, { "name": "佐賀県"}, { "name": "長崎県"}, { "name": "熊本県"}, { "name": "大分県"},
              { "name": "宮崎県"}, { "name": "鹿児島県"}, { "name": "沖縄県"}
            ]
          }
        ]
      };
      const miyazakiKeniki = {
        "children": [
          {
            "name": "宮崎東諸県圏域",
            "color": "orangered",
            "children": [
              { "name": "宮崎市"}, { "name": "国富町"}, { "name": "綾町"}
            ]
          },
          {
            "name": "日南・串間圏域",
            "color": "palevioletred",
            "children": [
              { "name": "日南市"}, { "name": "串間市"}
            ]
          },
          {
            "name": "都城北諸県圏域",
            "color": "gold",
            "children": [
              { "name": "都城市"}, { "name": "三股町"}
            ]
          },
          {
            "name": "西諸県圏域",
            "color": "mediumseagreen",
            "children": [
              { "name": "小林市"}, { "name": "えびの市"}, { "name": "高原町"}
            ]
          },
          {
            "name": "西都児湯圏域",
            "color": "olive",
            "children": [
              { "name": "西都市"}, { "name": "高鍋町"}, { "name": "新富町"}, { "name": "西米良村"},
              { "name": "木城町"}, { "name": "川南町"}, { "name": "都農町"}
            ]
          },
          {
            "name": "宮崎県北部圏域",
            "color": "royalblue",
            "children": [
              { "name": "延岡市"}, { "name": "日向市"}, { "name": "門川町"}, { "name": "諸塚村"}, { "name": "椎葉村"},
              { "name": "美郷町"}, { "name": "高千穂町"}, { "name": "日之影町"}, { "name": "五ヶ瀬町"}
            ]
          }
        ]
      };

      if (val.estat) {
        dataKeniki = japanKeniki;
        for (let i in this.dataset) {
          let result, result2;
          switch(this.dataset[i].cityname) {
            case '北海道':
              result = dataKeniki.children.find((value) => value.name === '北海道地方');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '青森県':case '岩手県':case '宮城県':case '秋田県':case '山形県':case '福島県':
              result = dataKeniki.children.find((value) => value.name === '東北地方');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '茨城県':case '栃木県':case '群馬県':case '埼玉県':case '千葉県':case '東京都':case '神奈川県':
              result = dataKeniki.children.find((value) => value.name === '関東地方');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '新潟県':case '富山県':case '石川県':case '福井県':case '山梨県':case '長野県':case '岐阜県':case '静岡県':case '愛知県':
              result = dataKeniki.children.find((value) => value.name === '中部地方');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '大阪府':case '京都府':case '兵庫県':case '奈良県':case '三重県':case '滋賀県':case '和歌山県':
              result = dataKeniki.children.find((value) => value.name === '近畿地方');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '鳥取県':case '島根県':case '岡山県':case '広島県':case '山口県':case '徳島県':case '香川県':case '愛媛県':case '高知県':
              result = dataKeniki.children.find((value) => value.name === '中国・四国地方');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '福岡県':case '佐賀県':case '長崎県':case '熊本県':case '大分県':case '宮崎県':case '鹿児島県':case '沖縄県':
              result = dataKeniki.children.find((value) => value.name === '九州・沖縄地方');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
          }
        }
      }  else {
        dataKeniki = miyazakiKeniki;
        for (let i in this.dataset) {
          let result, result2;
          switch(this.dataset[i].cityname) {
            case '宮崎市':case '国富町':case '綾町':
              result = dataKeniki.children.find((value) => value.name === '宮崎東諸県圏域');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '日南市':case '串間市':
              result = dataKeniki.children.find((value) => value.name === '日南・串間圏域');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '都城市':case '三股町':
              result = dataKeniki.children.find((value) => value.name === '都城北諸県圏域');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '小林市':case 'えびの市':case '高原町':
              result = dataKeniki.children.find((value) => value.name === '西諸県圏域');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '西都市':case '高鍋町':case '新富町':case '西米良村':case '木城町':case '川南町':case '都農町':
              result = dataKeniki.children.find((value) => value.name === '西都児湯圏域');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
            case '延岡市':case '日向市':case '門川町':case '諸塚村':case '椎葉村':case '美郷町':case '高千穂町':case '日之影町':case '五ヶ瀬町':
              result = dataKeniki.children.find((value) => value.name === '宮崎県北部圏域');
              result2 = result.children.find((value) => value.name === this.dataset[i].cityname);
              result2.value = this.dataset[i].data;
              break;
          }
        }
      }
      // 描画用のデータ変換---------------------------------------------------------------------
      this.root = d3.hierarchy(dataKeniki);
      this.root
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
      // フォントスケール--------------------------------------------------------------------------
      const maxVal = d3.max(this.dataset, d => d.data);
      const minVal = d3.min(this.dataset, d => d.data);
      this.fontScale = d3.scaleLinear()
      .domain([minVal, maxVal])
      .range([6 * multi, 20 * multi]);
    }
  }
  //--------------------------------------------------------------------------------------------
  let dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  // --------------------------------------------------------------------------------------------
  const treemap = d3.treemap()
  .size([width-20, height-40])// ツリーマップ全体の大きさ
  .padding(0)
  // .paddingOuter(2)
  .round(true);
  treemap(dc.root);
  // SVG領域作成---------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', '0 0 '+ width + ' '  + height)
  .attr('preserveAspectRatio', 'xMidYMid')
  .classed("svg-content-responsive", true)
  .classed("chart-svg", true);
  // ツリーマップ--------------------------------------------------------------------------------
  const tip = d3Tip().attr('class', 'd3-tip').html(d => d);
  svg.call(tip);
  const treeSvg = svg.append('g')
  .attr('class', 'svg')
  .selectAll('.node')
  .data(dc.root.leaves())
  .enter()
  .append('g')
  .attr('class', 'node')
  .attr('transform', d =>'translate(' + (d.x0 + 10 * multi) + ',' + (d.y0 + 30) + ')')
  .attr('fill', 'black')
  .on('mouseover', function (d) {
    const value = d.data.value;
    const keinikiTotal = d.parent.value;
    const total = d.parent.parent.value;
    const ritu0 = Math.floor(keinikiTotal / total*1000)/10 + '%';
    const ritu1 = Math.floor(value / total*1000)/10 + '%';
    return tip.show(d.parent.data.name + '計 = ' + ritu0 + '<br>' +d.data.name + ' = ' + ritu1 + '<br>' + value + unit,this)
  })
  .on('mouseout', tip.hide);
  // ブロック作成------------------------------------------------------------------------------
  const rect = treeSvg.append('rect')
  .attr('width', 0)
  .attr('height', 0)
  .attr('stroke', 'black')
  .attr('stroke-width', '0.3px')
  .attr('fill', d => {
    while(d.depth > 1) d = d.parent;
    return d.data.color;
  });
  if (transitionFlg) {
    rect.transition()
    .delay((d,i) => i * 15)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
  } else {
     rect.attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
  }
  // ブロックのテキスト
  const text = treeSvg.append('text')
  .attr('text-anchor', 'start')
  .attr('x', 2)
  .attr('dy', d => dc.fontScale(d.data.value))
  .attr('font-size', d => dc.fontScale(d.data.value))
  .attr('class', 'node-label')
  .text(d => d.data.name)
  // .attr('fill', 'white')
  .attr('opacity', 0);
  if (transitionFlg) {
    text.transition()
    .delay((d,i) => i* 10)
    .attr('opacity', 1);
  } else {
    text.attr('opacity', 1);
  }
  // 表名-------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', () => 'translate(5,' + (12 * multi + 5)  + ')')
  .attr('class' ,'no-print')
  .append('text')
  .text(statName);
  //--------------------------------------------------------------------------------------------
  dc = null;
  // -------------------------------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    // let dc = new DataCreate(val.statData[value].data2);
    let dc = new DataCreate(JSON.parse(JSON.stringify(val.statData[value].data2)));
    dc.create();
    treemap(dc.root);
    treeSvg
    .data(dc.root.leaves())
    .transition()
    .duration(500)
    .attr('transform', d =>'translate(' + (d.x0 + 10 * multi) + ',' + (d.y0 + 30) + ')');
    rect
    .data(dc.root.leaves())
    .transition()
    .duration(500)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => {
      while(d.depth > 1) d = d.parent;
      return d.data.color;
    });
    text
    .data(dc.root.leaves())
    .attr('x', 2)
    .attr('dy', d => dc.fontScale(d.data.value))
    .attr('font-size', d => dc.fontScale(d.data.value))
    .attr('class', 'node-label')
    .text(d => d.data.name);
    dc = null
  };
  //-------------------------------------------------------------------------------------------
  const type = ie? 'change': 'input';
  Common.eventAddRemove.removeListener(eventkey[prefOrCity]);
  eventkey[prefOrCity] = Common.eventAddRemove.addListener(document.querySelector('#year-range-' + prefOrCity), type, (() => {
    return e => {
      rangeInput(e)
    }
  })(1), false);
}
