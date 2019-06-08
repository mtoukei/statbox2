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
                        <el-table
                                :data="tableDataCity"
                                border
                                :show-header="false"
                                class="bottom-info-table"
                        >
                            <el-table-column width="90px" prop="tr"/>
                            <el-table-column prop="td"/>
                        </el-table>
                        <div class="bottom-table-div">
                            <vue-good-table
                                    :columns="columns"
                                    :rows="s_leftStatEstatCity"/>
                        </div>
                    </div>
                    <!-- 都道府県データ-->
                    <div v-show="statType === 'pref'">
                        <el-table
                                :data="tableDataPref"
                                border
                                :show-header="false"
                                class="bottom-info-table"
                        >
                            <el-table-column width="90px" prop="tr"/>
                            <el-table-column prop="td"/>
                        </el-table>
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
          title: '',
          statsDataId: '',
          cdCat01: '',
          info: 'ここに統計データのメタ情報を表示する。',
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
          ],
          tableDataPref: [],
          tableDataCity: [],
        }
    },
    computed: {
      s_leftStatEstatPref () {
        let data = [];
        const target = this.$store.state.statList.leftStatEstatPref.statData[this.$store.state.statList.yearRangePref];
        if (target)  {
          this.tableDataPref = [
            {
              tr: 'データ名',
              td: this.$store.state.statList.leftStatEstatPref.statName
            },
            {
              tr: 'statsDataId',
              td: this.$store.state.statList.leftStatEstatPref.statsDataId
            },
            {
              tr: 'cdCat01',
              td:this.$store.state.statList.leftStatEstatPref.cdCat01
            }
          ];
          data = target.data2;
        }
        return  data
      },
      s_leftStatEstatCity () {
        let data = [];
        const target = this.$store.state.statList.leftStatEstatCity.statData[this.$store.state.statList.yearRangeCity];
        if (target)  {
          this.tableDataCity = [
            {
              tr: 'データ名',
              td: this.$store.state.statList.leftStatEstatCity.statName
            },
            {
              tr: 'statsDataId',
              td: this.$store.state.statList.leftStatEstatCity.statsDataId
            },
            {
              tr: 'cdCat01',
              td:this.$store.state.statList.leftStatEstatCity.cdCat01
            }
          ];
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
        console.log(this.statData);
        console.log(this.$store.state.statList.leftStat.statData.data);
        console.log(this.$store.state.statList.leftStatEstatPref.statData[0].data2)
      }
    },
    mounted () {
      this.$nextTick(function () {
        console.log(this.statType)

      })
    }
  }
</script>

<style>
    div {
        box-sizing: border-box;
    }
    #footer-inner-left {
        width: 50%;
        padding: 0 10px 10px 10px;
        overflow: auto;
        text-align: left;
        font-size: 14px;
        line-height:18px;
        /*display:table*/
    }
    .bottom-info-div {
        width:49%;
        display: inline-block;
        vertical-align: top;
        /*border: solid 1px gray;*/
        /*display:table-cell;*/
    }
    .title-div {
        font-weight: bold;
        margin-bottom: 10px;
    }
    .bottom-table-div {
        width:49%;
        display: inline-block;
        vertical-align: top;
        padding:0 0 0 10px;
        /*display:table-cell;*/
    }
    .bottom-info-table{
        width:49%!important;
        display: inline-block;
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
