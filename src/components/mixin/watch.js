// ミックスイン。watchが長くなるのでミックスインで外に出した。
import Bubble from '../../chart/bubble'
import Bar from '../../chart/bar'
import Map from '../../chart/map'
import Pie from '../../chart/pie'
import Tree from '../../chart/tree'
import Scatter from '../../chart/scatter'
import Histogram from '../../chart/histogram'
import Time from '../../chart/time'
import Maps77 from '../../chart/maps77'
import Rank from '../../chart/rank'
import Time2 from '../../chart/time2'
import BoxProt from '../../chart/boxprot'
export default {
  name: 'watch',
  computed: {
    s_ssData () { return this.$store.state.base.ssData },
    s_targetCitycode () { return this.$store.state.base.targetCitycode },
    s_chartDivLoading () { return this.$store.state.base.chartDivLoading },
    c_centerDivStyle () { return this.centerDivStyle },
    s_leftStat () { return this.$store.state.statList.leftStat },
    s_rightStat () { return this.$store.state.statList.rightStat },
    s_leftStatTime () { return this.$store.state.statList.leftStatTime },
    s_leftStatTimePref () { return this.$store.state.statList.leftStatTimePref },
    s_leftStatTimeCity () { return this.$store.state.statList.leftStatTimeCity },
    s_leftStatEstatPref () { return this.$store.state.statList.leftStatEstatPref },
    s_rightStatEstatPref () { return this.$store.state.statList.rightStatEstatPref },
    s_leftStatEstatCity () { return this.$store.state.statList.leftStatEstatCity },
    s_rightStatEstatCity () { return this.$store.state.statList.rightStatEstatCity },
  },
  watch: {
    s_targetCitycode: {
      handler: function (val) {
        // 棒グラフのカレント行色塗りと同時に偏差値計算------------------------------------------
        ['pref', 'city', 'miyazaki'].forEach(prefOrCity => {
          // 最初に偏差値をクリア（XX）
          d3.select('.standard-score-text-' + prefOrCity).text('偏差値＝XX');
          // selectAllでループ
          d3.selectAll('.bar-rect-' + prefOrCity).attr('fill', d => {
            const isTarget = String(d.citycode) === String(val[prefOrCity]);
            // 偏差値計算------------------------------------------------------------------------
            if (isTarget) {
              d3.select('.standard-score-text-' + prefOrCity)
              .text(`偏差値＝${d.standardScore.toLocaleString()}`)
              .attr('fill', 'red')
              .transition()
              .duration(1000)
              .attr('fill', 'black')
            }
            // ------------------------------------------------------------------------------------
            if (d.data >= 0) return isTarget ? 'orange' : 'slategray';
            return isTarget ? 'orange' : 'coral';
          });
          // ランキングのカレント行色塗り-----------------------------------------------------------
          d3.selectAll('.rank-rect-' + prefOrCity).attr('fill', d => {
            const isTarget = String(d.citycode) === String(val[prefOrCity]);
            return isTarget ? 'orange' : d.rgb;
          });
          // バブルのカレント行色塗り--------------------------------------------------------------
          d3.selectAll('.bubble-circle-' + prefOrCity).attr('fill', d => {
            const isTarget = String(d.data.citycode) === String(val[prefOrCity]);
            return isTarget ? 'orange' : d.rgb;
          });
          // マップのカレント行色塗り--------------------------------------------------------------
          d3.selectAll('.map-path-' + prefOrCity).attr('stroke', d => {
            const isTarget = String(d.properties.citycode) === String(val[prefOrCity]);
            return isTarget ? 'orange' : 'gray';
          });
          d3.selectAll('.map-path-' + prefOrCity).attr('stroke-width', d => {
            const isTarget = String(d.properties.citycode) === String(val[prefOrCity]);
            return isTarget ? '3px' : '0.2px';
          });
          // 円グラフのカレント行色塗り------------------------------------------------------------
          d3.selectAll('.pie-path-' + prefOrCity).attr('stroke', d => {
            const isTarget = String(d.data.citycode) === String(val[prefOrCity]);
            if ((d.data.data !== 0)) return isTarget ? 'orange' : 'whitesmoke';
          });
          d3.selectAll('.pie-path-' + prefOrCity).attr('stroke-width', d => {
            const isTarget = String(d.data.citycode) === String(val[prefOrCity]);
            if ((d.data.data !== 0)) return isTarget ? '8px' : 0;
          });
          // ツリーマップのカレント行色塗り-----------------------------------------------------------
          d3.selectAll('.tree-rect-' + prefOrCity).attr('fill', d => {
            const isTarget = String(d.data.citycode) === String(val[prefOrCity]);
            return isTarget ? 'orange' : d.parent.data.color;
          });
          // 箱ひげ図のカレント行色塗り-----------------------------------------------------------
          d3.selectAll('.box-circle-' + prefOrCity).attr('fill', d => {
            const isTarget = String(d.citycode) === String(val[prefOrCity]);
            return isTarget ? 'orange' : 'white';
          });
          d3.selectAll('.box-circle-' + prefOrCity).attr('stroke', d => {
            const isTarget = String(d.citycode) === String(val[prefOrCity]);
            return isTarget ? 'orange' : 'black';
          });
        });
      },
      deep: true,
    },
    // 宮崎県市町村用-------------------------------------------------------------------------
    s_leftStat: {
      handler: function(val) {
        // bubble.jsだけにはスライダーの詳細を設定するコードが書かれている。
        Bubble(val, '#left-bubble-city-miyazaki');
        Bar(val, '#left-bar-city-miyazaki');
        BoxProt(val, '#left-box-city-miyazaki');
        Rank(val, '#left-rank-city-miyazaki');
        Map(val, '#left-map-city-miyazaki');
        Pie(val, '#left-pie-city-miyazaki');
        Tree(val, '#left-tree-city-miyazaki');
        Histogram(val, '#left-histogram-city-miyazaki');
        // Scatter(this.s_leftStat, this.s_rightStat);
        Scatter(this.s_leftStat, this.s_rightStat, 'miyazaki', '#left-scatterMiyazaki');
      },
      deep: true,
    },
    // 宮崎県散布図用-------------------------------------------------------------------------
    s_rightStat: {
      handler: function() {
        // Scatter(this.s_leftStat, this.s_rightStat);
        Scatter(this.s_leftStat, this.s_rightStat, 'miyazaki', '#left-scatterMiyazaki');
      },
      deep: true,
    },
    // 全国都道府県用。散布図も---------------------------------------------------------------
    s_leftStatEstatPref: {
      handler: function (val) {
        Bubble(val, '#left-bubble-pref');
        Bar(val, '#left-bar-pref');
        Rank(val, '#left-rank-pref');
        Map(val, '#left-map-pref');
        Maps77(val, '#left-map77-pref');
        Pie(val, '#left-pie-pref');
        Tree(val, '#left-tree-pref');
        Histogram(val, '#left-histogram-pref');
        Time2(val, '#left-time-pref');
        BoxProt(val, '#left-box-pref');
        Scatter(this.s_leftStatEstatPref, this.s_rightStatEstatPref, 'pref', '#left-scatterPref');
      },
      deep: true,
    },
    // 全国都道府県散布図用------------------------------------------------------------------
    s_rightStatEstatPref: {
      handler: function () {
        Scatter(this.s_leftStatEstatPref, this.s_rightStatEstatPref, 'pref', '#left-scatterPref');
      },
      deep: true,
    },
    // 全国市町村用。散布図も-----------------------------------------------------------------
    s_leftStatEstatCity: {
      handler: function (val) {
        Bubble(val, '#left-bubble-city');
        Bar(val, '#left-bar-city');
        Rank(val, '#left-rank-city');
        Map(val, '#left-map-city');
        Pie(val, '#left-pie-city');
        Tree(val, '#left-tree-city');
        Histogram(val, '#left-histogram-city');
        Time2(val, '#left-time-city');
        BoxProt(val, '#left-box-city');
        Scatter(this.s_leftStatEstatCity, this.s_rightStatEstatCity, 'city', '#left-scatterCity');
      },
      deep: true,
    },
    // 全国市町村散布図用--------------------------------------------------------------------
    s_rightStatEstatCity: {
      handler: function () {
        Scatter(this.s_leftStatEstatCity, this.s_rightStatEstatCity, 'city', '#left-scatterCity');
      },
      deep: true,
    },
    // 時系列。宮崎県用------------------------------------------------------------------------
    s_leftStatTime: {
      handler: function(val) {
        Time(val, '#left-time');
      },
      deep: true,
    },
    // 時系列。全国都道府県用-----------------------------------------------------------------
    s_leftStatTimePref: {
      handler: function(val) {
        Time(val, '#left-timePref');
      },
      deep: true,
    },
    // 時系列。全国市町村用-------------------------------------------------------------------
    s_leftStatTimeCity: {
      handler: function(val) {
        Time(val, '#left-timeCity');
      },
      deep: true,
    },
  },

}
