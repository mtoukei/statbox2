<template>
  <div id="contents">
    <!--最初期時はright-chart-divも存在していた。いずれ復活するかもしれないので名前はこのままに。-->
    <div id="left-chart-div">
      <!--スライダー。細かな設定はbubble.jsでデータを読み込んだときにしている。-->
      <div
        :id="el.id"
        v-for="el in rangeDiv"
        :key="el.id"
        v-show="s_activeIndex===el.statType"
      >
        <span class="year-range-text" />
        <div class="year-range-div">
          <input
            type="range"
            class="year-range"
            v-model="s_yearRange"
          >
          <div class="year-range-ticks" />
        </div>
      </div>
      <!--グラフのダイアログー-->
      <draggable
        v-model="s_leftDivList"
        handle=".chart-div-handle"
      >
        <transition-group>
          <div
            :id="'left-' + el.divId"
            :class="'laft-chart ' + el.class"
            v-for="el in s_leftDivList"
            :key="el.order"
            v-show="el.show"
            v-loading="s_chartDivLoading"
            element-loading-background="rgba(0, 0, 0, 0)"
          >
            <div class="resizers">
              <div class="resizer bottom-right" />
              <resize-observer @notify="chartDivDetectResize(el.divId)" />
              <div class="chart-div-handle">
                {{ el.name }}
                <div style="position: absolute;top:0; right:5px;">
                  <span
                    class="handle-icon"
                    @click="dialogOpen(arguments[0],el,'left')"
                  >保存</span>
                </div>
              </div>
              <div class="chart-contents-div">
                {{ el.contents }}
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: "Contents",
    components: {
      draggable
    },
    data() {
      return {
        rangeDiv: [
          {id: 'year-range-pref', statType: 'pref'},
          {id: 'year-range-city', statType: 'city'},
          {id: 'year-range-scatter-pref', statType: 'scatterPref'},
          {id: 'year-range-scatter-city', statType: 'scatterCity'}
        ],
        timer: false,
      }
    },
    computed: {
      s_yearRange: {
        get () {
          const statType = this.s_activeIndex;
          let range;
          switch (statType) {
            case 'pref':
              range = this.$store.state.statList.yearRangePref;
              break;
            case 'scatterPref':
              range = this.$store.state.statList.yearRangeScatterPref;
              break;
            case 'city':
              range = this.$store.state.statList.yearRangeCity;
              break;
            case 'scatterCity':
              range = this.$store.state.statList.yearRangeScatterCity;
              break;
          }
          return range
        },
        set (value) {
          const statType = this.s_activeIndex;
          let commit;
          switch (statType) {
            case 'pref':
              commit = 'statList/yearRangePrefChange';
              break;
            case 'city':
              commit = 'statList/yearRangeCityChange';
              break;
            case 'scatterPref':
              commit = 'statList/yearRangeScatterPrefChange'
              break;
            case 'scatterCity':
              commit = 'statList/yearRangeScatterCityChange'
              break;
          }
          this.$store.commit(commit, value)
        }
      },
      s_menuChange () { return this.$store.state.base.menuChange },
      s_activeIndex () { return this.$store.state.base.activeIndex },
      s_leftDivList: {
        get () { return this.$store.state.base.leftDivList },
        set (value) { this.$store.commit('base/leftDivListChange', value) }
      },
      s_chartDivLoading () { return this.$store.state.base.chartDivLoading },
    },
    methods: {
      dialogOpen (e, el) {
        this.$store.commit('base/dialogVisibleChange', {visible: true, target: el.divId})
      },
      // グラフダイアログのリサイズ検知-------------------------------------------------------------
      chartDivDetectResize () {
        const vm = this;
        if (!vm.s_menuChange) {
          // 連続でのリサイズを抑制する。
          if (vm.timer) {
            clearTimeout(vm.timer);
          }
          vm.timer = setTimeout(() => {
            vm.$store.commit('statList/transitionSet', false);
            vm.$store.commit('statList/statReload', 'left');
            vm.$store.commit('statList/statReload', 'right');
            vm.$store.commit('statList/eStatReload', {side: 'left'});
            vm.$store.commit('statList/timeReload');
            vm.$store.commit('statList/timePrefReload');
            vm.$store.commit('statList/timeCityReload');
          }, 50);
        }
      },
    },
  }
</script>
