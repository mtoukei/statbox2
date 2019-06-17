<template>
    <div id="footer">
        <div class='resizers'>
            <div class='resizer top'>
                <i class="el-icon-arrow-up"></i><span style="padding: 0 20px 0 20px">メタ情報＋テーブル</span><i class="el-icon-arrow-up"></i>
            </div>
            <div style="padding-top: 40px">
                <!--左サイド-->
                <div id="footer-inner-left">
                    <!-- 都道府県データ-->
                    <div v-show="statType === 'pref' || statType === 'scatterPref'">
                        <div class="bottom-info-div">
                            <table class="source-table">
                                <tr><th>データ名</th><td>{{ s_leftStatNamePref }}</td></tr>
                                <tr><th>statsDataId</th><td>{{ s_leftStatsDataIdPref }}</td></tr>
                                <tr><th>cdCat01</th><td>{{ s_leftCdCat01Pref }}</td></tr>
                                <tr><th>出典</th><td><a href="https://www.stat.go.jp/data/k-sugata/index.html" target="_blank">統計で見る都道府県のすがた</a></td></tr>
                                <tr><th>所在源又は<br>参考資料等</th><td  v-html="s_leftSourcePref"></td></tr>
                            </table>
                        </div>
                        <div class="bottom-table-div">
                            <vue-good-table
                                    :columns="columns"
                                    :rows="m_leftStatEstatPref(statType)"/>
                        </div>
                    </div>
                    <!-- 市町村データ-->
                    <div v-show="statType === 'city' || statType === 'scatterCity' ">
                        <div class="bottom-info-div">
                            <table class="source-table">
                                <tr><th>データ名</th><td>{{ s_leftStatNameCity }}</td></tr>
                                <tr><th>statsDataId</th><td>{{ s_leftStatsDataIdCity }}</td></tr>
                                <tr><th>cdCat01</th><td>{{ s_leftCdCat01City }}</td></tr>
                                <tr><th>出典</th><td><a href="https://www.stat.go.jp/data/s-sugata/index.html" target="_blank">統計で見る市区町村のすがた</a></td></tr>
                                <tr><th>所在源又は<br>参考資料等</th><td  v-html="s_leftSourceCity"></td></tr>
                            </table>
                        </div>
                        <div class="bottom-table-div">
                            <vue-good-table
                                    :columns="columns"
                                    :rows="m_leftStatEstatCity(statType)"/>
                        </div>
                    </div>
                </div>
                <!--右サイド-->
                <div id="footer-inner-right" v-show="statType === 'scatterPref' || statType === 'scatterCity'">
                    <!-- 都道府県データ-->
                    <div v-show="statType === 'scatterPref'">
                        <div class="bottom-info-div">
                            <table class="source-table">
                                <tr><th>データ名</th><td>{{ s_rightStatNamePref }}</td></tr>
                                <tr><th>statsDataId</th><td>{{ s_rightStatsDataIdPref  }}</td></tr>
                                <tr><th>cdCat01</th><td>{{ s_rightCdCat01Pref }}</td></tr>
                                <tr><th>出典</th><td><a href="https://www.stat.go.jp/data/k-sugata/index.html" target="_blank">統計で見る都道府県のすがた</a></td></tr>
                                <tr><th>所在源又は<br>参考資料等</th><td  v-html="s_rightSourcePref"></td></tr>
                            </table>
                        </div>
                        <div class="bottom-table-div">
                            <vue-good-table
                                    :columns="columns"
                                    :rows="m_rightStatEstatPref(statType)"/>
                        </div>
                    </div>
                    <!-- 市町村データ-->
                    <div v-show="statType === 'scatterCity'">
                        <div class="bottom-info-div">
                            <table class="source-table">
                                <tr><th>データ名</th><td>{{ s_rightStatNameCity }}</td></tr>
                                <tr><th>statsDataId</th><td>{{ s_rightStatsDataIdCity }}</td></tr>
                                <tr><th>cdCat01</th><td>{{ s_rightCdCat01City }}</td></tr>
                                <tr><th>出典</th><td><a href="https://www.stat.go.jp/data/s-sugata/index.html" target="_blank">統計で見る市区町村のすがた</a></td></tr>
                                <tr><th>所在源又は<br>参考資料等</th><td  v-html="s_rightSourceCity"></td></tr>
                            </table>
                        </div>
                        <div class="bottom-table-div">
                            <vue-good-table
                                    :columns="columns"
                                    :rows="m_rightStatEstatCity(statType)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <resize-observer @notify="mix_detectResize" />
    </div>
</template>

