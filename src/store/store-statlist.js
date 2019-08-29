import storeBase from './store-base'
import * as statData from './data/data-miyazaki'
import * as statDataTime from './data/data-miyazaki-time'
import Citycodes from './data/citycodes'
import * as ss from 'simple-statistics'
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
    // 各種スライダー用--------------------------------------------------------------------------
    yearRangeCity: 100,
    yearRangePref: 100,
    yearRangeScatterCity: 100,
    yearRangeScatterPref: 100,
    // 宮崎県市町村用-------------------------------------------------------------------------
    leftStat: {
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    rightStat: {
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    // 全国都道府県用-------------------------------------------------------------------------
    leftStatEstatPref: {
      count: 0,
      statData: [],
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    rightStatEstatPref: {
      count: 0,
      statData: [],
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    // 全国市町村用----------------------------------------------------------------------------
    leftStatEstatCity: {
      count: 0,
      statData: [],
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    rightStatEstatCity: {
      count: 0,
      statData: [],
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    // 宮崎県時系列用-------------------------------------------------------------------------
    leftStatTime: {
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    rightStatTime: {
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    // 全国都道府県時系列用------------------------------------------------------------------
    leftStatTimePref: {
      transition: true,
      count: 0,
      stat: '',
      statData: {},
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    // 全国市町村時系列用--------------------------------------------------------------------
    leftStatTimeCity: {
      transition: true,
      count: 0,
      stat: '',
      statData: {},
      statsDataId: '',
      cdCat01: '',
      statName: '',
      source: ''
    },
    // 左右サイドメニューのメタ情報用------------------------------------------------------------
    eStatMetaCity: JSON.parse(JSON.stringify(metaCity)),
    eStatMetaPref: JSON.parse(JSON.stringify(metaPref)),
    metaMiyazakiTime: MetaMiyazakiTime,
    metaMiyazaki: metaMiyazaki
  },
  mutations: {
    //-------------------------------------------------------------------------------------------
    // サイドメニューをクリアする
    clearStat (state, payload) {
      const bk = state.metaMiyazaki;
      state.metaMiyazaki = null;
      setTimeout(() => {
        state.metaMiyazaki = bk
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
      const bk = state.metaMiyazakiTime;
      state.metaMiyazakiTime = null;
      setTimeout(() => {
        state.metaMiyazakiTime = bk
      }, 0);
    },
    eStatMetaPrefReset (state) {
      const bk = state.eStatMetaPref;
      state.eStatMetaPref = null;
      setTimeout(() => {
        state.eStatMetaPref = bk
      }, 0);
    },
    eStatMetaCityReset (state) {
      const bk = state.eStatMetaCity;
      state.eStatMetaCity = null;
      setTimeout(() => {
        state.eStatMetaCity = bk
      }, 0);
    },
    statEstatCityCrear (state) {
      state.leftStatEstatCity.statData = [];
      state.rightStatEstatCity.statData = [];
    },
    yearRangeCityChange (state, payload) {
      state.yearRangeCity = payload
    },
    yearRangePrefChange (state, payload) {
      state.yearRangePref = payload
    },
    yearRangeScatterCityChange (state, payload) {
      state.yearRangeScatterCity = payload
    },
    yearRangeScatterPrefChange (state, payload) {
      state.yearRangeScatterPref = payload
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
    // サイドのツリーをクリックしたとき---------------------------------------------------------------
    // いろんなグラフで見える化。宮崎県市町村用
    selectStat (state, payload) {
      const statName = payload.value.split('/')[0];
      const target = payload.value.split('/')[1];
      const statDataObj = statData[statName];
      const column = statDataObj[target].column;
      const title = statDataObj[target].statName;
      const unit = statDataObj[target].unit;
      const data = statDataObj.data.map(value => {
        return {
          citycode: value.citycode,
          cityname: value.cityname,
          data: value[column]
        }
      });
      // 統計の計算--------------------------------------------------------------------------
      const map = statDataObj.data.map(value => value[column]);
      const mean = ss.mean(map); // 平均値
      const median = ss.median(map);// 中央値
      const standardDeviation = ss.standardDeviation(map);// 標準偏差
      // 偏差値計算-----------------------------------------------------------------------
      data.forEach(value => {
        const zScore = ss.zScore(value.data, mean, standardDeviation);
        value['standardScore'] = zScore * 10 + 50;
      });
      const stat = payload.side === 'leftSide' ? state.leftStat : state.rightStat;
      stat.transition = true;
      stat.count = stat.count + 1;
      stat.stat = payload.value;
      stat.statData = {
        title,
        unit,
        data,
        mean,
        median,
        standardDeviation
      };
    },
    // ------------------------------------------------------------------------------------------
    // いろんなグラフで見える化。都道府県と市区町村共用
    selectStatEstat (state, payload) {
      storeBase.commit('base/chartDivLoadingShow', true);
      const statId = payload.statId.split('/')[0];
      const cat01 = payload.statId.split('/')[1];
      const unit = payload.statId.split('/')[2];
      const prefCode = payload.prefCode;
      const sourceId = payload.sourceId;
      const limit = 100000;
      axios({
        method: 'get',
        url: 'https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData',
        // url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
        params: {
          metaGetFlg: 'N',
          cntGetFlg: 'N',
          sectionHeaderFlg: '1',
          statsDataId: statId,
          cdCat01: cat01,
          limit: limit,
          appId: eStatApiId
        }
      })
      .then(response => {
        const dataAr = response.data['GET_STATS_DATA']['STATISTICAL_DATA']['DATA_INF'].VALUE;
        const times = dataAr.map(value => value['@time']).filter((x, i, self) => self.indexOf(x) === i);
        const dataSet = [];
        times.forEach(value => {
          let mean, median, standardDeviation;
          const data = dataAr.filter(val => val['@time'] === value);
          const data2 = [];
          if (payload.prefOrCity === 'pref') {
            // 統計の計算--------------------------------------------------------------------------
            const map = data.map(value => Number(value['$']));
            map.shift();
            mean = ss.mean(map); // 平均値
            median = ss.median(map);// 中央値
            standardDeviation = ss.standardDeviation(map);// 標準偏差
          }
          data.forEach(value2 => {
            if (payload.prefOrCity === 'pref') {
              // 偏差値計算-----------------------------------------------------------------------
              const zScore = ss.zScore(Number(value2['$']), mean, standardDeviation);
              const standardScore = zScore * 10 + 50;
              const prefs = storeBase.state.base.prefOptions;
              const prefsResult = prefs.find(val => val.value === value2['@area']);
              const prefName = prefsResult.label;
              data2.push({
                citycode: value2['@area'],
                cityname: prefName,
                data: Number(value2['$']),
                time: value2['@time'],
                standardScore: standardScore
              })
            } else if (payload.prefOrCity === 'city') {
              // 市町村用は市町村コード「@area」の数字を見て区かどうかを判断している。区を除いている。
              if (value2['@area'] .substr(0, 2) === prefCode.substr(0, 2)) {
                const citysResult = Citycodes.find(val => val.id === value2['@area']);
                const digit3 = value2['@area'].substr(2, 2);// 3桁目から2文字
                if (citysResult) {
                  const isKu = (() => {
                    if (value2['@area'].substr(0, 2) === '13') { // 東京都の区は区ではない。
                      return false
                    } else if (digit3 === '13' || digit3 === '14' || digit3 === '15') { // 3桁目が1または13～15は政令都市
                      if (value2['@area'].substr(4, 1) !== '0') {
                        return true
                      }
                      return false
                    } else if (value2['@area'].substr(2, 1) === '1') { // 3桁目が1または13～15は政令都市
                      if (Number(value2['@area'].substr(3, 3)) > 0) {
                        return true
                      }
                      return false
                    }
                    return false
                  })();
                  if (!isKu) {
                    const cityName = citysResult.name;
                    data2.push({
                      citycode: value2['@area'],
                      cityname: cityName,
                      data: Number(value2['$']),
                      time: value2['@time']
                    })
                  }
                }
              }
            }
          }); // 内ループ終了
          // 市町村のときは再度ループしないと偏差値を求めることができないので
          if (payload.prefOrCity === 'city') {
            // 統計の計算--------------------------------------------------------------------------
            const map = data2.map(value => value.data);
            mean = ss.mean(map); // 平均値
            median = ss.median(map);// 中央値
            standardDeviation = ss.standardDeviation(map);// 標準偏差
            // 偏差値計算-----------------------------------------------------------------------
            data2.forEach(value => {
              const zScore = ss.zScore(value.data, mean, standardDeviation);
              value['standardScore'] = zScore * 10 + 50;
            })
          }
          dataSet.push({
            time: value,
            mean,
            median,
            standardDeviation,
            data,
            data2
          })
        }); // 外ループ終了
        let stat;
        let source = '';
        if (payload.prefOrCity === 'pref') {
          stat = payload.side === 'leftSide' ? state.leftStatEstatPref : state.rightStatEstatPref;
          const result = MetaSourcePref.find(val => val.sourceId === sourceId);
          if (result) source = result.source
        } else if (payload.prefOrCity === 'city'){
          stat = payload.side === 'leftSide' ? state.leftStatEstatCity : state.rightStatEstatCity;
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
      });
    },
    // ------------------------------------------------------------------------------------------
    // 時系列。宮崎県
    selectStatTime (state, payload) {
      const data = statDataTime;
      const statNames = payload.statNames;
      const statData = statNames.map(value => {
        const statName = value.split('/')[0];
        const target = value.split('/')[1];
        const statDataObj = data[statName];
        const column = statDataObj[target].column;
        const title = statDataObj[target].statName;
        const unit = statDataObj[target].unit;
        const data1 = statDataObj.data.map(value2 => {
          return {
            nen: value2.nen,
            year: value2.year,
            data: value2[column]
          }
        });
        return {
            stat: value,
            title: title,
            unit: unit,
            data: data1
        }
      });
      const stat = payload.side === 'leftSide' ? state.leftStatTime : state.rightStatTime;
      stat.transition = true;
      stat.count = stat.count + 1;
      stat.endStat = payload.endStat;
      stat.statData = statData
    },
    // ------------------------------------------------------------------------------------------
    // 時系列。全国都道府県用
    selectStatTimePref (state, payload) {
      const statIds = payload.statIds;
      const statId = statIds[statIds.length - 1].split('/')[0];
      const cat01 = statIds[statIds.length - 1].split('/')[1];
      const sourceId = statIds[statIds.length - 1].split('/')[3];
      const statName = statIds[statIds.length - 1].split('/')[4];
      const plomises = [];
      statIds.forEach((value, index) => {
        plomises[index] =
          new Promise(function (resolve) {
            const statId = value.split('/')[0];
            const cat01 = value.split('/')[1];
            const unit = value.split('/')[2];
            const cityCode = payload.cityCode;
            const limit = 100000;
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData',
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
              let data1 = [];
              if (data0.length) {
                data1 = data0.map(value => {
                  return {
                    nen: '',
                    year: value['@time'].substr(0, 4),
                    data: Number(value['$'])
                  }
                });
              } else {
                data1.push({
                  nen: '',
                  year: data0['@time'].substr(0, 4),
                  data: Number(data0['$'])
                })
              }
              resolve({
                stat: value,
                title: title,
                unit: unit,
                data: data1
              })
            });
          })
      });
      Promise.all(plomises).then(result => {
        const stat = state.leftStatTimePref;
        const sourceResult = MetaSourcePref.find(val => val.sourceId === sourceId);
        let source = '';
        if (sourceResult) source = sourceResult.source;
        stat.transition = true;
        stat.count = stat.count + 1;
        stat.endStat = payload.endStat;
        stat.statName = statName;
        stat.statData = result;
        stat.statsDataId = statId;
        stat.cdCat01 = cat01;
        stat.sourceId = sourceId;
        stat.source = source;
      })
    },
    // ------------------------------------------------------------------------------------------
    // 時系列。全国市町村用
    selectStatTimeCity (state, payload) {
      if(!payload.cityCode) {
        // alert('市町村を選択してください。')
        // return;
      }
      const statIds = payload.statIds;
      const statId = statIds[statIds.length - 1].split('/')[0];
      const cat01 = statIds[statIds.length - 1].split('/')[1];
      const sourceId = statIds[statIds.length - 1].split('/')[3];
      const statName = statIds[statIds.length - 1].split('/')[4];
      const plomises = [];
      statIds.forEach((value, index) => {
        plomises[index] =
          new Promise(function (resolve) {
            const statId = value.split('/')[0];
            const cat01 = value.split('/')[1];
            const unit = value.split('/')[2];
            const cityCode = payload.cityCode;
            const limit = 100000;
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData',
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
              let data1 = [];
              if (data0.length) {
                data1 = data0.map(value => {
                  return {
                    nen: '',
                    year: value['@time'].substr(0, 4),
                    data: Number(value['$'])
                  }
                });
              } else {
                data1.push({
                  nen: '',
                  year: data0['@time'].substr(0, 4),
                  data: Number(data0['$'])
                })
              }
              resolve({
                stat: value,
                title: title,
                unit: unit,
                data: data1
              })
            });
          })
      });
      Promise.all(plomises).then(result => {
        const stat = state.leftStatTimeCity;
        const sourceResult = MetaSourcePref.find(val => val.sourceId === sourceId);
        let source = '';
        if (sourceResult) source = sourceResult.source;
        stat.transition = true;
        stat.count = stat.count + 1;
        stat.endStat = payload.endStat;
        stat.statName = statName;
        stat.statData = result;
        stat.statsDataId = statId;
        stat.cdCat01 = cat01;
        stat.sourceId = sourceId;
        stat.source = source;
      })
    },
    //-------------------------------------------------------------------------------------------
    // 以前、ツールをクリックしたときにメタ情報を取得していっていたときのコード
    // eStatMetaCitySet (state,payload) {
    //   const childrenArr = [];
    //   if (payload.cat01s.length) {
    //     for (let i in payload.cat01s) {
    //       // console.log(payload.cat01s[i]);
    //       const tgt = payload.cat01s[i];
    //       childrenArr.push({
    //         statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
    //         label: tgt['@name'].split('_')[1],
    //         cat01: tgt['@code'],
    //         unit: tgt['@unit']
    //       })
    //     }
    //   } else {
    //     const tgt = payload.cat01s;
    //     childrenArr.push({
    //       statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
    //       label: tgt['@name'].split('_')[1],
    //       cat01: tgt['@code'],
    //       unit: tgt['@unit']
    //     })
    //   }
    //   const target = state[payload.target];
    //   target[0].children.find((value, index, array) => {
    //     if (value.statId === payload.statId) {
    //       array[index].children = childrenArr
    //     }
    //   });
    //   target[1].children.find((value, index, array) => {
    //     if (value.statId === payload.statId) {
    //       array[index].children = childrenArr
    //     }
    //   });
    //   target[2].children.find((value, index, array) => {
    //     if (value.statId === payload.statId) {
    //       array[index].children = childrenArr
    //     }
    //   })
    // },
    // //-------------------------------------------------------------------------------------------
    // eStatMetaPrefSet (state,payload) {
    //   const childrenArr = [];
    //   for (let i in payload.cat01s) {
    //     const tgt = payload.cat01s[i];
    //     childrenArr.push({
    //       statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'] ,
    //       label: tgt['@name'].split('_')[1],
    //       cat01: tgt['@code'],
    //       unit: tgt['@unit']
    //     })
    //   }
    //   const target = state[payload.target];
    //   target[0].children.find((value, index, array) => {
    //     if (value.statId === payload.statId) {
    //       array[index].children = childrenArr
    //     }
    //   });
    //   target[1].children.find((value, index, array) => {
    //     if (value.statId === payload.statId) {
    //       array[index].children = childrenArr
    //     }
    //   })
    // }
  }
};
export default statList
