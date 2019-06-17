import storeBase from './store-base'
import  * as statData from './data/data-miyazaki'
import * as statDataTime from './data/data-miyazaki-time'
import Citycodes from './data/citycodes'
import MetaPref from './meta/meta-pref'
import MetaCity from './meta/meta-city'
import MetaMiyazaki from './meta/meta-miyazaki'
import MetaMiyazakiTime from './meta/meta-miyazaki-time'
import MetaSourcePref from './meta/meta-source-pref'
import MetaSourceCity from './meta/meta-source-city'
const metaPref = MetaPref;
const metaCity = MetaCity;
const metaMiyazaki = MetaMiyazaki;
const statList = {
  namespaced: true,
  state: {
    yearRangeCity: 100,
    yearRangePref: 100,
    chartTransition:false,
    leftStat:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    rightStat:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    leftStatEstatPref: {
      count: 0,
      statData:[],
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    rightStatEstatPref: {
      count: 0,
      statData:[],
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    leftStatEstatCity: {
      count: 0,
      statData:[],
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    rightStatEstatCity: {
      count: 0,
      statData:[],
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    leftStatTimeCity:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    leftStatTimePref:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    leftStatTime:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    rightStatTime:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    statOld:{
      leftSide: '',
      rightSide: ''
    },
    eStatMetaCity: JSON.parse(JSON.stringify(metaCity)),
    eStatMetaPreh: JSON.parse(JSON.stringify(metaPref)),
    metaMiyazakiTime: MetaMiyazakiTime,
    metaMiyazaki: metaMiyazaki
  },
  mutations: {
    //-------------------------------------------------------------------------------------------
    clearStat (state,payload) {
      const aaa = state.metaMiyazaki;
      state.metaMiyazaki = null;
      setTimeout(() => {
        state.metaMiyazaki = aaa
      }, 0);
      if(payload === 'leftSide') {
        state.leftStat.stat = '';
        state.leftStat.statData = {};
      } else {
        state.rightStat.stat = '';
        state.rightStat.statData = {};
      }
    },
    metaMiyazakiTimeReset (state) {
      const aaa = state.metaMiyazakiTime;
      state.metaMiyazakiTime = null;
      setTimeout(() => {
        state.metaMiyazakiTime = aaa
      }, 0);
    },

    eStatMetaPrehReset (state) {
      const aaa = state.eStatMetaPreh;
      state.eStatMetaPreh = null;
      setTimeout(() => {
        state.eStatMetaPreh = aaa
      }, 0);
    },
    eStatMetaCityReset (state) {
      const aaa = state.eStatMetaCity;
      state.eStatMetaCity = null;
      setTimeout(() => {
        state.eStatMetaCity = aaa
      }, 0);
    },
    statEstatCityCrear (state) {
      state.leftStatEstatCity.statData = [];
      state.rightStatEstatCity.statData = [];
    },
    yearRangeCityChange (state,payload) {
      state.yearRangeCity = payload
    },
    yearRangePrefChange (state,payload) {
      state.yearRangePref = payload
    },
    transitionSet (state,payload) {
      state.transition = payload
    },
    timeCityReload (state) {
      state.leftStatTimeCity.count = state.leftStatTimeCity.count + 1;
    },
    timePrefReload (state) {
      state.leftStatTimePref.count = state.leftStatTimePref.count + 1;
    },
    timeReload (state) {
      state.leftStatTime.count = state.leftStatTime.count + 1;
      state.leftStatTime.transition = false;
    },
    eStatReload (state,payload) {
      if (payload.side === 'left') {
        state.leftStatEstatPref.count = state.leftStatEstatPref.count + 1;
        state.leftStatEstatCity.count = state.leftStatEstatCity.count + 1;
        // state.leftStatEstatPref.div = payload.div;
      } else {
        state.rightStatEstatPref.count = state.rightStatEstatPref.count + 1;
        state.rightStatEstatCity.count = state.rightStatEstatCity.count + 1;
        // state.leftStatEstatPref.div = payload.div;
      }
    },
    //-------------------------------------------------------------------------------------------
    selectStatEstat (state,payload) {
      storeBase.commit('base/chartDivLoadingShow', true);
      const statId = payload.statId.split('/')[0];
      const cat01 = payload.statId.split('/')[1];
      const unit = payload.statId.split('/')[2];
      const prefCode = payload.prefCode;
      const sourceId = payload.sourceId;
      const limit = 100000;
      axios({
        method: 'get',
        url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
        params: {
          metaGetFlg: 'N',
          cntGetFlg: 'N',
          sectionHeaderFlg: '1',
          statsDataId: statId,
          // cdArea: cityCode,
          cdCat01: cat01,
          limit: limit,
          appId: eStatApiId
        }
      })
      .then(response => {
        const times = [];
        const dataAr = response.data['GET_STATS_DATA']['STATISTICAL_DATA']['DATA_INF'].VALUE;
        for (let i in dataAr) {
          times.push(dataAr[i]['@time'])
        }
        const times2 = times.filter(function (x, i, self) {
          return self.indexOf(x) === i;
        });
        const dataSet = [];
        for (const times2Value of times2) {
          const data =dataAr.filter(val => val['@time'] === times2Value);
          const data2 = [];
          for (const dataValue of data) {
            if (payload.prefOrCity === 'pref') {
              const prefs = storeBase.state.base.prefOptions;
              const prefsResult = prefs.find(val => val.value === dataValue['@area']);
              const prefName = prefsResult.label;
              data2.push({
                citycode: dataValue['@area'],
                cityname: prefName,
                data: Number(dataValue['$']),
                time: dataValue['@time']
              })
            } else if (payload.prefOrCity === 'city'){
              if (dataValue['@area'] .substr(0,2) === prefCode.substr(0,2)) {
                const citysResult = Citycodes.find(val => val.id === dataValue['@area']);
                if (citysResult) {
                  const kuFlg = function () {
                    if (dataValue['@area'].substr(0,2) === '13') {// 東京都の区は区ではない。
                      return false
                    } else if (dataValue['@area'].substr(2,2) === '13' || dataValue['@area'].substr(2,2) === '14' || dataValue['@area'].substr(2,2) === '15') {// 3桁目が1または13は政令都市
                      if (dataValue['@area'].substr(4, 1) !== '0') {
                        return true
                      } else {
                        return false
                      }
                    } else if (dataValue['@area'].substr(2,1) === '1') {// 3桁目が1または13は政令都市
                      if (Number(dataValue['@area'].substr(3, 3)) > 0) {
                        return true
                      } else {
                        return false
                      }
                    } else {
                      return false
                    }
                  }();
                  if (!kuFlg) {
                    const cityName = citysResult.name;
                    data2.push({
                      citycode: dataValue['@area'],
                      cityname: cityName,
                      data: Number(dataValue['$']),
                      time: dataValue['@time']
                    })
                  }
                }
              }
            }
          }
          dataSet.push({
            time: times2Value,
            data: data,
            data2: data2
          })
        }
        let stat;
        let source = '';
        if (payload.prefOrCity === 'pref') {
          stat = payload.side === 'leftSide'? state.leftStatEstatPref: state.rightStatEstatPref;
          const result = MetaSourcePref.find(val => val.sourceId === sourceId);
          if (result) source = result.source
        } else if (payload.prefOrCity === 'city'){
          stat = payload.side === 'leftSide'? state.leftStatEstatCity: state.rightStatEstatCity;
          const result = MetaSourceCity.find(val => val.sourceId === sourceId);
          if (result) source = result.source
        }
        stat.transition = true;
        stat.estat = true;
        stat.statName = payload.statName;
        stat.statData = dataSet;
        stat.unit = unit;
        stat.statsDataId = statId;
        stat.cdCat01 = cat01;
        stat.sourceId = sourceId;
        stat.source = source;
        stat.prefOrCity = payload.prefOrCity;
        storeBase.commit('base/chartDivLoadingShow', false)
        console.log(stat)
      });
    },
    //-------------------------------------------------------------------------------------------
    // 左右サイドのツリーから選択したとき
    selectStat (state,payload) {
      const data = statData;//別ファイルから
      const statName = payload.value.split('/')[0];
      const target = payload.value.split('/')[1];
      const statDataObj = data[statName];
      const column = statDataObj[target].column;
      const title = statDataObj[target].statName;
      const unit = statDataObj[target].unit;
      const data0 = statDataObj.data;
      const data1 = [];
      for (let i in data0) {
        const obj = {
          citycode: data0[i].citycode,
          cityname: data0[i].cityname,
          data: data0[i][column]
        };
        data1.push(obj)
      }
      const data2 = {
        title: title,
        unit: unit,
        data: data1
      };
      // console.log(payload.side)
      let stat;
      if (payload.side === 'leftSide') {
        stat = state.leftStat;
      } else {
        stat = state.rightStat;
      }
      stat.transition = true;
      stat.count = stat.count + 1;
      stat.stat = payload.value;
      stat.statData = data2;
      console.log(stat)
    },
    //-------------------------------------------------------------------------------------------
    selectStatTimeCity (state,payload) {
      if(!payload.cityCode) {
        // alert('市町村を選択してください。')
        // return;
      }
      const statIds = payload.statIds;
      const plomises = [];
      for (let i in statIds) {
        plomises[i] =
          new Promise(function (resolve) {
            const statId = statIds[i].split('/')[0];
            const cat01 = statIds[i].split('/')[1];
            const unit = statIds[i].split('/')[2];
            const cityCode = payload.cityCode;
            // console.log(statId, cat01, unit)
            const limit = 100000;
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
              params: {
                metaGetFlg: 'Y',
                cntGetFlg: 'N',
                sectionHeaderFlg: '1',
                statsDataId: statId,
                cdArea: cityCode,
                cdCat01: cat01,
                limit: limit,
                appId: eStatApiId
              }
            })
            .then(response => {
              const rStatData = response.data['GET_STATS_DATA']['STATISTICAL_DATA'];
              const classObjs = rStatData['CLASS_INF']['CLASS_OBJ'];
              const title = classObjs.find(val => val['@id'] === 'cat01').CLASS['@name'].split('_')[1];
              const data0 = rStatData['DATA_INF'].VALUE;
              const data1 = [];
              if (data0.length) {
                for (let j in data0) {
                  const obj = {
                    nen: '',
                    year: data0[j]['@time'].substr(0, 4),
                    data: Number(data0[j]['$'])
                  };
                  data1.push(obj)
                }
              } else {
                const obj = {
                  nen: '',
                  year: data0['@time'].substr(0, 4),
                  data: Number(data0['$'])
                };
                data1.push(obj)
              }
              const data2 = {
                // nodeId: nodeId,
                stat: statIds[i],
                title: title,
                unit: unit,
                data: data1
              };
              resolve(data2)
            });
          })
      }
      Promise.all(plomises).then(function (result) {
        const stat = state.leftStatTimeCity;
        stat.transition = true;
        stat.count = stat.count + 1;
        stat.endStat = payload.endStat;
        stat.statData = result;
        console.log(stat)
      })
    },
    //-------------------------------------------------------------------------------------------
    selectStatscatterPref (state,payload) {
      const statIds = payload.statIds;
      const plomises = [];
      for (let i in statIds) {
        plomises[i] =
          new Promise(function (resolve) {
            const statId = statIds[i].split('/')[0];
            const cat01 = statIds[i].split('/')[1];
            const unit = statIds[i].split('/')[2];
            const cityCode = payload.cityCode;
            // console.log(statId, cat01, unit)
            const limit = 100000;
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
              params: {
                metaGetFlg: 'Y',
                cntGetFlg: 'N',
                sectionHeaderFlg: '1',
                statsDataId: statId,
                cdArea: cityCode,
                cdCat01: cat01,
                limit: limit,
                appId: eStatApiId
              }
            })
            .then(response => {
              // console.log(response)
              const rStatData = response.data['GET_STATS_DATA']['STATISTICAL_DATA'];
              const classObjs = rStatData['CLASS_INF']['CLASS_OBJ'];
              const title = classObjs.find(val => val['@id'] === 'cat01').CLASS['@name'].split('_')[1];
              const data0 = rStatData['DATA_INF'].VALUE;
              const data1 = [];
              if (data0.length) {
                for (let j in data0) {
                  const obj = {
                    nen: '',
                    year: data0[j]['@time'].substr(0, 4),
                    data: Number(data0[j]['$'])
                  };
                  data1.push(obj)
                }
              } else {
                const obj = {
                  nen: '',
                  year: data0['@time'].substr(0, 4),
                  data: Number(data0['$'])
                };
                data1.push(obj)
              }
              console.log(statIds[i]);
              const data2 = {
                // nodeId: nodeId,
                stat: statIds[i],
                title: title,
                unit: unit,
                data: data1
              };
              resolve(data2)
            });
          })
      }
      Promise.all(plomises).then(function (result) {
        // console.log(result)
        const stat = payload.side === "leftSide"? state.leftStatTimePref: state.rightStatTimePref;
        stat.transition = true;
        stat.count = stat.count + 1;
        stat.stat = 'estat';
        stat.endStat = payload.endStat;
        stat.statData = result;
        console.log(stat)
      })
    },
    //-------------------------------------------------------------------------------------------
    selectStatTimePref (state,payload) {
      const statIds = payload.statIds;
      const plomises = [];
      for (let i in statIds) {
        plomises[i] =
          new Promise(function (resolve) {
            const statId = statIds[i].split('/')[0];
            const cat01 = statIds[i].split('/')[1];
            const unit = statIds[i].split('/')[2];
            const cityCode = payload.cityCode;
            // console.log(statId, cat01, unit)
            const limit = 100000;
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
              params: {
                metaGetFlg: 'Y',
                cntGetFlg: 'N',
                sectionHeaderFlg: '1',
                statsDataId: statId,
                cdArea: cityCode,
                cdCat01: cat01,
                limit: limit,
                appId: eStatApiId
              }
            })
            .then(response => {
              // console.log(response)
              const rStatData = response.data['GET_STATS_DATA']['STATISTICAL_DATA'];
              const classObjs = rStatData['CLASS_INF']['CLASS_OBJ'];
              const title = classObjs.find(val => val['@id'] === 'cat01').CLASS['@name'].split('_')[1];
              const data0 = rStatData['DATA_INF'].VALUE;
              const data1 = [];
              if (data0.length) {
                for (let j in data0) {
                  const obj = {
                    nen: '',
                    year: data0[j]['@time'].substr(0, 4),
                    data: Number(data0[j]['$'])
                  };
                  data1.push(obj)
                }
              } else {
                const obj = {
                  nen: '',
                  year: data0['@time'].substr(0, 4),
                  data: Number(data0['$'])
                };
                data1.push(obj)
              }
              console.log(statIds[i]);
              const data2 = {
                // nodeId: nodeId,
                stat: statIds[i],
                title: title,
                unit: unit,
                data: data1
              };
              resolve(data2)
            });
          })
      }
      Promise.all(plomises).then(function (result) {
        // console.log(result)
        const stat = state.leftStatTimePref;
        stat.transition = true;
        stat.count = stat.count + 1;
        stat.endStat = payload.endStat;
        stat.statData = result;
        console.log(stat)
      })
    },
    //-------------------------------------------------------------------------------------------
    selectStatTime (state,payload) {
      const data = statDataTime;
      const statNames = payload.statNames;
      const statData = [];
      for (let i in statNames) {
        // console.log(statNames[i])
        const statName = statNames[i].split('/')[0];
        // console.log(statName)
        const target = statNames[i].split('/')[1];
        // console.log(target)
        const statDataObj = data[statName];
        // console.log(statDataObj)
        const column = statDataObj[target].column;
        // console.log(column)
        const title = statDataObj[target].statName;
        const unit = statDataObj[target].unit;
        const data0 = statDataObj.data;
        // console.log(data0)
        const data1 = [];
        for (let j in data0) {
          const obj = {
            nen: data0[j].nen,
            year: data0[j].year,
            data: data0[j][column]
          };
          data1.push(obj)
        }
        const data2 = {
          stat: statNames[i],
          title: title,
          unit: unit,
          data: data1
        };
        statData.push(data2)
      }
      // console.log(payload.side)
      let stat;
      if (payload.side === 'leftSide') {
        stat = state.leftStatTime;
      } else {
        stat = state.rightStatTime;
      }
      stat.transition = true;
      stat.count = stat.count + 1;
      stat.endStat = payload.endStat;
      stat.statData = statData
    },
    //-------------------------------------------------------------------------------------------
    statReload (state,payload) {
      if (payload === 'left') {
        state.leftStat.transition = false;
        state.leftStat.count = state.leftStat.count + 1;
      } else {
        state.rightStat.transition = false;
        state.rightStat.count = state.rightStat.count + 1;
      }
    },
    //-------------------------------------------------------------------------------------------
    eStatMetaCitySet (state,payload) {
      const childrenArr = [];
      if (payload.cat01s.length) {
        for (let i in payload.cat01s) {
          // console.log(payload.cat01s[i]);
          const tgt = payload.cat01s[i];
          childrenArr.push({
            statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
            label: tgt['@name'].split('_')[1],
            cat01: tgt['@code'],
            unit: tgt['@unit']
          })
        }
      } else {
        const tgt = payload.cat01s;
        childrenArr.push({
          statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
          label: tgt['@name'].split('_')[1],
          cat01: tgt['@code'],
          unit: tgt['@unit']
        })
      }
      const target = state[payload.target];
      target[0].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      });
      target[1].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      });
      target[2].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      })
    },
    //-------------------------------------------------------------------------------------------
    eStatMetaPrehSet (state,payload) {
      const childrenArr = [];
      for (let i in payload.cat01s) {
        const tgt = payload.cat01s[i];
        childrenArr.push({
          statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'] ,
          label: tgt['@name'].split('_')[1],
          cat01: tgt['@code'],
          unit: tgt['@unit']
        })
      }
      const target = state[payload.target];
      target[0].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      });
      target[1].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      })
    }
  }
};
export default statList
