id="year-range-ticks-pref"とid="year-range-ticks-city"は
bubble.jsでtickを引いている。
<template>
    <div id="contents">
        <div id="left-chart-div">
            <!--都道府県用スライダー-->
            <div class="pref-top" v-show="s_activeIndex==='pref'">
                <span id="year-range-text-pref"></span>
                <div class="year-range-div">
                    <input type="range" id="year-range-pref"  v-model="s_yearRangePref"/>
                    <div id="year-range-ticks-pref" class="year-range-ticks"></div>
                </div>
            </div>
            <!--市町村用スライダー-->
            <div class="pref-top" v-show="s_activeIndex==='city'">
                <span id="year-range-text-city"></span>
                <div class="year-range-div">
                    <input type="range" id="year-range-city"  v-model="s_yearRangeCity"/>
                    <div id="year-range-ticks-city" class="year-range-ticks"></div>
                </div>
            </div>

            <!--都道府県散布図用スライダー-->
            <div class="pref-top" v-show="s_activeIndex==='scatterPref'">
                <span id="year-range-text-scatter-pref"></span>
                <div class="year-range-div">
                    <input type="range" id="year-range-scatter-pref"  v-model="s_yearRangePref"/>
                    <div id="year-range-ticks-scatter-pref" class="year-range-ticks"></div>
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
</template>
<script>
  import draggable from 'vuedraggable'
  export default {
    name: "contents",
    components: {
      draggable
    },
    data() {
      return {
        timer: false,
      }
    },
    computed: {
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
  }
</script>

