<template>
  <div id="app">
    <!--非表示のもの色々-->
    <dialogs :statType="s_statType"></dialogs>
    <div class="d3-tooltip"></div>
    <!--ヘッダー-->
    <header-menu/>
    <!--左サイド-->
    <div id="left-side-div">
      <div class='resizers'>
        <div class='resizer right'>
          <div class='resizer-inner'>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <sideTree class="v-tree" side="leftSide" :statType="s_statType"/>
      </div>
      <resize-observer @notify="mix_detectResize" />
    </div>
    <!--メイン部。グラフ表示部分-->
    <div id="contents">
      <div id="left-chart-div">
        <!--都道府県用スライダー-->
        <div class="pref-top" v-show="s_activeIndex==='pref'">
          <span id="year-range-text-pref"></span>
          <div class="year-range-div">
            <input type="range" id="year-range-pref"  v-model="s_yearRangePref" list="year-range-list"/>
            <div id="year-range-ticks-pref"></div>
          </div>
        </div>
        <!--市町村用スライダー-->
        <div class="pref-top" v-show="s_activeIndex==='city'">
          <span id="year-range-text-city"></span>
          <div class="year-range-div">
            <input type="range" id="year-range-city"  v-model="s_yearRangeCity" list="year-range-list"/>
            <div id="year-range-ticks-city"></div>
          </div>
        </div>
        <!--グラフのダイアログー-->
        <draggable v-model="s_leftDivList" handle=".chart-div-handle">
          <transition-group appear>
            <div :id="'left-' + el.divId" :class="'laft-chart ' +  el.class" v-for="el in s_leftDivList" :key="el.order" v-show="el.show"
                 v-loading="s_chartDivLoading"
                 element-loading-background="rgba(0, 0, 0, 0)"
            >
              <div class='resizers'>
                <div class='resizer bottom-right'></div>
                <resize-observer @notify="chartDivDetectResize(el.divId)" />
                <div class="chart-div-handle">
                  {{ el.name}}
                  <div style="position: absolute;top:0; right:5px;">
                    <span class="handle-icon" @click="dialogOpen(arguments[0],el,'left')">保存</span>
                    <!--<span class="el-icon-close handle-icon" @click="chartClose(arguments[0],el)" ></span>-->
                  </div>
                </div>
                <div class="chart-contents-div">{{ el.contents}}</div>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
    <!--右サイド-->
    <div id="right-side-div" v-show="s_rightSideDivShow">
      <div class='resizers'>
        <div class='resizer left'>
          <div class='resizer-inner'>
            <i class="el-icon-arrow-left"></i>
          </div>
        </div>
        <sideTree class="v-tree" side="rightSide" :statType="s_statType"/>
      </div>
      <resize-observer @notify="mix_detectResize" />
    </div>
    <!--フッター-->
    <div id="footer">
      <div class='resizers'>
        <div class='resizer top'>
          <i class="el-icon-arrow-up"></i><span style="padding: 0 20px 0 20px">メタ情報＋テーブル</span><i class="el-icon-arrow-up"></i>
        </div>
        <div style="padding-top: 40px">
          <bottom :statType="s_statType"/>
        </div>
      </div>
      <resize-observer @notify="mix_detectResize" />
    </div>
  </div>
</template>

