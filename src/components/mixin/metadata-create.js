// ミックスイン。普段は使用しない
// メタデータを取得するときに使う。
// コンソールログに出力されるJSON.stringifyをコピーして
// ○○○に貼り付ける
export default {
  name: 'metaDataCreate',
  beforeCreate () {
    // // const targets = [this.$store.state.statList.eStatMetaPreh, this.$store.state.statList.eStatMetaCity]
    // const targets = [this.$store.state.statList.eStatMetaPreh]
    // const vm = this;
    // for (let h in targets) {
    //   const target = targets[h]
    //   const plomises = [];
    //   let count = 0;
    //   for (let i in target) {
    //     for (let j in target[i].children) {
    //       const statId = target[i].children[j].statId;
    //       vm.$store.commit('base/chartDivLoadingShow', true);
    //       plomises[count] =  new Promise(function(resolve) {
    //         axios({
    //           method: 'get',
    //           url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getMetaInfo',
    //           params: {
    //             statsDataId: statId,
    //             appId: eStatApiId
    //           }
    //         })
    //         .then(response => {
    //           const classObjs = response.data['GET_META_INFO']['METADATA_INF']['CLASS_INF']['CLASS_OBJ'];
    //           const cat01s = classObjs.find(val => val['@id'] === 'cat01').CLASS;
    //           resolve({statId: statId, cat01s: cat01s})
    //         });
    //       });
    //       count++;
    //     }
    //   }
    //   Promise.all(plomises).then(function (result) {
    //     for (let i in result) {
    //       const childrenArr = [];
    //       if (result[i].cat01s.length) {
    //         for (let j in result[i].cat01s) {
    //           const tgt = result[i].cat01s[j];
    //           childrenArr.push({
    //             statId: result[i].statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
    //             label: tgt['@name'].split('_')[1],
    //             cat01: tgt['@code'],
    //             unit: tgt['@unit']
    //           });
    //         }
    //       } else {
    //         const tgt = result[i].cat01s;
    //         childrenArr.push({
    //           statId: result[i].statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
    //           label: tgt['@name'].split('_')[1],
    //           cat01: tgt['@code'],
    //           unit: tgt['@unit']
    //         });
    //       }
    //       for (let j in target) {
    //         target[j].children.find((value, index, array) => {
    //           if (value.statId === result[i].statId) {
    //             array[index].children = childrenArr
    //           }
    //         });
    //       }
    //     }
    //     vm.$store.commit('base/chartDivLoadingShow', false);
    //     console.log(33333)
    //     console.log(target)
    //     console.log(JSON.stringify(target))
    //   })
    // }
  },
  methods: {
    mix_metaDataCreate() {

    }
  }
}
