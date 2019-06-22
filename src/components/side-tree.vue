<template>
  <div :id="c_divId">
    <div class="resizers">
      <div :class="c_divClass">
        <div class="resizer-inner">
          <i :class="c_iClass" />
        </div>
      </div>
      <!-- ツリーここから-->
      <div class="v-tree">
        <!--宮崎県市町村-->
        <div v-show="statType === 'miyazakiCity' || statType === 'scatter'">
          <div class="top-div top-div-h">
            <el-button
              type="info"
              size="mini"
              @click="clearMiyazaki"
              style="margin-bottom: 10px;"
            >
              クリア
            </el-button>
            <el-input
              id="search-text-miyazaki"
              placeholder="キーワード検索"
              v-model="filterTextMiyazaki"
            />
          </div>
          <div
            id="miyazaki-city-tree-div"
            class="tree-div"
          >
            <el-tree
              ref="treeMiyazaki"
              :data="s_metaMiyazaki"
              :filter-node-method="filterNode"
              @node-click="nodeClickMiyazaki"
              highlight-current
              :indent="10"
            />
          </div>
        </div>

        <!--全国都道府県-->
        <div v-if="statType === 'pref'">
          <div class="top-div top-div-h">
            <el-button
              type="info"
              size="mini"
              @click="clearPref"
              style="margin-bottom: 10px;"
            >
              クリア
            </el-button>
            <el-input
              id="search-text-pref"
              placeholder="キーワード検索"
              v-model="filterTextPref"
            />
          </div>
          <div
            id="pref-tree-div"
            class="tree-div"
          >
            <el-tree
              ref="treePref"
              node-key="statId"
              :check-on-click-node="true"
              :check-strictly="true"
              @node-expand="nodeClickEstat1"
              @check="nodeClickEstat1"
              :data="s_eStatMetaPreh"
              :filter-node-method="filterNode"
              highlight-current
              :indent="10"
            />
            <div class="side-sourse">
              出典:<a
                href="https://www.stat.go.jp/data/ssds/index.html"
                target="_blank"
              >社会・人口統計体系</a>
            </div>
          </div>
        </div>

        <!--全国散布図-->
        <div
          v-if="statType === 'scatterPref'"
          id="left-side-scatter-japan"
        >
          <div class="top-div top-div-h">
            <el-button
              type="info"
              size="mini"
              @click="clearscatterPref"
              style="margin-bottom:10px;"
            >
              クリア
            </el-button>
            <el-input
              placeholder="キーワード検索"
              v-model="filterTextPrefScatter"
            />
          </div>
          <div
            id="scatter-japan-tree-div"
            class="tree-div"
          >
            <el-tree
              ref="tresscatterPref"
              node-key="statId"
              :check-on-click-node="true"
              :check-strictly="true"
              @node-expand="nodeClickEstat1"
              @check="nodeClickEstat1"
              :data="s_eStatMetaPreh"
              :filter-node-method="filterNode"
              highlight-current
              :indent="10"
            />
            <div class="side-sourse">
              出典:<a
                href="https://www.stat.go.jp/data/ssds/index.html"
                target="_blank"
              >社会・人口統計体系</a>
            </div>
          </div>
        </div>
        <!--全国時系列-->
        <div v-if="statType === 'timePref'">
          <div class="top-div top-div-h">
            <el-select
              class="pref-select"
              v-model="s_prefCode"
              placeholder="Select"
            >
              <el-option
                v-for="item in s_prefOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button
              type="info"
              size="mini"
              @click="clearTimePref"
              style="margin: 0 0 10px 10px;"
            >
              クリア
            </el-button>
            <el-input
              placeholder="キーワード検索"
              v-model="filterTextPrefTime"
            />
          </div>
          <div
            id="time-japan-tree-div"
            class="tree-div"
          >
            <el-tree
              ref="treeTimePref"
              node-key="statId"
              show-checkbox
              :check-on-click-node="true"
              :check-strictly="true"
              :data="s_eStatMetaPreh"
              @check="nodeClickEstatTime(arguments[0], 'pref')"
              :filter-node-method="filterNode"
              highlight-current
              :indent="10"
            />
            <div class="side-sourse">
              出典:<a
                href="https://www.stat.go.jp/data/ssds/index.html"
                target="_blank"
              >社会・人口統計体系</a>
            </div>
          </div>
        </div>

        <!--宮崎県時系列-->
        <div v-show="statType === 'time'">
          <div class="top-div top-div-h">
            <el-button
              type="info"
              size="mini"
              @click="clearMiyazakiTime"
              style="margin-bottom: 10px;"
            >
              クリア
            </el-button>
            <el-input
              id="search-text-miyazaki-time"
              placeholder="キーワード検索"
              v-model="filterTextMiyazakiTime"
            />
          </div>
          <div
            id="time-tree-div"
            class="tree-div"
          >
            <el-tree
              ref="treeTime"
              node-key="statName"
              show-checkbox
              :check-on-click-node="true"
              :check-strictly="true"
              :data="s_metaMiyazakiTime"
              :filter-node-method="filterNode"
              @check="nodeClickMiyazakiTime"
              highlight-current
              :indent="10"
            />
          </div>
        </div>

        <!--市町村時系列-->
        <div
          v-if="statType === 'timeCity'"
          id="left-side-time-city"
        >
          <div class="top-div top-div-h2">
            <el-select
              class="pref-select"
              v-model="s_prefCode"
              @change="prefChange"
              placeholder="Select"
            >
              <el-option
                v-for="item in prefOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              class="city-select"
              v-model="cityCode"
              placeholder="Select"
            >
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select><br>
            <el-button
              type="info"
              size="mini"
              @click="clearCityTime"
              style="margin: 5px 0 5px 0;"
            >
              クリア
            </el-button>
            <el-input
              id="search-text-city-time"
              placeholder="キーワード検索"
              v-model="filterTextCityTime"
            />
          </div>
          <div class="tree-div">
            <el-tree
              ref="treeTimeCity"
              node-key="statId"
              show-checkbox
              :check-on-click-node="true"
              :check-strictly="true"
              :data="s_eStatMetaCity"
              @check="nodeClickEstatTime(arguments[0], 'city')"
              :filter-node-method="filterNode"
              highlight-current
              :indent="10"
            />
            <div class="side-sourse">
              出典:<a
                href="https://www.stat.go.jp/data/ssds/index.html"
                target="_blank"
              >社会・人口統計体系</a>
            </div>
          </div>
        </div>

        <!-- 全国市町村-->
        <div
          v-if="statType === 'city'"
          id="left-side-city"
        >
          <div class="top-div top-div-h">
            <el-select
              class="pref-select"
              v-model="s_prefCode"
              @change="prefChange"
              placeholder="Select"
            >
              <el-option
                v-for="item in prefOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button
              type="info"
              size="mini"
              @click="clearCity"
              style="margin-bottom: 10px;"
            >
              クリア
            </el-button>
            <el-input
              id="search-text-city"
              placeholder="キーワード検索"
              v-model="filterTextCity"
            />
          </div>
          <div class="tree-div">
            <el-tree
              ref="treeCity"
              node-key="statId"
              :check-on-click-node="true"
              :check-strictly="true"
              @node-expand="nodeClickEstat4"
              @check="nodeClickEstat4"
              :data="s_eStatMetaCity"
              :filter-node-method="filterNode"
              highlight-current
              :indent="10"
            />
            <div class="side-sourse">
              出典:<a
                href="https://www.stat.go.jp/data/ssds/index.html"
                target="_blank"
              >社会・人口統計体系</a>
            </div>
          </div>
        </div>

        <!--市町村散布図-->
        <div
          v-if="statType === 'scatterCity'"
          id="left-side-scatter-city"
        >
          <div class="top-div top-div-h">
            <el-select
              class="pref-select"
              v-show="side === 'leftSide'"
              v-model="s_prefCode"
              @change="prefChange"
              placeholder="Select"
            >
              <el-option
                v-for="item in prefOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button
              type="info"
              size="mini"
              @click="clearscatterCity"
              style="margin: 0 0 10px 0;"
            >
              クリア
            </el-button>
            <el-input
              id="search-text-city-scatter"
              placeholder="キーワード検索"
              v-model="filterTextCityScatter"
            />
          </div>
          <div
            id="scatter-city-tree-div"
            class="tree-div"
          >
            <el-tree
              ref="tresscatterCity"
              node-key="statId"
              :check-on-click-node="true"
              :check-strictly="true"
              @node-expand="nodeClickEstat4"
              @check="nodeClickEstat4"
              :data="s_eStatMetaCity"
              :filter-node-method="filterNode"
              highlight-current
              :indent="10"
            />
            <div class="side-sourse">
              出典:<a
                href="https://www.stat.go.jp/data/ssds/index.html"
                target="_blank"
              >社会・人口統計体系</a>
            </div>
          </div>
        </div>
      </div>
      <!-- ツリーここまで-->
    </div>
    <resize-observer @notify="mix_detectResize" />
  </div>