<script>
  import header from './components/header'
  import sideTree from './components/side-tree'
  import bottom from './components/bottom'
  import dialogs from './components/dialogs'
  import draggable from 'vuedraggable'
  import resizableDiv from './otherjs/resizablediv'
  import mixinDetectResize from './components/mixin/detectResize'
  import mixinMetadataCreate from './components/mixin/metadata-create'
  import mixinWatch from './components/mixin/watch'
  export default {
    name: 'app',
    components: {
      'header-menu': header,
      sideTree,
      dialogs,
      bottom,
      draggable
    },
    mixins: [mixinDetectResize, mixinMetadataCreate, mixinWatch],
    data() {
      return {
        timer: false,
        chartDivLoading: false,
        timeLength: 0,
      }
    },
    computed: {
      s_rightSideDivShow () { return this.$store.state.base.rightSideDivShow },
      s_menuChange () { return this.$store.state.base.menuChange },
      s_statType () { return this.$store.state.base.statType },
      s_activeIndex () { return this.$store.state.base.activeIndex },
      s_leftDivList: {
        get () { return this.$store.state.base.leftDivList },
        set (value) { this.$store.commit('base/leftDivListChange', value) }
      },
      s_yearRangeCity: {
        get () { return this.$store.state.statList.yearRangeCity },
        set (value) { this.$store.commit('statList/yearRangeCityChange', value) }
      },
      s_yearRangePref: {
        get () { return this.$store.state.statList.yearRangePref },
        set (value) { this.$store.commit('statList/yearRangePrefChange', value) }
      },
      s_transition () { return this.$store.state.statList.transition },
      s_chartDivLoading () { return this.$store.state.base.chartDivLoading },
    },
    methods: {
      // ダイアログ-------------------------------------------------------------------------------
      dialogOpen (e,el) {
        this.$store.commit('base/dialogVisibleChange', {visible: true,target: el.divId})
      },
      // グラフダイアログのリライズ検知-------------------------------------------------------------
      chartDivDetectResize () {
        const vm = this;
        if (!vm.s_menuChange) {
          // 連続でのリサイズを抑制する。
          if (vm.timer !== false) {
            clearTimeout(vm.timer);
          }
          vm.timer = setTimeout(function() {
            vm.$store.commit('statList/transitionSet', false);
            vm.$store.commit('statList/statReload', 'left');
            vm.$store.commit('statList/statReload', 'right');
            vm.$store.commit('statList/eStatReload', {side: 'left'});
            vm.$store.commit('statList/timeReload');
            vm.$store.commit('statList/timePrefReload');
            vm.$store.commit('statList/timeCityReload');
          }, 10);
        }
      },
    },
    mounted () {
      this.$nextTick(function () {
        const vm = this;
        window.onresize = () =>  vm.mix_detectResize();
        // divにリサイズ機能を付与---------------------------------------------------------------
        resizableDiv('#left-side-div');
        resizableDiv('#right-side-div');
        resizableDiv('#footer');
        for (let i in this.s_leftDivList) {
          const  divId = '#left-' + this.s_leftDivList[i].divId;
          resizableDiv(divId);
        }
        setTimeout(() => {
          vm.$store.commit('base/menuChange', false);
        }, 1500);
      });
    }
  }
</script>