<script>
  import mixinDetectResize from '../components/mixin/detectResize'
  export default {
    name: "bottom",
    props: ['side', 'statType'],
    mixins: [mixinDetectResize],
    data () {
        return {
          columns: [
            {
              label: 'citycode',
              field: 'citycode',
            },
            {
              label: 'cityname',
              field: 'cityname',
            },
            {
              label: 'data',
              field: 'data',
              type: 'number',
            }
          ]
        }
    },
    computed: {
      s_leftStatNamePref () { return this.$store.state.statList.leftStatEstatPref.statName },
      s_leftStatsDataIdPref () { return this.$store.state.statList.leftStatEstatPref.statsDataId },
      s_leftCdCat01Pref () { return this.$store.state.statList.leftStatEstatPref.cdCat01 },
      s_leftSourcePref () { return this.$store.state.statList.leftStatEstatPref.source },

      s_leftStatNameCity () { return this.$store.state.statList.leftStatEstatCity.statName },
      s_leftStatsDataIdCity () { return this.$store.state.statList.leftStatEstatCity.statsDataId },
      s_leftCdCat01City () { return this.$store.state.statList.leftStatEstatCity.cdCat01 },
      s_leftSourceCity () { return this.$store.state.statList.leftStatEstatCity.source },

      s_rightStatNamePref () { return this.$store.state.statList.rightStatEstatPref.statName },
      s_rightStatsDataIdPref () { return this.$store.state.statList.rightStatEstatPref.statsDataId },
      s_rightCdCat01Pref () { return this.$store.state.statList.rightStatEstatPref.cdCat01 },
      s_rightSourcePref () { return this.$store.state.statList.rightStatEstatPref.source },

      s_rightStatNameCity () { return this.$store.state.statList.rightStatEstatCity.statName },
      s_rightStatsDataIdCity () { return this.$store.state.statList.rightStatEstatCity.statsDataId },
      s_rightCdCat01City () { return this.$store.state.statList.rightStatEstatCity.cdCat01 },
      s_rightSourceCity () { return this.$store.state.statList.rightStatEstatCity.source },
    },
    methods: {
      m_leftStatEstatPref (statType) {
        let data = [];
        let target;
        if (statType === 'pref') {
          target = this.$store.state.statList.leftStatEstatPref.statData[this.$store.state.statList.yearRangePref];
        } else {
          target = this.$store.state.statList.leftStatEstatPref.statData[this.$store.state.statList.yearRangeScatterPref];
        }
        if (target) data = target.data2;
        return  data
      },
      m_rightStatEstatPref (statType) {
        let data = [];
        let target;
        if (statType === 'pref') {
          target = this.$store.state.statList.rightStatEstatPref.statData[this.$store.state.statList.yearRangePref];
        } else {
          target = this.$store.state.statList.rightStatEstatPref.statData[this.$store.state.statList.yearRangeScatterPref];
        }
        if (target) data = target.data2;
        return  data
      },
      m_leftStatEstatCity (statType) {
        let data = [];
        let target;
        if (statType === 'city') {
          target = this.$store.state.statList.leftStatEstatCity.statData[this.$store.state.statList.yearRangeCity];
        } else {
          target = this.$store.state.statList.leftStatEstatCity.statData[this.$store.state.statList.yearRangeScatterCity];
        }
        if (target) data = target.data2;
        return  data
      },
      m_rightStatEstatCity (statType) {
        let data = [];
        let target;
        if (statType === 'city') {
          target = this.$store.state.statList.rightStatEstatCity.statData[this.$store.state.statList.yearRangeCity];
        } else {
          target = this.$store.state.statList.rightStatEstatCity.statData[this.$store.state.statList.yearRangeScatterCity];
        }
        if (target) data = target.data2;
        return  data
      }
    }
  }
</script>

<style>
    #footer-inner-left {
        width: 50%;
        padding: 0 10px 10px 10px;
        overflow: auto;
        text-align: left;
        font-size: 14px;
        line-height:18px;
        display: inline-block;
        vertical-align: top;
    }
    #footer-inner-right {
        width: 50%;
        padding: 0 10px 10px 10px;
        overflow: auto;
        text-align: left;
        font-size: 14px;
        line-height:18px;
        display: inline-block;
        vertical-align: top;
    }
    .bottom-info-div {
        width:49%;
        display: inline-block;
        vertical-align: top;
    }
    .bottom-table-div {
        width:49%;
        display: inline-block;
        vertical-align: top;
        padding:0 0 0 10px;
    }
    .source-table {
        border-collapse: collapse;
        width: 100%;
    }
    .source-table th {
        font-weight: normal;
        background: linear-gradient(#f4f5f8, #f1f3f6);
        border: solid 1px #dcdfe6;
    }
    .source-table td {
        background: white;
        border: solid 1px #dcdfe6;
    }
    .vgt-table {
        /*width: 49%!important;*/
        font-size: 14px!important;
    }
    .vgt-table th {
        padding: 0 20px 0 5px!important;
    }
    .vgt-table td {
        padding: 0 5px 0 5px!important;
    }
</style>
