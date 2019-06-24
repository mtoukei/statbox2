// ミックスイン。普段は使用しない
// メタデータを取得するときに使う。
// コンソールログに出力されるJSON.stringifyをコピーして
// meta-pref.jsまたはmeta-city.jsに貼り付ける
// import metaSourceIDPref from '../../store/meta/meta-source-id-pref'
import metaSourceIDCity from '../../store/meta/meta-source-id-city'
export default {
  name: 'metaDataCreate',
  beforeCreate () {
    // const targets = [this.$store.state.statList.eStatMetaPref, this.$store.state.statList.eStatMetaCity]
    // const targets = [this.$store.state.statList.eStatMetaPref];
    const targets = [this.$store.state.statList.eStatMetaCity];
    const vm = this;
    for (const h in targets) {
      const target = targets[h];
      const plomises = [];
      let count = 0;
      for (const i in target) {
        for (const j in target[i].children) {
          const statId = target[i].children[j].statId;
          vm.$store.commit('base/chartDivLoadingShow', true);
          plomises[count] = new Promise(function(resolve) {
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getMetaInfo',
              params: {
                statsDataId: statId,
                appId: eStatApiId
              }
            })
            .then(response => {
              const classObjs = response.data['GET_META_INFO']['METADATA_INF']['CLASS_INF']['CLASS_OBJ'];
              const cat01s = classObjs.find(val => val['@id'] === 'cat01').CLASS;
              resolve({statId: statId, cat01s: cat01s})
            });
          });
          count++;
        }
      }
      Promise.all(plomises).then(function (result) {
        for (const i in result) {
          const childrenArr = [];
          let sourceId = '';
          if (result[i].cat01s.length) {
            for (const j in result[i].cat01s) {
              const tgt = result[i].cat01s[j];
              // const aaa = metaSourceIDPref.find(val => val.項目符号 === tgt['@code']);
              const aaa = metaSourceIDCity.find(val => val.項目符号 === tgt['@code']);
              if (aaa) {
                sourceId = aaa.sourceId
              }
              // console.log(sourceId)
              childrenArr.push({
                statId: result[i].statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
                label: tgt['@name'].split('_')[1],
                cat01: tgt['@code'],
                unit: tgt['@unit'],
                sourceId: sourceId
              });
            }
          } else {
            const tgt = result[i].cat01s;
            childrenArr.push({
              statId: result[i].statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
              label: tgt['@name'].split('_')[1],
              cat01: tgt['@code'],
              unit: tgt['@unit'],
              sourceId: sourceId
            });
          }
          // -------------------------------------------------------------------------------------
          for (const j in target) {
            target[j].children.find((value, index, array) => {
              if (value.statId === result[i].statId) {
                array[index].children = childrenArr
              }
            });
          }
        }
        vm.$store.commit('base/chartDivLoadingShow', false);
        console.log(JSON.stringify(target))
      })
    }
  }
}