</template>
<script>
  import Citycodes from '../store/data/citycodes'
  import mixinDetectResize from '../components/mixin/detectResize'
  export default {
    name: "SideTree",
    props: {
      side: {type: String, default: ''},
      statType: {type: String, default: ''}
    },
    mixins: [mixinDetectResize],
    data() {
      return {
        divId: 'left-side-div',
        divClass: 'resizer right',
        metaInfo: null,
        cityCode: '45201',
        // prefCode: '45000',
        cityOptions: [{}],
        filterTextMiyazaki: '',
        filterTextMiyazakiTime: '',
        filterTextPref: '',
        filterTextPrefScatter: '',
        filterTextPrefTime: '',
        filterTextCity: '',
        filterTextCityScatter: '',
        filterTextCityTime: ''
      };
    },
    computed: {
      c_divId () {
        if (this.side === 'leftSide') {
          return 'left-side-div'
        }
          return 'right-side-div'

      },
      c_divClass () {
        if (this.side === 'leftSide') {
          return 'resizer right'
        }
          return 'resizer left'

      },
      c_iClass () {
        if (this.side === 'leftSide') {
          return 'el-icon-arrow-right'
        }
          return 'el-icon-arrow-left'

      },
      s_prefCode: {
        get () { return this.$store.state.base.prefCode },
        set (value) { this.$store.commit('base/prefCodeChange', value) }
      },
      s_prefOptions () { return this.$store.state.base.prefOptions },
      prefOptions2 () {
        const options = [];
        for (const i in this.s_prefOptions) {
          if (i > 0) options.push(this.s_prefOptions[i])
        }
        return options
      },
      s_metaMiyazaki () { return this.$store.state.statList.metaMiyazaki },
      s_metaMiyazakiTime () { return this.$store.state.statList.metaMiyazakiTime },
      s_eStatMetaCity () { return this.$store.state.statList.eStatMetaCity },
      s_eStatMetaPreh () { return this.$store.state.statList.eStatMetaPreh }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getMetaInfo (e) {
        const vm = this;
        vm.$store.commit('base/chartDivLoadingShow', true);
        vm.metaInfo = new Promise(function(resolve) {
          axios({
            method: 'get',
            url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getMetaInfo',
            params: {
              statsDataId: e.statId,
              appId: eStatApiId
            }
          })
          .then(response => {
            vm.$store.commit('base/chartDivLoadingShow', false);
            const classObjs = response.data['GET_META_INFO']['METADATA_INF']['CLASS_INF']['CLASS_OBJ'];
            const cat01s = classObjs.find(val => val['@id'] === 'cat01').CLASS;
            resolve(cat01s)
          });
        })
      },
      prefChange2 () {
        this.$store.commit('statList/eStatReload', {side: 'left'});
      },
      prefChange (prefCode) {
        const citys = Citycodes.filter(value => value.id.substr(0, 2) === prefCode.substr(0, 2));
        const citys2 = [];
        citys.forEach(value => {
          citys2.push({
            value: value.id,
            label: value.name
          })
        });
        d3.select('#left-chart-div').selectAll('.chart-svg').remove();
        this.cityOptions = citys2;
        // axios({
        //   method: 'get',
        //   url: 'http://www.land.mlit.go.jp/webland/api/CitySearch',
        //   params: {
        //     area: prefCode.substr(0, 2)
        //   }
        // })
        // .then(response => {
        //   const citys = response.data.data;
        //   const citys2 = []
        //   for (let i in citys) {
        //     citys2.push({
        //       value: citys[i].id,
        //       label: citys[i].name
        //     })
        //   }
        //   this.cityOptions = citys2
        // });
      },
      clearMiyazaki () {
        this.$store.commit('statList/clearStat', this.side);
        this.filterTextMiyazaki = '';
        if (this.side === 'leftSide') {
          d3.select('#left-chart-div').selectAll('.chart-svg').remove()
        } else {
          d3.select('#right-chart-div').selectAll('.chart-svg').remove()
        }
      },
      clearMiyazakiTime () {
        this.$store.commit('statList/metaMiyazakiTimeReset');
        this.filterTextMiyazakiTime = '';
        this.$refs.treeTime.setCheckedKeys([]);
        this.$store.commit('statList/selectStatTime', {statNames: '', endStat: '', side: this.side })
      },
      clearPref () {
        this.$store.commit('statList/eStatMetaPrehReset');
        this.filterTextPref = '';
        if (this.side === 'leftSide') {
          d3.select('#left-chart-div').selectAll('.chart-svg').remove()
        } else {
          d3.select('#right-chart-div').selectAll('.chart-svg').remove()
        }
      },
      clearscatterPref () {
        this.$store.commit('statList/eStatMetaPrehReset');
        this.filterTextPrefScatter = '';
        this.$refs.tresscatterPref.setCheckedKeys([]);
        d3.select('#left-chart-div').selectAll('.svg').remove()
      },
      clearTimePref () {
        this.$store.commit('statList/eStatMetaPrehReset');
        this.filterTextPrefTime = '';
        this.$refs.treeTimePref.setCheckedKeys([]);
        this.$store.commit('statList/selectStatTimePref', {statName: '', statIds: '', endStat: '', side: this.side })
      },
      clearCity () {
        this.$store.commit('statList/eStatMetaCityReset');
        this.filterTextCity = '';
        if (this.side === 'leftSide') {
          d3.select('#left-chart-div').selectAll('.chart-svg').remove()
        } else {
          d3.select('#right-chart-div').selectAll('.chart-svg').remove()
        }
      },
      clearscatterCity () {
        this.$store.commit('statList/eStatMetaCityReset');
        this.filterTextCityScatter = '';
        d3.select('#left-scatterCity').selectAll('.chart-svg').remove();
        this.$store.commit('statList/statEstatCityCrear')
      },
      clearCityTime () {
        this.$store.commit('statList/eStatMetaCityReset');
        this.filterTextCityTime = '';
        this.$refs.treeTimeCity.setCheckedKeys([]);
        this.$store.commit('statList/selectStatTimeCity', {statName: '', statIds: '', endStat: '', side: this.side })
      },
      //-----------------------------------------------------------------------------------------
      nodeClickMiyazaki (e) {
        if (!e.children) {
          this.$store.commit('statList/transitionSet', true);
          this.$store.commit('statList/selectStat', {value: e.statName, side: this.side})
        }
      },
      //-----------------------------------------------------------------------------------------
      nodeClickMiyazakiTime (e) {
        if (!e.children) {
          const keys = this.$refs.treeTime.getCheckedKeys();
          const statNames = [];
          const units = [];
          keys.forEach(value => {
            if (value) {
              statNames.push(value);
              units.push(value.split('/')[2]);
            }
          });
          if (units.filter((x, i, self) => self.indexOf(x) === i).length > 2) {
            this.$message('単位が３つ以上あるので描画できません。選択しなおしてください。0');
            const newKeys = keys.filter(val => val !== e.statName);
            this.$refs.treeTime.setCheckedKeys(newKeys);
            return;
          }
          this.$store.commit('statList/transitionSet', true);
          this.$store.commit('statList/selectStatTime', {statNames: statNames, endStat: e.statName, side: this.side })
        }
      },
      //-----------------------------------------------------------------------------------------
      // 都道府県各種グラフと散布図
      nodeClickEstat1 (e) {
        if (!e.children) {
          this.$store.commit('statList/transitionSet', true);
          this.$store.commit('statList/selectStatEstat', {statId: e.statId, side: this.side, statName: e.label, unit: e.unit, prefOrCity: 'pref', sourceId: e.sourceId})
        }
      },
      //-----------------------------------------------------------------------------------------
      // 都道府県。市町村時系列
      nodeClickEstatTime (e, prefOrCity) {
        if (!e.children) {
          const refs = prefOrCity === 'pref' ? this.$refs.treeTimePref : this.$refs.treeTimeCity;
          const keys = refs.getCheckedKeys();
          const statIds = [];
          const units = [];
          keys.forEach(value => {
            if (value) {
              if (value.length > 10) {
                statIds.push(value);
                units.push(value.split('/')[2]);
              }
            }
          });
          if (units.filter((x, i, self) => self.indexOf(x) === i).length > 2) {
            this.$message('単位が３つ以上あるので描画できません。選択しなおしてください。');
            const newKeys = keys.filter(val => val !== e.statId);
            this.$refs.treeTimePref.setCheckedKeys(newKeys);
            return;
          }
          this.$store.commit('statList/transitionSet', true);
          if (prefOrCity === 'pref') {
            this.$store.commit('statList/selectStatTimePref', {statName: e.label, statIds: statIds, endStat: e.statId, side: this.side, cityCode: this.s_prefCode })
          } else {
            this.$store.commit('statList/selectStatTimeCity', {statName: e.label, statIds: statIds, endStat: e.statId, side: this.side, cityCode: this.cityCode })
          }
        }
      },
      //-----------------------------------------------------------------------------------------
      // 全国市町村各種グラフと散布図
      nodeClickEstat4 (e) {
        if (!e.children) {
          this.$store.commit('statList/transitionSet', true);
          this.$store.commit('statList/selectStatEstat', {statId: e.statId, side: this.side, statName: e.label, unit: e.unit, prefOrCity: 'city', prefCode: this.s_prefCode, sourceId: e.sourceId })
        }
      },
    },
    watch: {
      filterTextMiyazaki(val) { this.$refs.treeMiyazaki.filter(val) },
      filterTextMiyazakiTime(val) { this.$refs.treeTime.filter(val) },
      filterTextPref(val) { this.$refs.treePref.filter(val) },
      filterTextPrefScatter(val) { this.$refs.tresscatterPref.filter(val) },
      filterTextPrefTime(val) { this.$refs.treeTimePref.filter(val) },
      filterTextCity(val) { this.$refs.treeCity.filter(val) },
      filterTextCityScatter(val) { this.$refs.tresscatterCity.filter(val) },
      filterTextCityTime(val) { this.$refs.treeTimeCity.filter(val) },
    },
    mounted () {
      this.$nextTick(function () {
        this.prefChange('45000');
        this.cityCode = '45201'
      })
    }
  }
</script>
