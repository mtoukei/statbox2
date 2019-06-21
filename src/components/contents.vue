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
            v-if="s_activeIndex==='pref'"
            type="range"
            class="year-range"
            v-model="s_yearRangePref"
          >
          <input
            v-if="s_activeIndex==='city'"
            type="range"
            class="year-range"
            v-model="s_yearRangeCity"
          >
          <input
            v-if="s_activeIndex==='scatterPref'"
            type="range"
            class="year-range"
            v-model="s_yearRangeScatterPref"
          >
          <input
            v-if="s_activeIndex==='scatterCity'"
            type="range"
            class="year-range"
            v-model="s_yearRangeScatterCity"
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
      s_menuChange () { return this.$store.state.base.menuChange },
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
      s_yearRangeScatterCity: {
        get () { return this.$store.state.statList.yearRangeScatterCity },
        set (value) { this.$store.commit('statList/yearRangeScatterCityChange', value) }
      },
      s_yearRangeScatterPref: {
        get () { return this.$store.state.statList.yearRangeScatterPref },
        set (value) { this.$store.commit('statList/yearRangeScatterPrefChange', value) }
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
