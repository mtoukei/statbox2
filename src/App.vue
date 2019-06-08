<template>
  <div id="app">
    <!--非表示のもの色々-->
    <v-dialogs :statType="statType"></v-dialogs>
    <div class="d3-tooltip"></div>
    <!--ヘッダー-->
    <el-menu id="header-menu"
             :default-active="activeIndex"
             mode="horizontal"
             @select="headerMenuSelect"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#03a9f4">
      <el-menu-item index="home">新統計BOX（試作版）</el-menu-item>
      <el-submenu index="2">
        <template slot="title">宮崎県市町村</template>
        <el-menu-item index="miyazakiCity">いろんなグラフで見える化</el-menu-item>
        <!--<el-menu-item index="double">２市町村を比較</el-menu-item>-->
        <el-menu-item index="scatter">散布図で見える化</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">全国都道府県</template>
        <el-menu-item index="pref">いろんなグラフで見える化</el-menu-item>
        <el-menu-item index="scatterPref">散布図で見える化</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">全国市町村</template>
        <el-menu-item index="city">いろんなグラフで見える化</el-menu-item>
        <el-menu-item index="scatterCity">散布図で見える化</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">時系列</template>
        <el-menu-item index="time">宮崎県を時系列で見える化</el-menu-item>
        <el-menu-item index="timePref">全国の都道府県を時系列で見える化</el-menu-item>
        <el-menu-item index="timeCity">全国の市町村を時系列で見える化</el-menu-item>
      </el-submenu>
    </el-menu>
    <!--左サイド-->
    <div id="left-side-div">
      <div class='resizers'>
        <div class='resizer right'>
          <div class='resizer-inner'>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <v-sideTree class="v-tree" side="leftSide" :statType="statType"/>
      </div>
      <resize-observer @notify="detectResize" />
    </div>
    <!--メイン部。グラフ表示部分-->
    <div id="contents">
      <Watch></Watch>
      <div id="left-chart-div">
        <!--都道府県用スライダー-->
        <div class="pref-top" v-show="activeIndex==='pref'">
          <span id="year-range-text-pref"></span>
          <div class="year-range-div">
            <input type="range" id="year-range-pref"  v-model="s_yearRangePref" list="year-range-list"/>
            <div id="year-range-ticks-pref"></div>
          </div>
        </div>
        <!--市町村用スライダー-->
        <div class="pref-top" v-show="activeIndex==='city'">
          <span id="year-range-text-city"></span>
          <div class="year-range-div">
            <input type="range" id="year-range-city"  v-model="s_yearRangeCity" list="year-range-list"/>
            <div id="year-range-ticks-city"></div>
          </div>
        </div>
        <!--グラフのダイアログー-->
        <draggable v-model="leftDivList" handle=".chart-div-handle">
          <transition-group appear>
            <div :id="'left-' + el.divId" :class="'laft-chart ' +  el.class" v-for="el in leftDivList" :key="el.order" v-show="el.show"
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
    <div id="right-side-div" v-show="rightSideDivShow">
      <div class='resizers'>
        <div class='resizer left'>
          <div class='resizer-inner'>
            <i class="el-icon-arrow-left"></i>
          </div>
        </div>
        <v-sideTree class="v-tree" side="rightSide" :statType="statType"/>
      </div>
      <resize-observer @notify="detectResize" />
    </div>
    <!--フッター-->
    <div id="footer">
      <div class='resizers'>
        <div class='resizer top'>
          <i class="el-icon-arrow-up"></i><span style="padding: 0 20px 0 20px">メタ情報＋テーブル</span><i class="el-icon-arrow-up"></i>
        </div>
        <div style="padding-top: 40px">
          <v-bottom :statType="statType"/>
        </div>
      </div>
      <resize-observer @notify="detectResize" />
    </div>
  </div>
</template>

