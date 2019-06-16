<template>
    <div id="footer">
        <div class='resizers'>
            <div class='resizer top'>
                <i class="el-icon-arrow-up"></i><span style="padding: 0 20px 0 20px">メタ情報＋テーブル</span><i class="el-icon-arrow-up"></i>
            </div>
            <div style="padding-top: 40px">
                <div id="footer-inner-left">
                    <!-- 市町村データ-->
                    <div v-show="statType === 'city'">
                        <div class="bottom-info-div">
                            <table class="source-table">
                                <tr><th>データ名</th><td>{{ s_statNameCity }}</td></tr>
                                <tr><th>statsDataId</th><td>{{ s_statsDataIdCity }}</td></tr>
                                <tr><th>cdCat01</th><td>{{ s_cdCat01City }}</td></tr>
                                <tr><th>出典</th><td  v-html="s_sourceCity"></td></tr>
                            </table>
                        </div>
                        <div class="bottom-table-div">
                            <vue-good-table
                                    :columns="columns"
                                    :rows="s_leftStatEstatCity"/>
                        </div>
                    </div>
                    <!-- 都道府県データ-->
                    <div v-show="statType === 'pref'">
                        <div class="bottom-info-div">
                            <table class="source-table">
                                <tr><th>データ名</th><td>{{ s_statName }}</td></tr>
                                <tr><th>statsDataId</th><td>{{ s_statsDataId }}</td></tr>
                                <tr><th>cdCat01</th><td>{{ s_cdCat01 }}</td></tr>
                                <tr><th>出典</th><td  v-html="s_source"></td></tr>
                            </table>
                        </div>
                        <div class="bottom-table-div">
                            <vue-good-table
                                    :columns="columns"
                                    :rows="s_leftStatEstatPref"/>
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
      s_statName () { return this.$store.state.statList.leftStatEstatPref.statName },
      s_statsDataId () { return this.$store.state.statList.leftStatEstatPref.statsDataId },
      s_cdCat01 () { return this.$store.state.statList.leftStatEstatPref.cdCat01 },
      s_source () { return this.$store.state.statList.leftStatEstatPref.source },

      s_statNameCity () { return this.$store.state.statList.leftStatEstatCity.statName },
      s_statsDataIdCity () { return this.$store.state.statList.leftStatEstatCity.statsDataId },
      s_cdCat01City () { return this.$store.state.statList.leftStatEstatCity.cdCat01 },
      s_sourceCity () { return this.$store.state.statList.leftStatEstatCity.source },

      s_leftStatEstatPref () {
        let data = [];
        const target = this.$store.state.statList.leftStatEstatPref.statData[this.$store.state.statList.yearRangePref];
        if (target) data = target.data2;
        return  data
      },
      s_leftStatEstatCity () {
        let data = [];
        const target = this.$store.state.statList.leftStatEstatCity.statData[this.$store.state.statList.yearRangeCity];
        if (target)  {
          // this.tableDataCity = [
          //   {
          //     tr: 'データ名',
          //     td: this.$store.state.statList.leftStatEstatCity.statName
          //   },
          //   {
          //     tr: 'statsDataId',
          //     td: this.$store.state.statList.leftStatEstatCity.statsDataId
          //   },
          //   {
          //     tr: 'cdCat01',
          //     td: this.$store.state.statList.leftStatEstatCity.cdCat01
          //   },
          //   {
          //     tr: 'sourceId',
          //     td: this.$store.state.statList.leftStatEstatPref.sourceId
          //   }
          // ];
          data = target.data2;
        }
        return  data
      },
      s_leftStat () {
        let data;
        this.title = this.$store.state.statList.leftStat.statData.title;
        data = this.$store.state.statList.leftStat.statData.data;
        if (!data) data = [];
        return  data
      },
      s_rightStat () { return this.$store.state.statList.rightStat },
    },
    methods: {
      test () {
      }
    },
    mounted () {
      this.$nextTick(function () {
      })
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
