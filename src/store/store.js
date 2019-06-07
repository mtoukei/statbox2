import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import statList from './store-statlist'
Vue.use(Vuex);
const base = {
  namespaced: true,
  state: {
    // dialogVisible: false,
    dialog:{
      visible:false,
      target:''
    },
    chartDivLoading: false,
    prefCode: '45000',
    prefOptions: [{
      value: '00000',
      label: '全国',
      chihou8id: {order:0, chiku: '', stroke: ''},
    }, {
      value: '01000',
      label: '北海道',
      chihou8id: {order:4, chiku: 'hokkaidou', stroke: 'tblr'},
    }, {
      value: '02000',
      label: '青森県',
      chihou8id: {order:3, chiku: 'touhoku', stroke: 'tlr'},
    }, {
      value: '03000',
      label: '岩手県',
      chihou8id: {order:11, chiku: 'touhoku', stroke: 'tr'}
      }, {
      value: '04000',
      label: '宮城県',
      chihou8id: {order:18, chiku: 'touhoku', stroke: 'r'}
    }, {
      value: '05000',
      label: '秋田県',
      chihou8id: {order:10, chiku: 'touhoku', stroke: 'l'}
      }, {
      value: '06000',
      label: '山形県',
      chihou8id: {order:17, chiku: 'touhoku', stroke: 'bl'}
      }, {
      value: '07000',
      label: '福島県',
      chihou8id: {order:25, chiku: 'touhoku', stroke: 'blr'}
      }, {
      value: '08000',
      label: '茨城県',
      chihou8id: {order:39, chiku: 'kantou', stroke: 'r'}
    }, {
      value: '09000',
      label: '栃木県',
      chihou8id: {order:32, chiku: 'kantou', stroke: 'tr'}
    }, {
      value: '10000',
      label: '群馬県',
      chihou8id: {order:24, chiku: 'kantou', stroke: 'tlr'}
      }, {
      value: '11000',
      label: '埼玉県',
      chihou8id: {order:31, chiku: 'kantou', stroke: 'l'}
      }, {
      value: '12000',
      label: '千葉県',
      chihou8id: {order:46, chiku: 'kantou', stroke: 'br'}
    }, {
      value: '13000',
      label: '東京都',
      chihou8id: {order:38, chiku: 'kantou', stroke: 'l'}
      }, {
      value: '14000',
      label: '神奈川県',
      chihou8id: {order:45, chiku: 'kantou', stroke: 'bl'}
    }, {
      value: '15000',
      label: '新潟県',
      chihou8id: {order:9, chiku: 'cyuubu', stroke: 'r'},
    }, {
      value: '16000',
      label: '富山県',
      chihou8id: {order:2, chiku: 'cyuubu', stroke: 'tr'},
    }, {
      value: '17000',
      label: '石川県',
      chihou8id: {order:1, chiku: 'cyuubu', stroke: 'tl'},
    }, {
      value: '18000',
      label: '福井県',
      chihou8id: {order:8, chiku: 'cyuubu', stroke: 'bl'},
    }, {
      value: '19000',
      label: '山梨県',
      chihou8id: {order:23, chiku: 'cyuubu', stroke: 'lr'}
    }, {
      value: '20000',
      label: '長野県',
      chihou8id: {order:16, chiku: 'cyuubu', stroke: 'lr'}
      }, {
      value: '21000',
      label: '岐阜県',
      chihou8id: {order:30, chiku: 'cyuubu', stroke: 'lr'}
      }, {
      value: '22000',
      label: '静岡県',
      chihou8id: {order:37, chiku: 'cyuubu', stroke: 'lr'}
      }, {
      value: '23000',
      label: '愛知県',
      chihou8id: {order:44, chiku: 'cyuubu', stroke: 'blr'}
    }, {
      value: '24000',
      label: '三重県',
      chihou8id: {order:43, chiku: 'kinki', stroke: 'blr'}
    }, {
      value: '25000',
      label: '滋賀県',
      chihou8id: {order:15, chiku: 'kinki', stroke: 'tlr'}
      }, {
      value: '26000',
      label: '京都府',
      chihou8id: {order:22, chiku: 'kinki', stroke: 'r'}
      }, {
      value: '27000',
      label: '大阪府',
      chihou8id: {order:28, chiku: 'kinki', stroke: 'bl'}
    }, {
      value: '28000',
      label: '兵庫県',
      chihou8id: {order:21, chiku: 'kinki', stroke: 'tl'}
      }, {
      value: '29000',
      label: '奈良県',
      chihou8id: {order:29, chiku: 'kinki', stroke: 'r'}
      }, {
      value: '30000',
      label: '和歌山県',
      chihou8id: {order:36, chiku: 'kinki', stroke: 'lr'}
    }, {
      value: '31000',
      label: '鳥取県',
      chihou8id: {order:0, chiku: 'cyuugoku', stroke: 'tlr'},
    }, {
      value: '32000',
      label: '島根県',
      chihou8id: {order:6, chiku: 'cyuugoku', stroke: 'tb'},
    }, {
      value: '33000',
      label: '岡山県',
      chihou8id: {order:7, chiku: 'cyuugoku', stroke: 'r'},
    }, {
      value: '34000',
      label: '広島県',
      chihou8id: {order:14, chiku: 'cyuugoku', stroke: 'blr'}
    }, {
      value: '35000',
      label: '山口県',
      chihou8id: {order:5, chiku: 'cyuugoku', stroke: 'tbl'},
    }, {
      value: '36000',
      label: '徳島県',
      chihou8id: {order:42, chiku: '4koku', stroke: 'br'}
    }, {
      value: '37000',
      label: '香川県',
      chihou8id: {order:35, chiku: '4koku', stroke: 'tr'}
    }, {
      value: '38000',
      label: '愛媛県',
      chihou8id: {order:34, chiku: '4koku', stroke: 'tl'}
      }, {
      value: '39000',
      label: '高知県',
      chihou8id: {order:41, chiku: '4koku', stroke: 'bl'}
    }, {
      value: '40000',
      label: '福岡県',
      chihou8id: {order:13, chiku: '9syuuokinawa', stroke: 'tr'}
      }, {
      value: '41000',
      label: '佐賀県',
      chihou8id: {order:19, chiku: '9syuuokinawa', stroke: 'l'}
    }, {
      value: '42000',
      label: '長崎県',
      chihou8id: {order:12, chiku: '9syuuokinawa', stroke: 'tl'}
      }, {
      value: '43000',
      label: '熊本県',
      chihou8id: {order:26, chiku: '9syuuokinawa', stroke: 'l'}
    }, {
      value: '44000',
      label: '大分県',
      chihou8id: {order:20, chiku: '9syuuokinawa', stroke: 'r'}
      }, {
      value: '45000',
      label: '宮崎県',
      chihou8id: {order:27, chiku: '9syuuokinawa', stroke: 'br'}
      }, {
      value: '46000',
      label: '鹿児島県',
      chihou8id: {order:33, chiku: '9syuuokinawa', stroke: 'lr'}
      }, {
      value: '47000',
      label: '沖縄県',
      chihou8id: {order:40, chiku: '9syuuokinawa', stroke: 'blr'}
    }, ],
    // chartType: 'bar',
    // bottomFlg: false,
    // stat:{
    //   leftSide:'',
    //   rightSide:''
    // } ,
    // statOld:{
    //   leftSide:'',
    //   rightSide:''
    // } ,
    // leftCsvDataset: null,
    // rightCsvDataset: null,
    // elDialogVisible: false,
    // elDialogMsg: '',
    // elDialogScatterVisible: false,
    // zeroRadio:true,
    // soukanFlg: false,
    // soukanReFlg: true,
    // scrollPosition: 0,
    // soukanList: [],
    // exceptCity:[],
  },
  getters: {
  },
  mutations: {
    dialogVisibleChange (state,payload) {
      // state.dialogVisible = payload
      state.dialog.visible = payload.visible;
      state.dialog.target = payload.target;
      console.log(state.dialog)
    },
    chartDivLoadingShow (state,payload) {
      state.chartDivLoading = payload
    },
    prefCodeChange (state,payload) {
        state.prefCode = payload
    },

  }
};
const store = new Vuex.Store({
  modules: {
    base:base,
    statList:statList
  }
});
export default store
