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
  const width = palentDiv.node().getBoundingClientRect().width;
  const height = palentDiv.node().getBoundingClientRect().height
    - palentDiv.select('.chart-div-handle').node().getBoundingClientRect().height;
  const defaultWidth = 300;
  const multi = width / defaultWidth < 1.5 ? width / defaultWidth : 1.5;
  //トランジションフラグ----------------------------------------------------------------------------
  const isTransition = storeBase.state.statList.transition;
  // データ等を作るクラス-------------------------------------------------------------------------
  class DataCreate {
    constructor (dataset) {
      this.dataset = dataset;
      this.root = null;
      this.fontScale = null;
      this.isDraw = true
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
              { "name": "北海道", "citycode": "01000"}
            ]
          },
          {
            "name": "東北地方",
            "color": "palevioletred",
            "children": [
              { "name": "青森県", "citycode": "02000"}, { "name": "岩手県", "citycode": "03000"}, { "name": "宮城県", "citycode": "04000"}, { "name": "秋田県", "citycode": "05000"}, { "name": "山形県", "citycode": "6000"}, { "name": "福島県", "citycode": "07000"}
            ]
          },
          {
            "name": "関東地方",
            "color": "lightsteelblue",
            "children": [
              { "name": "茨城県", "citycode": "08000"}, { "name": "栃木県", "citycode": "09000"}, { "name": "群馬県", "citycode": "10000"}, { "name": "埼玉県", "citycode": "11000"}, { "name": "千葉県", "citycode": "12000"}, { "name": "東京都", "citycode": "13000"}, { "name": "神奈川県", "citycode": "14000"}
            ]
          },
          {
            "name": "中部地方",
            "color": "gold",
            "children": [
              { "name": "新潟県", "citycode": "15000"}, { "name": "富山県", "citycode": "16000"}, { "name": "石川県", "citycode": "17000"}, { "name": "福井県", "citycode": "18000"}, { "name": "山梨県", "citycode": "19000"}, { "name": "長野県", "citycode": "20000"}, { "name": "岐阜県", "citycode": "21000"}, { "name": "静岡県", "citycode": "22000"}, { "name": "愛知県", "citycode": "23000"}
            ]
          },
          {
            "name": "近畿地方",
            "color": "mediumseagreen",
            "children": [
              { "name": "大阪府", "citycode": "27000"}, { "name": "京都府", "citycode": "26000"}, { "name": "兵庫県", "citycode": "28000"}, { "name": "奈良県", "citycode": "29000"}, { "name": "三重県", "citycode": "24000"}, { "name": "滋賀県", "citycode": "25000"}, { "name": "和歌山県", "citycode": "30000"}
            ]
          },
          {
            "name": "中国・四国地方",
            "color": "olive",
            "children": [
              { "name": "鳥取県", "citycode": "31000"}, { "name": "島根県", "citycode": "32000"}, { "name": "岡山県", "citycode": "33000"}, { "name": "広島県", "citycode": "34000"}, { "name": "山口県", "citycode": "35000"}, { "name": "徳島県", "citycode": "36000"}, { "name": "香川県", "citycode": "37000"}, { "name": "愛媛県", "citycode": "38000"}, { "name": "高知県", "citycode": "39000"}
            ]
          },
          {
            "name": "九州・沖縄地方",
            "color": "royalblue",
            "children": [
              { "name": "福岡県", "citycode": "40000"}, { "name": "佐賀県", "citycode": "41000"}, { "name": "長崎県", "citycode": "42000"}, { "name": "熊本県", "citycode": "43000"}, { "name": "大分県", "citycode": "44000"},
              { "name": "宮崎県", "citycode": "45000"}, { "name": "鹿児島県", "citycode": "46000"}, { "name": "沖縄県", "citycode": "47000"}
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
              { "name": "宮崎市", "citycode": "45201"}, { "name": "国富町", "citycode": "45382"}, { "name": "綾町", "citycode": "45383"}
            ]
          },
          {
            "name": "日南・串間圏域",
            "color": "palevioletred",
            "children": [
              { "name": "日南市", "citycode": "45204"}, { "name": "串間市", "citycode": "45207"}
            ]
          },
          {
            "name": "都城北諸県圏域",
            "color": "gold",
            "children": [
              { "name": "都城市", "citycode": "45202"}, { "name": "三股町", "citycode": "45341"}
            ]
          },
          {
            "name": "西諸県圏域",
            "color": "mediumseagreen",
            "children": [
              { "name": "小林市", "citycode": "45205"}, { "name": "えびの市", "citycode": "45209"}, { "name": "高原町", "citycode": "45361"}
            ]
          },
          {
            "name": "西都児湯圏域",
            "color": "olive",
            "children": [
              { "name": "西都市", "citycode": "45208"}, { "name": "高鍋町", "citycode": "45401"}, { "name": "新富町", "citycode": "45402"}, { "name": "西米良村", "citycode": "45403"},
              { "name": "木城町", "citycode": "45404"}, { "name": "川南町", "citycode": "45405"}, { "name": "都農町", "citycode": "45406"}
            ]
          },
          {
            "name": "宮崎県北部圏域",
            "color": "royalblue",
            "children": [
              { "name": "延岡市", "citycode": "45203"}, { "name": "日向市", "citycode": "45206"}, { "name": "門川町", "citycode": "45421"}, { "name": "諸塚村", "citycode": "45429"}, { "name": "椎葉村", "citycode": "45430"},
              { "name": "美郷町", "citycode": "45431"}, { "name": "高千穂町", "citycode": "45441"}, { "name": "日之影町", "citycode": "45442"}, { "name": "五ヶ瀬町", "citycode": "45443"}
            ]
          }
        ]
      };

      if (prefOrCity === 'pref') {
        dataKeniki = japanKeniki;
        this.dataset.forEach(value => {
          let result, result2;
          switch(value.cityname) {
            case '北海道':
              result = dataKeniki.children.find(val => val.name === '北海道地方');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '青森県':case '岩手県':case '宮城県':case '秋田県':case '山形県':case '福島県':
              result = dataKeniki.children.find(val => val.name === '東北地方');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '茨城県':case '栃木県':case '群馬県':case '埼玉県':case '千葉県':case '東京都':case '神奈川県':
              result = dataKeniki.children.find(val => val.name === '関東地方');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '新潟県':case '富山県':case '石川県':case '福井県':case '山梨県':case '長野県':case '岐阜県':case '静岡県':case '愛知県':
              result = dataKeniki.children.find(val => val.name === '中部地方');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '大阪府':case '京都府':case '兵庫県':case '奈良県':case '三重県':case '滋賀県':case '和歌山県':
              result = dataKeniki.children.find(val => val.name === '近畿地方');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '鳥取県':case '島根県':case '岡山県':case '広島県':case '山口県':case '徳島県':case '香川県':case '愛媛県':case '高知県':
              result = dataKeniki.children.find(val => val.name === '中国・四国地方');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '福岡県':case '佐賀県':case '長崎県':case '熊本県':case '大分県':case '宮崎県':case '鹿児島県':case '沖縄県':
              result = dataKeniki.children.find(val => val.name === '九州・沖縄地方');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
          }
        });
      } else if (String(this.dataset[0].citycode) === '45201') {
        dataKeniki = miyazakiKeniki;
        this.dataset.forEach(value => {
          let result, result2;
          switch (value.cityname) {
            case '宮崎市':
            case '国富町':
            case '綾町':
              result = dataKeniki.children.find(val => val.name === '宮崎東諸県圏域');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '日南市':
            case '串間市':
              result = dataKeniki.children.find(value => value.name === '日南・串間圏域');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '都城市':
            case '三股町':
              result = dataKeniki.children.find(val => val.name === '都城北諸県圏域');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '小林市':
            case 'えびの市':
            case '高原町':
              result = dataKeniki.children.find(val => val.name === '西諸県圏域');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '西都市':
            case '高鍋町':
            case '新富町':
            case '西米良村':
            case '木城町':
            case '川南町':
            case '都農町':
              result = dataKeniki.children.find(val => val.name === '西都児湯圏域');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
            case '延岡市':
            case '日向市':
            case '門川町':
            case '諸塚村':
            case '椎葉村':
            case '美郷町':
            case '高千穂町':
            case '日之影町':
            case '五ヶ瀬町':
              result = dataKeniki.children.find(val => val.name === '宮崎県北部圏域');
              result2 = result.children.find(val => val.name === value.cityname);
              result2.value = value.data;
              break;
          }
        });
      } else {
        palentDiv.select('.chart-svg').remove();
        this.isDraw = false;
        return
      }
      // 描画用のデータ変換---------------------------------------------------------------------
      this.root = d3.hierarchy(dataKeniki);
      this.root
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);
      // フォントスケール--------------------------------------------------------------------------
      const maxVal = d3.max(this.dataset, d => d.data);
      const minVal = d3.min(this.dataset, d => d.data);
      this.fontScale = d3.scaleLinear()
      .domain([minVal, maxVal])
      .range([6 * multi, 20 * multi]);
    }
  }
  //--------------------------------------------------------------------------------------------
  const dc = new DataCreate(JSON.parse(JSON.stringify(dataset)));
  dc.create();
  if (!dc.isDraw) return;
  // --------------------------------------------------------------------------------------------
  const treemap = d3.treemap()
  .size([width - 20, height - 40])// ツリーマップ全体の大きさ
  .padding(0)
  // .paddingOuter(2)
  .round(true);
  treemap(dc.root);
  // SVG領域作成---------------------------------------------------------------------------
  palentDiv.select('.chart-svg').remove();
  const svg = palentDiv.select('.resizers').append('svg')
  .attr('width', width)
  .attr('height', height)
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
  .attr('transform', d => 'translate(' + (d.x0 + 10 * multi) + ',' + (d.y0 + 30) + ')')
  .attr('fill', 'black')
  .on('mouseover', function (d) {
    const value = d.data.value;
    const keinikiTotal = d.parent.value;
    const total = d.parent.parent.value;
    const ritu0 = Math.floor(keinikiTotal / total * 1000) / 10 + '%';
    const ritu1 = Math.floor(value / total * 1000) / 10 + '%';
    return tip.show(`${d.parent.data.name}計 = ${ritu0}<br>${d.data.name} = ${ritu1}<br>${value}${unit}`, this)
  })
  .on('mouseout', tip.hide);
  // ブロック作成------------------------------------------------------------------------------
  const rect = treeSvg.append('rect')
  .attr('class', 'tree-rect-' + prefOrCity)
  .attr('width', 0)
  .attr('height', 0)
  .attr('stroke', 'black')
  .attr('stroke-width', '0.3px')
  .attr('fill', d => {
    if (String(d.data.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity])) return 'orange';
    while(d.depth > 1) d = d.parent;
    return d.data.color;
  });
  rect.transition()
  .duration(() => isTransition ? 100 : 0)
  .delay((d, i) => isTransition ? i * 20 : 0)
  .attr('width', d => d.x1 - d.x0)
  .attr('height', d => d.y1 - d.y0);
  // ブロックのテキスト
  const text = treeSvg.append('text')
  .attr('text-anchor', 'start')
  .attr('x', 2)
  .attr('dy', d => dc.fontScale(d.data.value))
  .attr('font-size', d => dc.fontScale(d.data.value))
  .attr('class', 'node-label')
  .text(d => d.data.name);
  text
  .attr('opacity', 0)
  .transition()
  .duration(() => isTransition ? 100 : 0)
  .delay((d, i) => isTransition ? i * 20 : 0)
  .attr('opacity', 1);
  // クリックでカレントに色を塗る-------------------------------------------------------------------
  rect
  .on('click', function (d) {
    // 実際の色塗りはwatch.jsで塗っている。
    const payload = {
      citycode: d3.select(this).attr('fill') === 'orange' ? '' : d.data.citycode,
      prefOrCity: prefOrCity
    };
    storeBase.commit('base/targetCitycodeChange', payload);
  });
  // 表名-------------------------------------------------------------------------------------
  svg.append('g')
  .attr('font-size', 12 * multi + 'px')
  .attr('transform', () => 'translate(5,' + (12 * multi + 5) + ')')
  .attr('class', 'no-print')
  .append('text')
  .text(statName);
  // -------------------------------------------------------------------------------------------
  const rangeInput = e => {
    const value = Number(e.target.value);
    const dc = new DataCreate(JSON.parse(JSON.stringify(val.statData[value].data2)));
    dc.create();
    treemap(dc.root);
    treeSvg
    .data(dc.root.leaves())
    .transition()
    .duration(500)
    .attr('transform', d => 'translate(' + (d.x0 + 10 * multi) + ',' + (d.y0 + 30) + ')');
    rect
    .data(dc.root.leaves())
    .transition()
    .duration(500)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => {
      if (String(d.data.citycode) === String(storeBase.state.base.targetCitycode[prefOrCity])) return 'orange';
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