<style lang="scss">
  $footer-height: 30px;
  $header-menu-height: 60px;
  $chart-div-handle-height: 20px;
  $normal-chart-div-size: 300px;
  $large1-chart-div-height: 300px;
  $large1-chart-div-width: 605px;
  $large2-chart-div-height: 600px;
  $large2-chart-div-width: 1200px;
  $large3-chart-div-height: 500px;
  $large3-chart-div-width: 980px;
  html {
    height: 100%;
  }
  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  div {
    box-sizing: border-box;
  }
  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: black;
  }
  // ヘッダー、フッター、サイド---------------------------------------------------------------------
  #header-menu {
    height: $header-menu-height;
    position: fixed;
    width: 100%;
  }
  #footer {
    width: 100%;
    height: $footer-height;
    line-height: $footer-height;
    background-color: #dadada;
    border-top: solid 1px #e6e6e6;
    color: black;
    text-align: center;
    position: fixed;
    bottom: 0;
    z-index: 1;
  }
  #left-side-div, #right-side-div{
    position: absolute;
    top: $header-menu-height;
    width: 200px;
    height: calc(100vh - #{$header-menu-height} - #{$footer-height});
    background-color: #dadada;
  }
  #right-side-div {
    right: 0;
    padding-left: 20px;
  }
  // チャート-------------------------------------------------------------------------------------
  #contents {
    position: absolute;
    top: $header-menu-height;
    left: 200px;
    height: calc(100vh - #{$header-menu-height} - #{$footer-height});
    background-color: whitesmoke;
    overflow: auto;
  }
  #left-chart-div {
    background-color: whitesmoke;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 5px;
  }
  .large3-chart-div, .large2-chart-div, .large1-chart-div, .normal-chart-div {
    margin: 5px 0 0 5px;
    background-color: white;
    border: 1px  solid #d0d0d0;
    display: inline-block;
    vertical-align: top;
    position: relative;
    overflow:hidden;
  }
  .large3-chart-div {
    height: calc(#{$large3-chart-div-height} + #{$chart-div-handle-height});
    width: $large3-chart-div-width;
  }
  .large2-chart-div {
    height: calc(#{$large2-chart-div-height} + #{$chart-div-handle-height});
    width: $large2-chart-div-width;
  }
  .large1-chart-div {
    height: calc(#{$large1-chart-div-height} + #{$chart-div-handle-height});
    width: $large1-chart-div-width;
  }
  .normal-chart-div {
    height: calc(#{$normal-chart-div-size} + #{$chart-div-handle-height});
    width: $normal-chart-div-size;
  }
  .chart-div-handle {
    height: $chart-div-handle-height;
    line-height: $chart-div-handle-height;
    background-color: grey;
    color: white;
    font-size: 14px;
    padding-left: 5px;
    cursor: move;
  }
  .handle-icon {
    margin-left: 5px;
    cursor: pointer;
  }
  .handle-icon:hover {
    color: #03a9f4;
  }
  .pref-top {
    text-align: center;
  }
  // リサイザーズ--------------------------------------------------------------------------------
  .resizers{
    width: 100%;
    height: 100%;
  }
  .resizers .resizer{
    width: 20px;
    height: 10px;
    background: #545c64;
    position: absolute;
    /*border: 3px solid #4286f4;*/
  }
  .resizers .top {
    color: white;
    width: 100%;
    height: calc(#{$footer-height} - 10px);
    line-height: calc(#{$footer-height} - 10px);
    text-align: center;
    cursor: n-resize;
  }
  .resizers .top:hover {
    color: #03a9f4;
  }
  .resizers .resizer.left {
    left: 0;
    top: 0;
    height: 100%;
    cursor: w-resize;
    display: table;
    z-index: 1;
  }
  .resizers .resizer.right {
    right: 0;
    top: 0;
    height: 100%;
    cursor: w-resize;
    display: table;
    z-index: 1;
  }
  .resizers .resizer-inner {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    color: white;
  }
  .resizers .resizer-inner:hover {
    color: #03a9f4;
  }
  .resizers .resizer.top-left {
    left: -5px;
    top: -5px;
    cursor: nwse-resize;
  }
  .resizers .resizer.top-right {
    right: -5px;
    top: -5px;
    cursor: nesw-resize;
  }
  .resizers .resizer.bottom-left {
    left: -5px;
    bottom: -5px;
    cursor: nesw-resize;
  }
  .resizers .resizer.bottom-right {
    background: none;
    right: -5px;
    bottom: -5px;
    cursor: nwse-resize;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 20px 20px;
    border-color: transparent transparent #545c64 transparent;
  }
  .resizers .resizer:hover {
    border-color: transparent transparent #03a9f4 transparent;
  }
  // ツールチップ---------------------------------------------------------------------------------
  .d3-tooltip {
    position: absolute;
    text-align: center;
    width: auto;
    height: auto;
    padding: 5px;
    font-size: 12px;
    background: white;
    border-radius: 4px;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    visibility: hidden;
    z-index: 1;
  }
  // IE11対策。余計なツールチップを非表示に----------------------------------------------------
  input[type=range]::-ms-tooltip {
    display: none;
  }
  // トランジション--------------------------------------------------------------------------------
  .v-enter-active, .v-leave-active {
    transition: all  0.5s;
    /*transition-delay: 1s;*/
  }
  .v-enter, .v-leave-to {
    width: 0;
    height: 0;
  }
  #year-range-text-pref, #year-range-text-city {
    position: absolute;
    top:10px;
    left:30px;
    font-size: 30px;
  }
  .year-range-div {
    margin-left: 120px;
    width: 50%;
  }
  #year-range-ticks-pref, #year-range-ticks-city {
    margin-top: -25px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    padding-right: 8px;
    padding-left: 11px;
  }
  #year-range-ticks-pref .tick, #year-range-ticks-city .tick{
    position: relative;
    display: flex;
    justify-content: center;
    width: 1px;
    background: gray;
    height:10px;
    line-height: 40px;
  }
  .d3-tip {
    font-size: 10px;
    line-height: 1;
    font-weight: normal;
    padding: 6px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 2px;
    pointer-events: none;
    z-index: 99999999;
  }
  /* Creates a small triangle extender for the tooltip */
  .d3-tip:after {
    display: inline;
    font-size: 10px;
    width: 100%;
    line-height: 1;
    color: rgba(0, 0, 0, 0.8);
    position: absolute;
    pointer-events: none;
  }
  /* Northward tooltips */
  .d3-tip.n:after {
    content: "\25BC";
    margin: -2px 0 0 0;
    top: 99%;
    left: 0;
    text-align: center;
  }
  /* Eastward tooltips */
  .d3-tip.e:after {
    content: "\25C0";
    margin: -4px 0 0 0;
    top: 50%;
    left: -8px;
  }
  /* Southward tooltips */
  .d3-tip.s:after {
    content: "\25B2";
    margin: 0 0 1px 0;
    top: -8px;
    left: 0;
    text-align: center;
  }
  /* Westward tooltips */
  .d3-tip.w:after {
    content: "\25B6";
    margin: -4px 0 0 -1px;
    top: 50%;
    left: 100%;
  }
</style>
<style src="./css/range.css"></style>
