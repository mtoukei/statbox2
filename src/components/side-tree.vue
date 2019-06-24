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

        <!--全国都道府県と全国散布図-->
        <div
          v-for="el in prefDiv"
          :key="el.id"
        >
          <div v-show="statType ===el.statType">
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
                placeholder="キーワード検索"
                v-model="c_filterText"
              />
            </div>
            <div class="tree-div">
              <el-tree
                :ref="el.ref"
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
        </div>

        <!-- 全国市町村と全国市町村散布図-->
        <div
          v-for="el in cityDiv"
          :key="el.id"
        >
          <div v-show="statType === el.statType">
            <div class="top-div top-div-h">
              <el-select
                class="pref-select"
                v-model="s_prefCode"
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
                placeholder="キーワード検索"
                v-model="c_filterText"
              />
            </div>
            <div class="tree-div">
              <el-tree
                :ref="el.ref"
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

        <!--全国時系列と市町村時系列-->
        <div
          v-for="el in timeDiv"
          :key="el.id"
        >
          <div v-show="statType === el.statType">
            <div :class="['top-div', statType==='timePref' ? 'top-div-h' : 'top-div-h2']">
              <el-select
                class="pref-select"
                v-model="s_prefCode"
                @change="prefChange(arguments[0], el.statType)"
                placeholder="Select"
              >
                <el-option
                  v-for="item in s_prefOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-if="statType==='timeCity'"
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
              </el-select>
              <el-button
                type="info"
                size="mini"
                @click="clearTimePref"
                :style="statType==='timeCity' ? {'margin': '5px 0 5px 0'} : {'margin': '5px 0 5px 5px'}"
              >
                クリア
              </el-button>
              <el-input
                placeholder="キーワード検索"
                v-model="c_filterText"
              />
            </div>
            <div class="tree-div">
              <el-tree
                :ref="el.ref"
                node-key="statId"
                show-checkbox
                :check-on-click-node="true"
                :check-strictly="true"
                :data="statType==='timePref' ? s_eStatMetaPreh : s_eStatMetaCity"
                @check="nodeClickEstatTime(arguments[0], el.statType)"
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
        prefDiv: [
          {id: '00', statType: 'pref', ref: 'treePref'},
          {id: '01', statType: 'scatterPref', ref: 'tresscatterPref'}
          ],
        cityDiv: [
          {id: '11', statType: 'city', ref: 'treeCity'},
          {id: '12', statType: 'scatterCity', ref: 'tresscatterCity'}
        ],
        timeDiv: [
          {id: '21', statType: 'timePref', ref: 'treeTimePref'},
          {id: '22', statType: 'timeCity', ref: 'treeTimeCity'}
        ],
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
      c_filterText: {
        get () {
          switch (this.statType) {
            case 'pref':
              return this.filterTextPref;
            case 'scatterPref':
              return this.filterTextPrefScatter;
            case 'city':
              return this.filterTextCity;
            case 'scatterCity':
              return this.filterTextCityScatter;
            case 'timePref':
              return this.filterTextPrefTime;
            case 'timeCity':
              return this.filterTextCityTime;
            default:
              return 'error'
          }
        },
        set (value) {
          switch (this.statType) {
            case 'pref':
              this.filterTextPref = value;
              break;
            case 'scatterPref':
              this.filterTextPrefScatter = value;
              break;
            case 'city':
              this.filterTextCity = value;
              break;
            case 'scatterCity':
              this.filterTextCityScatter = value;
              break;
            case 'timePref':
              this.filterTextPrefTime = value;
              break;
            case 'timeCity':
              this.filterTextCityTime = value;
              break;
          }
        }
      },
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
        const options = this.s_prefOptions.map(value => {
          if (value) return value
        });
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
      prefChange (prefCode, statType) {
        if (statType !== 'timePref') {
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
        }
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
        this.filterTextPrefScatter = '';
        d3.select('#left-chart-div').selectAll('.chart-svg').remove()
      },
      clearTimePref () {
        this.$store.commit('statList/eStatMetaPrehReset');
        this.$store.commit('statList/eStatMetaCityReset');
        this.filterTextPrefTime = '';
        this.filterTextCityTime = '';
        d3.select('#left-chart-div').selectAll('.chart-svg').remove()
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
      nodeClickEstatTime (e, scatType) {
        if (!e.children) {
          const refs = scatType === 'timePref' ? this.$refs.treeTimePref : this.$refs.treeTimeCity;
          const keys = refs[0].getCheckedKeys(); //何故か配列になる。原因不明。
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
            refs[0].setCheckedKeys(newKeys);
            return;
          }
          this.$store.commit('statList/transitionSet', true);
          if (scatType === 'timePref') {
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
      filterTextPref(val) { this.$refs.treePref[0].filter(val) }, // 何故配列になる？
      filterTextPrefScatter(val) { this.$refs.tresscatterPref[0].filter(val) },
      filterTextPrefTime(val) { this.$refs.treeTimePref[0].filter(val) },
      filterTextCity(val) { this.$refs.treeCity[0].filter(val) },
      filterTextCityScatter(val) { this.$refs.tresscatterCity[0].filter(val) },
      filterTextCityTime(val) { this.$refs.treeTimeCity[0].filter(val) },
    },
    mounted () {
      this.$nextTick(function () {
        this.prefChange('45000');
        this.cityCode = '45201'
      })
    }
  }
</script>
