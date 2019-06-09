<template>
  <div id="app">
    <!--非表示のもの色々-->
    <dialogs :statType="s_statType"></dialogs>
    <div class="d3-tooltip"></div>
    <!--ヘッダー-->
    <header-menu/>
    <!--左サイド-->
    <sideTree  side="leftSide" :statType="s_statType"/>
    <!--メイン部。グラフ表示部分-->
    <contents/>
    <!--右サイド-->
    <sideTree side="rightSide" :statType="s_statType" v-show="s_rightSideDivShow"/>
    <!--フッター-->
    <footer-info :statType="s_statType"/>
  </div>
</template>

<script>
  import header from './components/header'
  import footer from './components/footer'
  import sideTree from './components/side-tree'
  import dialogs from './components/dialogs'
  import resizableDiv from './otherjs/resizablediv'
  import contents from './components/contents'
  import mixinDetectResize from './components/mixin/detectResize'
  import mixinMetadataCreate from './components/mixin/metadata-create'
  import mixinWatch from './components/mixin/watch'
  export default {
    name: 'app',
    components: {
      contents,
      'header-menu': header,
      'footer-info': footer,
      sideTree,
      dialogs,
    },
    mixins: [mixinDetectResize, mixinMetadataCreate, mixinWatch],
    data() {
      return {
        timer: false,
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
      // グラフダイアログのリサイズ検知-------------------------------------------------------------
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
  @import "./css/main";
  @import "./css/range";
  @import "./css/resizers";
  @import "./css/tree";
</style>
