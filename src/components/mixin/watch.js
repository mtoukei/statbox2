// ミックスイン。watchが長くなるのでミックスインで外に出した。
import Bubble from '../../chart/bubble'
import Bar from '../../chart/bar'
import Map from '../../chart/map'
import Pie from '../../chart/pie'
import Tree from '../../chart/tree'
import Scatter from '../../chart/scatter'
import ScatterEstat from '../../chart/scatter-estat'
import Histogram from '../../chart/histogram'
import Time from '../../chart/time'
import maps77 from '../../chart/maps77'
import rank from '../../chart/rank'
import Time2 from '../../chart/time2'
export default {
  name: 'watch',
  data() {
    return {
      timeLength: 0,
    }
  },
  computed: {
    s_chartDivLoading () { return this.$store.state.base.chartDivLoading },
    c_centerDivStyle () { return this.centerDivStyle },
    s_leftStat () { return this.$store.state.statList.leftStat },
    s_rightStat () { return this.$store.state.statList.rightStat },
    s_leftStatTime () { return this.$store.state.statList.leftStatTime },
    s_leftStatTimePref () { return this.$store.state.statList.leftStatTimePref },
    // s_rightStatTimePref () { return this.$store.state.statList.rightStatTimePref },
    s_leftStatTimeCity () { return this.$store.state.statList.leftStatTimeCity },
    s_leftStatEstatPref () { return this.$store.state.statList.leftStatEstatPref },
    s_rightStatEstatPref () { return this.$store.state.statList.rightStatEstatPref },
    s_leftStatEstatCity () { return this.$store.state.statList.leftStatEstatCity },
    s_rightStatEstatCity () { return this.$store.state.statList.rightStatEstatCity },
  },
  watch: {
    s_leftStat: {
      handler: function(val) {
        Bubble(val, '#left-bubble-miyazaki-city');
        Pie(val, '#left-pie-miyazaki-city');
        Histogram(val, '#left-histogram-miyazaki-city');
        Bar(val, this.s_rightStat, '#left-bar-miyazaki-city');
        Map(val, '#left-map-miyazaki-city');
        rank(val, '#left-rank-miyazaki-city');
        Tree(val, '#left-tree-miyazaki-city');
      },
      deep: true,
    },
    s_rightStat: {
      handler: function() {
        Scatter(this.s_leftStat, this.s_rightStat);
      },
      deep: true,
    },
    s_leftStatTime: {
      handler: function(val) {
        Time(val, '#left-time');
        this.timeLength = val.statData.length;
      },
      deep: true,
    },
    s_leftStatTimePref: {
      handler: function(val) {
        Time(val, '#left-timePref');
      },
      deep: true,
    },
    s_leftStatTimeCity: {
      handler: function(val) {
        Time(val, '#left-timeCity');
      },
      deep: true,
    },
    s_leftStatEstatPref: {
      handler: function (val) {
        Bubble(val, '#left-bubble-pref');
        Pie(val, '#left-pie-pref');
        Histogram(val, '#left-histogram-pref');
        Bar(val, this.s_rightStat, '#left-bar-pref');
        Map(val, '#left-map-pref');
        rank(val, '#left-rank-pref');
        Tree(val, '#left-tree-pref');
        maps77(val, '#left-map77-pref');
        Time2(val, '#left-time-pref');
        ScatterEstat(this.s_leftStatEstatPref, this.s_rightStatEstatPref, 'pref', '#left-scatterPref');
      },
      deep: true,
    },
    s_rightStatEstatPref: {
      handler: function () {
        ScatterEstat(this.s_leftStatEstatPref, this.s_rightStatEstatPref, 'pref', '#left-scatterPref');
      },
      deep: true,
    },
    s_leftStatEstatCity: {
      handler: function (val) {
        Bubble(val, '#left-bubble-city');
        Pie(val, '#left-pie-city');
        Histogram(val, '#left-histogram-city');
        Bar(val, this.s_rightStat, '#left-bar-city');
        Map(val, '#left-map-city');
        rank(val, '#left-rank-city');
        Time2(val, '#left-time-city');
        ScatterEstat(this.s_leftStatEstatCity, this.s_rightStatEstatCity, 'city', '#left-scatterCity');
      },
      deep: true,
    },
    s_rightStatEstatCity: {
      handler: function () {
        ScatterEstat(this.s_leftStatEstatCity, this.s_rightStatEstatCity, 'city', '#left-scatterCity');
      },
      deep: true,
    },
  },

}