<script>
  // グラフの種類を増やすときはここに追加する。
  const Div = [
    {order: 0, statType:'miyazakiCity', divId: 'bar-miyazaki-city', class: 'large1-chart-div', name: '棒グラフ', show: true, rightSide: false},
    {order: 1 ,statType:'miyazakiCity', divId: 'rank-miyazaki-city', class: 'normal-chart-div', name: 'ランキング', show: true, rightSide: false},
    {order: 2 ,statType:'miyazakiCity', divId: 'bubble-miyazaki-city', class: 'normal-chart-div', name: 'バブル', show: true, rightSide: false},
    {order: 3, statType:'miyazakiCity', divId: 'map-miyazaki-city', class: 'normal-chart-div', name: '地図', show: true, rightSide: false},
    {order: 4, statType:'miyazakiCity', divId: 'pie-miyazaki-city', class: 'normal-chart-div', name: '円グラフ', show: true, rightSide: false},
    {order: 5, statType:'miyazakiCity', divId: 'tree-miyazaki-city', class: 'normal-chart-div', name: 'ツリーマップ', show: true, rightSide: false},
    {order: 6 ,statType:'miyazakiCity', divId: 'histogram-miyazaki-city', class: 'normal-chart-div', name: 'ヒストグラム', show: true, rightSide: false},
    {order: 7, divId: 'time', class: 'large2-chart-div', name: '宮崎県時系列', show: false, rightSide: false},
    {order: 8, divId: 'timePref', class: 'large2-chart-div', name: '都道府県時系列', show: false, rightSide: false},
    {order: 9, divId: 'timeCity', class: 'large2-chart-div', name: '市町村時系列', show: false, rightSide: false},
    {order: 10, divId: 'scatter', class: 'large2-chart-div', name: '散布図', contents: '左右から選択してください。', show: false, rightSide: true},
    {order: 11, divId: 'scatterPref', class: 'large3-chart-div', name: '散布図 e-Stat(社会・人口統計体系)', contents: '左右から選択してください。', show: false, rightSide: true},

    {order: 12, statType:'city', divId: 'bar-city', class: 'large1-chart-div', name: '棒グラフ', show: false, rightSide: false},
    {order: 13 ,statType:'city', divId: 'rank-city', class: 'normal-chart-div', name: 'ランキング', show: false, rightSide: false},
    {order: 14 ,statType:'city', divId: 'bubble-city', class: 'normal-chart-div', name: 'バブル', show: false, rightSide: false},
    {order: 15 ,statType:'city', divId: 'map-city', class: 'normal-chart-div', name: '地図', show: false, rightSide: false},
    {order: 16, statType:'city', divId: 'pie-city', class: 'normal-chart-div', name: '円グラフ', show: false, rightSide: false},
    {order: 17 ,statType:'city', divId: 'histogram-city', class: 'normal-chart-div', name: 'ヒストグラム', show: false, rightSide: false},
    {order: 18, divId: 'scatterCity', class: 'large3-chart-div', name: '散布図 e-Stat(社会・人口統計体系)2', contents: '左右から選択してください。', show: false, rightSide: true},
    {order: 19, statType:'city', divId: 'time-city', class: 'large1-chart-div', name: '時系列', show: false, rightSide: false},

    {order: 20, statType:'pref', divId: 'bar-pref', class: 'large1-chart-div', name: '棒グラフ', show: false, rightSide: false},
    {order: 21 ,statType:'pref', divId: 'rank-pref', class: 'normal-chart-div', name: 'ランキング', show: false, rightSide: false},
    {order: 22 ,statType:'pref', divId: 'bubble-pref', class: 'normal-chart-div', name: 'バブル', show: false, rightSide: false},
    {order: 23, statType:'pref', divId: 'map-pref', class: 'normal-chart-div', name: '地図', show: false, rightSide: false},
    {order: 24, statType:'pref', divId: 'map77-pref', class: 'normal-chart-div', name: 'カラム地図', show: false, rightSide: false},
    {order: 25, statType:'pref', divId: 'pie-pref', class: 'normal-chart-div', name: '円グラフ', show: false, rightSide: false},
    {order: 26, statType:'pref', divId: 'tree-pref', class: 'normal-chart-div', name: 'ツリーマップ', show: false, rightSide: false},
    {order: 27 ,statType:'pref', divId: 'histogram-pref', class: 'normal-chart-div', name: 'ヒストグラム', show: false, rightSide: false},
    {order: 28, statType:'pref', divId: 'time-pref', class: 'large1-chart-div', name: '時系列', show: false, rightSide: false},
  ];
  import sideTree from './components/side-tree'
  import bottom from './components/bottom'
  import dialogs from './components/dialogs'
  import draggable from 'vuedraggable'
  import resizableDiv from './otherjs/resizablediv'
  import Watch from './components/watch'
  export default {
    name: 'app',
    components: {
      Watch,
      'v-sideTree': sideTree,
      'v-dialogs': dialogs,
      'v-bottom': bottom,
      draggable
    },
    data() {
      return {
        timer: false,
        menuChange: true,
        chartDivLoading: false,
        activeIndex: 'miyazakiCity',
        statType: 'miyazakiCity',
        rightSideDivShow: false,
        leftDivList: Div,
        rightDivList: Div,
        timeLength: 0,
      }
    },
    computed: {
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
      // リサイズ検知----------------------------------------------------------------------------
      detectResize () {
        this.$nextTick(function () {
          const bodyHeight = document.body.clientHeight;
          const bodyWidth = document.body.clientWidth;
          const headerHeight = document.querySelector('#header-menu').clientHeight;
          const footerHeight = document.querySelector('#footer').clientHeight;
          const resizersLeft = document.querySelector('.resizers .resizer.left');
          const resizersRight = document.querySelector('.resizers .resizer.right');
          const treeDivs  = document.querySelectorAll('.tree-div');
          const leftSideDivWidth = document.querySelector('#left-side-div').clientWidth;
          const rightSideDivWidth = document.querySelector('#right-side-div').clientWidth;
          const vTreeLefts  = document.querySelectorAll('#left-side-div' + ' .v-tree');
          const vTreeRights  = document.querySelectorAll('#right-side-div' + ' .v-tree');
          const contents = document.querySelector('#contents');
          // 高さ設定。画面ボトムのリサイズ-------------------------------------------------------
          for (let i in treeDivs) {
            if (treeDivs[i].style) treeDivs[i].style.height = (bodyHeight - footerHeight - 120) + 'px';
          }
          resizersLeft.style.height = (bodyHeight - footerHeight - headerHeight) + 'px';
          resizersRight.style.height = (bodyHeight - footerHeight - headerHeight) + 'px';
          contents.style.height = (bodyHeight - footerHeight - headerHeight) + 'px';
          document.querySelector('#footer-inner-left').style.height = (footerHeight - 40) + 'px';
          // 幅設定。左右サイドのリサイズ---------------------------------------------------------
          vTreeLefts[0].style.width = (leftSideDivWidth-30) + 'px';
          vTreeRights[0].style.width = (rightSideDivWidth-30) + 'px';
          contents.style.left = leftSideDivWidth + 'px';
          if (this.rightSideDivShow) {
            contents.style.width = (bodyWidth - leftSideDivWidth - rightSideDivWidth) + 'px';
          } else {
            contents.style.width = (bodyWidth - leftSideDivWidth) + 'px';
          }
          // グラフの幅、高さ設定-----------------------------------------------------------------
          if (this.statType === 'time') {
            document.querySelector('#left-time').style.width = (bodyWidth - leftSideDivWidth - 20) + 'px';
            document.querySelector('#left-time').style.height = (bodyHeight - footerHeight - 120) + 'px';
          }
          if (this.statType === 'timePref') {
            document.querySelector('#left-timePref').style.width = (bodyWidth - leftSideDivWidth - 20) + 'px';
            document.querySelector('#left-timePref').style.height = (bodyHeight - footerHeight - 120) + 'px';
          }
          if (this.statType === 'timeCity') {
            document.querySelector('#left-timeCity').style.width = (bodyWidth - leftSideDivWidth - 20) + 'px';
            document.querySelector('#left-timeCity').style.height = (bodyHeight - footerHeight - 120) + 'px';
          }
          if (this.statType === 'scatterPref') {
            document.querySelector('#left-scatterPref').style.width = (bodyWidth - leftSideDivWidth - rightSideDivWidth - 20) + 'px';
            document.querySelector('#left-scatterPref').style.height = (bodyHeight - footerHeight - 200) + 'px';
          }
          if (this.statType === 'scatter') {
            document.querySelector('#left-scatter').style.width = (bodyWidth - leftSideDivWidth - rightSideDivWidth - 20) + 'px';
            document.querySelector('#left-scatter').style.height = (bodyHeight - footerHeight - 200) + 'px';
          }
        })
      },
      // グラフダイアログのリライズ検知-------------------------------------------------------------
      chartDivDetectResize () {
        const vm = this;
        if (!vm.menuChange) {
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
      // ヘッダーメニュー--------------------------------------------------------------------------
      headerMenuSelect(key) {
        const vm = this;
        const divList = vm.leftDivList;
        vm.menuChange = true;// トランジションをさせない
        if (key === 'home') {
          location.reload();
        } else if (key === 'miyazakiCity' || key === 'pref') {
          vm.statType = key;
          vm.activeIndex = key;
          for (let i in divList) {
            divList[i].show = divList[i].statType === key;
          }
          vm.rightSideDivShow = false;
          this.detectResize();
        } else if (key === 'city') {
          vm.statType = key;
          vm.activeIndex = key;
          for (let i in divList) {
            divList[i].show = divList[i].statType === key;
          }
          vm.rightSideDivShow = false;
          this.detectResize();
        } else {
          vm.statType = key;
          vm.activeIndex = key;
          for (let i in divList) {
            if (divList[i].divId === key) {
              divList[i].show = true;
              vm.rightSideDivShow = divList[i].rightSide;
            } else {
              divList[i].show =false
            }
          }
          this.detectResize();
        }
        // 「トランジションをさせる」にもどす。
        setTimeout(() => {
          vm.menuChange = false;
        }, 1000);
      },
    },
    // tokei2262
    // beforeCreate () {
    //   // const targets = [this.$store.state.statList.eStatMetaPreh, this.$store.state.statList.eStatMetaCity]
    //   const targets = [this.$store.state.statList.eStatMetaPreh]
    //   const vm = this;
    //   for (let h in targets) {
    //     const target = targets[h]
    //     const plomises = [];
    //     let count = 0;
    //     for (let i in target) {
    //       for (let j in target[i].children) {
    //         const statId = target[i].children[j].statId;
    //         vm.$store.commit('base/chartDivLoadingShow', true);
    //         plomises[count] =  new Promise(function(resolve) {
    //           axios({
    //             method: 'get',
    //             url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getMetaInfo',
    //             params: {
    //               statsDataId: statId,
    //               appId: eStatApiId
    //             }
    //           })
    //           .then(response => {
    //             const classObjs = response.data['GET_META_INFO']['METADATA_INF']['CLASS_INF']['CLASS_OBJ'];
    //             const cat01s = classObjs.find(val => val['@id'] === 'cat01').CLASS;
    //             resolve({statId: statId, cat01s: cat01s})
    //           });
    //         });
    //         count++;
    //       }
    //     }
    //     Promise.all(plomises).then(function (result) {
    //       for (let i in result) {
    //         const childrenArr = [];
    //         if (result[i].cat01s.length) {
    //           for (let j in result[i].cat01s) {
    //             const tgt = result[i].cat01s[j];
    //             childrenArr.push({
    //               statId: result[i].statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
    //               label: tgt['@name'].split('_')[1],
    //               cat01: tgt['@code'],
    //               unit: tgt['@unit']
    //             });
    //           }
    //         } else {
    //           const tgt = result[i].cat01s;
    //           childrenArr.push({
    //             statId: result[i].statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
    //             label: tgt['@name'].split('_')[1],
    //             cat01: tgt['@code'],
    //             unit: tgt['@unit']
    //           });
    //         }
    //         for (let j in target) {
    //           target[j].children.find((value, index, array) => {
    //             if (value.statId === result[i].statId) {
    //               array[index].children = childrenArr
    //             }
    //           });
    //         }
    //       }
    //       vm.$store.commit('base/chartDivLoadingShow', false);
    //       console.log(33333)
    //       console.log(target)
    //       console.log(JSON.stringify(target))
    //     })
    //   }
    // },
    mounted () {
      this.$nextTick(function () {
        const vm = this;
        window.onresize = () =>  vm.detectResize();
        // divにリサイズ機能を付与---------------------------------------------------------------
        resizableDiv('#left-side-div');
        resizableDiv('#right-side-div');
        resizableDiv('#footer');
        for (let i in this.leftDivList) {
          const  divId = '#left-' + this.leftDivList[i].divId;
          resizableDiv(divId);
        }
        setTimeout(() => {
          vm.menuChange = false;
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
