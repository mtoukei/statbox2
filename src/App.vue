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
  // import mixinMetadataCreate from './components/mixin/metadata-create'
  import mixinWatch from './components/mixin/watch'
  export default {
    name: 'app',
    components: {
      contents,
      'header-menu': header,
      'footer-info': footer,
      sideTree,
      dialogs
    },
    // mixins: [mixinDetectResize, mixinMetadataCreate, mixinWatch],
    mixins: [mixinDetectResize, mixinWatch],
    computed: {
      s_rightSideDivShow () { return this.$store.state.base.rightSideDivShow },
      s_statType () { return this.$store.state.base.statType },
      s_leftDivList () { return this.$store.state.base.leftDivList }
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
          resizableDiv('#left-' + this.s_leftDivList[i].divId);
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
