<template>
    <div>
        <!--ヘッダー-->
        <el-menu id="header-menu"
                 :default-active="s_activeIndex"
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
    </div>
</template>

<script>

  export default {
    name: 'header',
    components: {
    },
    data() {
      return {
        menuChange: true,
        // activeIndex: 'miyazakiCity',
        // statType: 'miyazakiCity',
        rightSideDivShow: false,
      }
    },
    computed: {
      s_activeIndex: {
        get () { return this.$store.state.base.activeIndex },
        set (value) { this.$store.commit('base/activeIndexChange', value) }
      },
      s_statType: {
        get () { return this.$store.state.base.statType },
        set (value) { this.$store.commit('base/statTypeChange', value) }
      },
      s_leftDivList () { return this.$store.state.base.leftDivList },
      s_transition () { return this.$store.state.statList.transition },
      s_chartDivLoading () { return this.$store.state.base.chartDivLoading },
    },
    methods: {
      // ヘッダーメニュー--------------------------------------------------------------------------
      headerMenuSelect(key) {
        const vm = this;
        const divList = vm.s_leftDivList;
        vm.menuChange = true;// トランジションをさせない
        if (key === 'home') {
          location.reload();
        } else if (key === 'miyazakiCity' || key === 'pref') {
          vm.$store.commit('base/statTypeChange', key);
          vm.$store.commit('base/activeIndexChange', key);

          for (let i in divList) {
            divList[i].show = divList[i].statType === key;
          }

          vm.rightSideDivShow = false;
          this.detectResize();
        } else if (key === 'city') {
          vm.$store.commit('base/statTypeChange', key);
          vm.$store.commit('base/activeIndexChange', key);

          for (let i in divList) {
            divList[i].show = divList[i].statType === key;
          }

          vm.rightSideDivShow = false;
          this.detectResize();
        } else {
          vm.$store.commit('base/statTypeChange', key);
          vm.$store.commit('base/activeIndexChange', key);

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
    mounted () {
      this.$nextTick(function () {
      });
    }
  }
</script>

<style lang="scss">
</style>

