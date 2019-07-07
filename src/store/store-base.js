import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import statList from './store-statlist'
Vue.use(Vuex);
const Div = [
  {order: 100, statType: 'miyazakiCity', divId: 'bar-miyazaki-city', class: 'large1-chart-div', name: '棒グラフ', show: true, rightSide: false},
  {order: 101, statType: 'miyazakiCity', divId: 'box-miyazaki-city', class: 'normal-chart-div', name: '箱ひげ図', show: true, rightSide: false},
  {order: 102, statType: 'miyazakiCity', divId: 'rank-miyazaki-city', class: 'normal-chart-div', name: 'ランキング', show: true, rightSide: false},
  {order: 103, statType: 'miyazakiCity', divId: 'bubble-miyazaki-city', class: 'normal-chart-div', name: 'バブル', show: true, rightSide: false},
  {order: 104, statType: 'miyazakiCity', divId: 'map-miyazaki-city', class: 'normal-chart-div', name: '地図', show: true, rightSide: false},
  {order: 105, statType: 'miyazakiCity', divId: 'pie-miyazaki-city', class: 'normal-chart-div', name: '円グラフ', show: true, rightSide: false},
  {order: 106, statType: 'miyazakiCity', divId: 'tree-miyazaki-city', class: 'normal-chart-div', name: 'ツリーマップ', show: true, rightSide: false},
  {order: 107, statType: 'miyazakiCity', divId: 'histogram-miyazaki-city', class: 'normal-chart-div', name: 'ヒストグラム', show: true, rightSide: false},

  {order: 200, statType: 'city', divId: 'bar-city', class: 'large1-chart-div', name: '棒グラフ', show: false, rightSide: false},
  {order: 201, statType: 'city', divId: 'box-city', class: 'normal-chart-div', name: '箱ひげ図', show: false, rightSide: false},
  {order: 202, statType: 'city', divId: 'rank-city', class: 'normal-chart-div', name: 'ランキング', show: false, rightSide: false},
  {order: 203, statType: 'city', divId: 'bubble-city', class: 'normal-chart-div', name: 'バブル', show: false, rightSide: false},
  {order: 204, statType: 'city', divId: 'map-city', class: 'normal-chart-div', name: '地図', show: false, rightSide: false},
  {order: 205, statType: 'city', divId: 'pie-city', class: 'normal-chart-div', name: '円グラフ', show: false, rightSide: false},
  {order: 206, statType: 'city', divId: 'histogram-city', class: 'normal-chart-div', name: 'ヒストグラム', show: false, rightSide: false},
  {order: 207, divId: 'scatterCity', class: 'large3-chart-div', name: '散布図 e-Stat(社会・人口統計体系)2', contents: '左右から選択してください。', show: false, rightSide: true},
  {order: 208, statType: 'city', divId: 'time-city', class: 'large1-chart-div', name: '時系列', show: false, rightSide: false},

  {order: 300, statType: 'pref', divId: 'bar-pref', class: 'large1-chart-div', name: '棒グラフ', show: false, rightSide: false},
  {order: 301, statType: 'pref', divId: 'box-pref', class: 'normal-chart-div', name: '箱ひげ図', show: false, rightSide: false},
  {order: 302, statType: 'pref', divId: 'rank-pref', class: 'normal-chart-div', name: 'ランキング', show: false, rightSide: false},
  {order: 303, statType: 'pref', divId: 'bubble-pref', class: 'normal-chart-div', name: 'バブル', show: false, rightSide: false},
  {order: 304, statType: 'pref', divId: 'map-pref', class: 'normal-chart-div', name: '地図', show: false, rightSide: false},
  {order: 305, statType: 'pref', divId: 'map77-pref', class: 'normal-chart-div', name: 'カラム地図', show: false, rightSide: false},
  {order: 306, statType: 'pref', divId: 'pie-pref', class: 'normal-chart-div', name: '円グラフ', show: false, rightSide: false},
  {order: 307, statType: 'pref', divId: 'tree-pref', class: 'normal-chart-div', name: 'ツリーマップ', show: false, rightSide: false},
  {order: 308, statType: 'pref', divId: 'histogram-pref', class: 'normal-chart-div', name: 'ヒストグラム', show: false, rightSide: false},
  {order: 309, statType: 'pref', divId: 'time-pref', class: 'large1-chart-div', name: '時系列', show: false, rightSide: false},

  {order: 401, divId: 'time', class: 'large2-chart-div', name: '宮崎県時系列', show: false, rightSide: false},
  {order: 402, divId: 'timePref', class: 'large2-chart-div', name: '都道府県時系列', show: false, rightSide: false},
  {order: 403, divId: 'timeCity', class: 'large2-chart-div', name: '市町村時系列', show: false, rightSide: false},
  {order: 404, divId: 'scatter', class: 'large2-chart-div', name: '散布図', contents: '左右から選択してください。', show: false, rightSide: true},
  {order: 405, divId: 'scatterPref', class: 'large3-chart-div', name: '散布図 e-Stat(社会・人口統計体系)', contents: '左右から選択してください。', show: false, rightSide: true}
];
const base = {
  namespaced: true,
  state: {
    targetCitycode: '',
    rightSideDivShow: false,
    menuChange: true,
    leftDivList: Div,
    rightDivList: Div,
    activeIndex: 'miyazakiCity',
    statType: 'miyazakiCity',
    dialog: {
      visible: false,
      target: ''
    },
    chartDivLoading: false,
    prefCode: '45000',
    barSort: 'original',
    prefOptions: [{
      value: '00000',
      label: '全国',
      chihou8id: {order: 0, chiku: '', stroke: ''},
    }, {
      value: '01000',
      label: '北海道',
      chihou8id: {order: 4, chiku: 'hokkaidou', stroke: 'tblr'},
    }, {
      value: '02000',
      label: '青森県',
      chihou8id: {order: 3, chiku: 'touhoku', stroke: 'tlr'},
    }, {
      value: '03000',
      label: '岩手県',
      chihou8id: {order: 11, chiku: 'touhoku', stroke: 'tr'}
      }, {
      value: '04000',
      label: '宮城県',
      chihou8id: {order: 18, chiku: 'touhoku', stroke: 'r'}
    }, {
      value: '05000',
      label: '秋田県',
      chihou8id: {order: 10, chiku: 'touhoku', stroke: 'l'}
      }, {
      value: '06000',
      label: '山形県',
      chihou8id: {order: 17, chiku: 'touhoku', stroke: 'bl'}
      }, {
      value: '07000',
      label: '福島県',
      chihou8id: {order: 25, chiku: 'touhoku', stroke: 'blr'}
      }, {
      value: '08000',
      label: '茨城県',
      chihou8id: {order: 39, chiku: 'kantou', stroke: 'r'}
    }, {
      value: '09000',
      label: '栃木県',
      chihou8id: {order: 32, chiku: 'kantou', stroke: 'tr'}
    }, {
      value: '10000',
      label: '群馬県',
      chihou8id: {order: 24, chiku: 'kantou', stroke: 'tlr'}
      }, {
      value: '11000',
      label: '埼玉県',
      chihou8id: {order: 31, chiku: 'kantou', stroke: 'l'}
      }, {
      value: '12000',
      label: '千葉県',
      chihou8id: {order: 46, chiku: 'kantou', stroke: 'br'}
    }, {
      value: '13000',
      label: '東京都',
      chihou8id: {order: 38, chiku: 'kantou', stroke: 'l'}
      }, {
      value: '14000',
      label: '神奈川県',
      chihou8id: {order: 45, chiku: 'kantou', stroke: 'bl'}
    }, {
      value: '15000',
      label: '新潟県',
      chihou8id: {order: 9, chiku: 'cyuubu', stroke: 'r'},
    }, {
      value: '16000',
      label: '富山県',
      chihou8id: {order: 2, chiku: 'cyuubu', stroke: 'tr'},
    }, {
      value: '17000',
      label: '石川県',
      chihou8id: {order: 1, chiku: 'cyuubu', stroke: 'tl'},
    }, {
      value: '18000',
      label: '福井県',
      chihou8id: {order: 8, chiku: 'cyuubu', stroke: 'bl'},
    }, {
      value: '19000',
      label: '山梨県',
      chihou8id: {order: 23, chiku: 'cyuubu', stroke: 'lr'}
    }, {
      value: '20000',
      label: '長野県',
      chihou8id: {order: 16, chiku: 'cyuubu', stroke: 'lr'}
      }, {
      value: '21000',
      label: '岐阜県',
      chihou8id: {order: 30, chiku: 'cyuubu', stroke: 'lr'}
      }, {
      value: '22000',
      label: '静岡県',
      chihou8id: {order: 37, chiku: 'cyuubu', stroke: 'lr'}
      }, {
      value: '23000',
      label: '愛知県',
      chihou8id: {order: 44, chiku: 'cyuubu', stroke: 'blr'}
    }, {
      value: '24000',
      label: '三重県',
      chihou8id: {order: 43, chiku: 'kinki', stroke: 'blr'}
    }, {
      value: '25000',
      label: '滋賀県',
      chihou8id: {order: 15, chiku: 'kinki', stroke: 'tlr'}
      }, {
      value: '26000',
      label: '京都府',
      chihou8id: {order: 22, chiku: 'kinki', stroke: 'r'}
      }, {
      value: '27000',
      label: '大阪府',
      chihou8id: {order: 28, chiku: 'kinki', stroke: 'bl'}
    }, {
      value: '28000',
      label: '兵庫県',
      chihou8id: {order: 21, chiku: 'kinki', stroke: 'tl'}
      }, {
      value: '29000',
      label: '奈良県',
      chihou8id: {order: 29, chiku: 'kinki', stroke: 'r'}
      }, {
      value: '30000',
      label: '和歌山県',
      chihou8id: {order: 36, chiku: 'kinki', stroke: 'lr'}
    }, {
      value: '31000',
      label: '鳥取県',
      chihou8id: {order: 0, chiku: 'cyuugoku', stroke: 'tlr'},
    }, {
      value: '32000',
      label: '島根県',
      chihou8id: {order: 6, chiku: 'cyuugoku', stroke: 'tb'},
    }, {
      value: '33000',
      label: '岡山県',
      chihou8id: {order: 7, chiku: 'cyuugoku', stroke: 'r'},
    }, {
      value: '34000',
      label: '広島県',
      chihou8id: {order: 14, chiku: 'cyuugoku', stroke: 'blr'}
    }, {
      value: '35000',
      label: '山口県',
      chihou8id: {order: 5, chiku: 'cyuugoku', stroke: 'tbl'},
    }, {
      value: '36000',
      label: '徳島県',
      chihou8id: {order: 42, chiku: '4koku', stroke: 'br'}
    }, {
      value: '37000',
      label: '香川県',
      chihou8id: {order: 35, chiku: '4koku', stroke: 'tr'}
    }, {
      value: '38000',
      label: '愛媛県',
      chihou8id: {order: 34, chiku: '4koku', stroke: 'tl'}
      }, {
      value: '39000',
      label: '高知県',
      chihou8id: {order: 41, chiku: '4koku', stroke: 'bl'}
    }, {
      value: '40000',
      label: '福岡県',
      chihou8id: {order: 13, chiku: '9syuuokinawa', stroke: 'tr'}
      }, {
      value: '41000',
      label: '佐賀県',
      chihou8id: {order: 19, chiku: '9syuuokinawa', stroke: 'l'}
    }, {
      value: '42000',
      label: '長崎県',
      chihou8id: {order: 12, chiku: '9syuuokinawa', stroke: 'tl'}
      }, {
      value: '43000',
      label: '熊本県',
      chihou8id: {order: 26, chiku: '9syuuokinawa', stroke: 'l'}
    }, {
      value: '44000',
      label: '大分県',
      chihou8id: {order: 20, chiku: '9syuuokinawa', stroke: 'r'}
      }, {
      value: '45000',
      label: '宮崎県',
      chihou8id: {order: 27, chiku: '9syuuokinawa', stroke: 'br'}
      }, {
      value: '46000',
      label: '鹿児島県',
      chihou8id: {order: 33, chiku: '9syuuokinawa', stroke: 'lr'}
      }, {
      value: '47000',
      label: '沖縄県',
      chihou8id: {order: 40, chiku: '9syuuokinawa', stroke: 'blr'}
    }, ],
  },
  mutations: {
    targetCitycodeChange (state, payload) {
      state.targetCitycode = payload
    },
    barSortChange (state, payload) {
      state.barSort = payload
    },
    rightSideDivShowChange (state, payload) {
      state.rightSideDivShow = payload
    },
    menuChange (state, payload) {
      state.menuChange = payload
    },
    leftDivListChange (state, payload) {
      state.leftDivList = payload
    },
    activeIndexChange (state, payload) {
      state.activeIndex = payload
    },
    statTypeChange (state, payload) {
      state.statType = payload
    },
    dialogVisibleChange (state, payload) {
      state.dialog.visible = payload.visible;
      state.dialog.target = payload.target;
    },
    chartDivLoadingShow (state, payload) {
      state.chartDivLoading = payload
    },
    prefCodeChange (state, payload) {
        state.prefCode = payload
    },
  }
};
const storeBase = new Vuex.Store({
  modules: {
    base: base,
    statList: statList
  }
});
export default storeBase
