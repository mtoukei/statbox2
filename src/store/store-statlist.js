import store from './store'
import  * as statData from './stat-data'
import * as statDataTime from './stat-data-time'
import Citycodes from './citycodes'
import MetaPref from './meta-pref'
import MetaCity from './meta-city'
const metaPref = MetaPref;
const metaCity = MetaCity;
const statList = {
  namespaced: true,
  state: {
    yearRangeCity: 100,
    yearRangePref: 100,
    chartTransition:false,
    leftStat:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    rightStat:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    leftStatEstatPref: {
      count: 0,
      statData:[]
    },
    rightStatEstatPref: {
      count: 0,
      statData:[]
    },
    leftStatEstatCity: {
      count: 0,
      statData:[]
    },
    rightStatEstatCity: {
      count: 0,
      statData:[]
    },
    leftStatTimeCity:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    leftStatTimePref:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    leftStatTime:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    rightStatTime:{
      transition: true,
      count: 0,
      stat: '',
      statData: {},
    },
    statOld:{
      leftSide: '',
      rightSide: ''
    },
    ssdse:
      [
        {
          "code": "A1101"
        },
        {
          "code": "A110101"
        },
        {
          "code": "A110102"
        },
        {
          "code": "A1102"
        },
        {
          "code": "A110201"
        },
        {
          "code": "A110202"
        },
        {
          "code": "A1301"
        },
        {
          "code": "A130101"
        },
        {
          "code": "A130102"
        },
        {
          "code": "A1302"
        },
        {
          "code": "A130201"
        },
        {
          "code": "A130202"
        },
        {
          "code": "A1303"
        },
        {
          "code": "A130301"
        },
        {
          "code": "A130302"
        },
        {
          "code": "A1419"
        },
        {
          "code": "A141901"
        },
        {
          "code": "A141902"
        },
        {
          "code": "A1700"
        },
        {
          "code": "A4101"
        },
        {
          "code": "A4200"
        },
        {
          "code": "A5101"
        },
        {
          "code": "A5102"
        },
        {
          "code": "A7101"
        },
        {
          "code": "A710101"
        },
        {
          "code": "A710201"
        },
        {
          "code": "A810102"
        },
        {
          "code": "A810105"
        },
        {
          "code": "A811102"
        },
        {
          "code": "A8201"
        },
        {
          "code": "A8301"
        },
        {
          "code": "A9101"
        },
        {
          "code": "A9201"
        },
        {
          "code": "B1101"
        },
        {
          "code": "B1103"
        },
        {
          "code": "C2107"
        },
        {
          "code": "C210703"
        },
        {
          "code": "C210708"
        },
        {
          "code": "C210709"
        },
        {
          "code": "C210710"
        },
        {
          "code": "C210711"
        },
        {
          "code": "C210712"
        },
        {
          "code": "C210713"
        },
        {
          "code": "C210716"
        },
        {
          "code": "C210717"
        },
        {
          "code": "C210718"
        },
        {
          "code": "C210719"
        },
        {
          "code": "C210720"
        },
        {
          "code": "C210721"
        },
        {
          "code": "C210722"
        },
        {
          "code": "C210723"
        },
        {
          "code": "C210724"
        },
        {
          "code": "C210725"
        },
        {
          "code": "C2110"
        },
        {
          "code": "C2111"
        },
        {
          "code": "C2112"
        },
        {
          "code": "C2207"
        },
        {
          "code": "C220703"
        },
        {
          "code": "C220708"
        },
        {
          "code": "C220709"
        },
        {
          "code": "C220710"
        },
        {
          "code": "C220711"
        },
        {
          "code": "C220712"
        },
        {
          "code": "C220713"
        },
        {
          "code": "C220716"
        },
        {
          "code": "C220717"
        },
        {
          "code": "C220718"
        },
        {
          "code": "C220719"
        },
        {
          "code": "C220720"
        },
        {
          "code": "C220721"
        },
        {
          "code": "C220722"
        },
        {
          "code": "C220723"
        },
        {
          "code": "C220724"
        },
        {
          "code": "C220725"
        },
        {
          "code": "C2210"
        },
        {
          "code": "C2211"
        },
        {
          "code": "C2212"
        },
        {
          "code": "D2203"
        },
        {
          "code": "D2211"
        },
        {
          "code": "D3201"
        },
        {
          "code": "D320101"
        },
        {
          "code": "D3203"
        },
        {
          "code": "D320303"
        },
        {
          "code": "D320308"
        },
        {
          "code": "D320310"
        },
        {
          "code": "D320311"
        },
        {
          "code": "E1101"
        },
        {
          "code": "E1501"
        },
        {
          "code": "E2101"
        },
        {
          "code": "E2401"
        },
        {
          "code": "E2501"
        },
        {
          "code": "E3101"
        },
        {
          "code": "E3401"
        },
        {
          "code": "E3501"
        },
        {
          "code": "E4101"
        },
        {
          "code": "E4501"
        },
        {
          "code": "G1201"
        },
        {
          "code": "G1401"
        },
        {
          "code": "H5507"
        },
        {
          "code": "H550701"
        },
        {
          "code": "H6130"
        },
        {
          "code": "H6131"
        },
        {
          "code": "H6132"
        },
        {
          "code": "I510120"
        },
        {
          "code": "I5102"
        },
        {
          "code": "I5103"
        },
        {
          "code": "I6100"
        },
        {
          "code": "I6200"
        },
        {
          "code": "I6300"
        },
        {
          "code": "J2503"
        },
        {
          "code": "J2506"
        }
      ],
    eStatMetaCity: JSON.parse(JSON.stringify(metaCity)),
    // eStatMetaCity1: JSON.parse(JSON.stringify(metaCity)),
    // eStatMetaCity2: JSON.parse(JSON.stringify(metaCity)),
    // eStatMetaCity3: JSON.parse(JSON.stringify(metaCity)),
    // eStatMetaCity4: JSON.parse(JSON.stringify(metaCity)),
    // eStatMetaPreh1: JSON.parse(JSON.stringify(metaPref)),
    // eStatMetaPreh2: JSON.parse(JSON.stringify(metaPref)),
    eStatMetaPreh: JSON.parse(JSON.stringify(metaPref)),
    // eStatMetaPreh4: JSON.parse(JSON.stringify(metaPref)),
    metaMiyazakiTime: [
      {
        label: '気温',
        children: [
          {
            label: '平均温度',
            statName: 'kion/heikinnonndo/℃'
          },
          {
            label: '最高温度',
            statName: 'kion/saikouonndo/℃'
          },
          {
            label: '最低温度',
            statName: 'kion/saiteionndo/℃'
          },
          {
            label: '降水量',
            statName: 'kion/kousuiryou/mm'
          },
          {
            label: '日照時間',
            statName: 'kion/nissyouzikan/h'
          }
        ]
      },
      // jinkou,zougenritu,otoko,onna,u15,u65,o65,koureikaritu,
      // sangyousousuu,sangyou1,sangyou2,sangyou3,sousetaisuu,atarizinin
      {
        label: '人口',
        children: [
          {
            label: '総数',
            statName: 'jinkou/jinkou/人'
          },
          {
            label: '増減率',
            statName: 'jinkou/zougenritu/％'
          },
          {
            label: '男',
            statName: 'jinkou/otoko/人'
          },
          {
            label: '女',
            statName: 'jinkou/onna/人'
          },
          {
            label: '0～14歳',
            statName: 'jinkou/u15/人'
          },
          {
            label: '15～64歳',
            statName: 'jinkou/u65/人'
          },
          {
            label: '65歳～',
            statName: 'jinkou/o65/人'
          },
          {
            label: '高齢化率',
            statName: 'jinkou/koureikaritu/％'
          },
          {
            label: '産業別人口総数',
            statName: 'jinkou/sangyousousuu/人'
          },
          {
            label: '産業別人口第1次産業',
            statName: 'jinkou/sangyou1/人'
          },
          {
            label: '産業別人口第2次産業',
            statName: 'jinkou/sangyou2/人'
          },
          {
            label: '産業別人口第3次産業',
            statName: 'jinkou/sangyou3/人'
          },
          {
            label: '総世帯数',
            statName: 'jinkou/sousetaisuu/世帯数'
          },
          {
            label: '一般世帯の１世帯あたり人員',
            statName: 'jinkou/atarizinin/人'
          },


        ]
      },
      {
        label: '経済',
        children: [
          {
            label: '県内総生産(名目)',
            statName: 'keizai/souseisan/百万円'
          },
          {
            label: '第1次産業',
            statName: 'keizai/sangyou1/百万円'
          },
          {
            label: '第2次産業',
            statName: 'keizai/sangyou2/百万円'
          },
          {
            label: '第3次産業',
            statName: 'keizai/sangyou3/百万円'
          },
          {
            label: '1人あたり県民所得',
            statName: 'keizai/atarisyotoku/千円'
          }
        ]
      },
      // koutimennseki,nougyousannsyutugaku
      {
        label: '農業',
        children: [
          {
            label: '耕地面積',
            statName: 'nougyou/koutimennseki/町、ha'
          },
          {
            label: '農業産出額',
            statName: 'nougyou/nougyousannsyutugaku/億円'
          }
        ]
      },
      // sozaiseisannryou
      {
        label: '林業',
        children: [
          {
            label: '素材生産量',
            statName: 'ringyou/sozaiseisannryou/千㎥'
          }
        ]
      },
      // kaimennyogyougyokakuryou
      {
        label: '漁業',
        children: [
          {
            label: '海面漁業漁獲量',
            statName: 'gyogyou/kaimennyogyougyokakuryou/トン'
          }
        ]
      },
      // zigyousyosuu,zyuugyousyasyuu,seizouhinnsyukkagakutou
      {
        label: '工業',
        children: [
          {
            label: '事業所数',
            statName: 'kougyou/zigyousyosuu/事業所'
          },
          {
            label: '従業者数',
            statName: 'kougyou/zyuugyousyasyuu/人'
          },
          {
            label: '製造品出荷額等',
            statName: 'kougyou/seizouhinnsyukkagakutou/百万円'
          }
        ]
      },
      // syoutennsuu,syoutennnennkannsyouhinnhnngaigaku
      {
        label: '商業',
        children: [
          {
            label: '商店数',
            statName: 'syougyou/syoutennsuu/店'
          },
          {
            label: '商店年間商品販売額',
            statName: 'syougyou/syoutennnennkannsyouhinnhnngaigaku/百万円'
          }
        ]
      },
      // gougousisuu,syouhisisyutu,tyotikugennzaidaka,husaigennzaidaka,nennkannsyuunyuu
      {
        label: '物価・家計',
        children: [
          {
            label: '消費者物価指数',
            statName: 'bukka/gougousisuu/無し'
          },
          {
            label: '1世帯あたり1ヶ月の消費支出（全世帯）',
            statName: 'bukka/syouhisisyutu/千円'
          },
          {
            label: '貯蓄現在高',
            statName: 'bukka/tyotikugennzaidaka/千円'
          },
          {
            label: '負債現在高',
            statName: 'bukka/husaigennzaidaka/千円'
          },
          {
            label: '年間収入',
            statName: 'bukka/nennkannsyuunyuu/千円'
          },
        ]
      },
      // gekkankinngakukyuuyosougaku
      {
        label: '労働',
        children: [
          {
            label: '月間給与1人平均',
            statName: 'roudou/gekkankinngakukyuuyosougaku/円'
          },
        ]
      },
      // zidousyahoyuudaisuu,zyouyou,keizidousya
      {
        label: '運輸',
        children: [
          {
            label: '自動車保有台数',
            statName: 'unyu/zidousyahoyuudaisuu/台'
          },
          {
            label: '乗用',
            statName: 'unyu/zyouyou/台'
          },
          {
            label: '軽自動車',
            statName: 'unyu/keizidousya/台'
          },
        ]
      },
      // miyasuidouhukyuuritu,kunisuidouhukyuuritu,miyagesuidouhukyuuritu,kunigesuidouhukyuuritu
      {
        label: '生活環境',
        children: [
          {
            label: '宮崎県水道普及率',
            statName: 'seikatukankyou/miyasuidouhukyuuritu/％'
          },
          {
            label: '全国水道普及率',
            statName: 'seikatukankyou/kunisuidouhukyuuritu/％'
          },
          {
            label: '宮崎県下水道普及率',
            statName: 'seikatukankyou/miyagesuidouhukyuuritu/％'
          },
          {
            label: '全国下水道普及率',
            statName: 'seikatukankyou/kunigesuidouhukyuuritu/％'
          },
        ]
      },
      // syouzidousuu,tyuseitosuu,kouseitosuu,tyusinngaku,tyusyuusyoku,kousinngaku,kousyuusyoku
      {
        label: '教育',
        children: [
          {
            label: '小学校児童数',
            statName: 'kyouiku/syouzidousuu/人'
          },
          {
            label: '中学校生徒数',
            statName: 'kyouiku/tyuseitosuu/人'
          },
          {
            label: '高等学校生徒数',
            statName: 'kyouiku/kouseitosuu/人'
          },
          {
            label: '中学卒業後進学率',
            statName: 'kyouiku/tyusinngaku/人'
          },
          {
            label: '中学卒業後就職率',
            statName: 'kyouiku/tyusyuusyoku/人'
          },
          {
            label: '高校卒業後進学率',
            statName: 'kyouiku/kousinngaku/人'
          },
          {
            label: '高校卒業後就職率',
            statName: 'kyouiku/kousyuusyoku/人'
          },
        ]
      },
    ],
    //★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    metaMiyazaki: [
        {
          label: '自然環境',
          children: [
            {
              label: '総面積',
              statName: 'menseki/soumenseki'
            },
            {
              label: '総面積の構成比',
              statName: 'menseki/soumensekikouseihi'
            },
            {
              label: '林野面積',
              statName: 'menseki/rinyamenseki'
            },
            {
              label: '林野面積の対総面積割合',
              statName: 'menseki/rinyamensekitaisoumensekiwariai'
            },
            {
              label: '国有林面積',
              statName: 'menseki/kokuyuurinmenseki'
            },
            {
              label: '国有林面積の割合',
              statName: 'menseki/kokuyuurinmensekinowariai'
            },
            {
              label: '田面積',
              statName: 'menseki/tamenseki'
            },
            {
              label: '畑面積',
              statName: 'menseki/hatamenseki'
            },
            {
              label: '田・畑対総面積割合',
              statName: 'menseki/tahatamensekiwariai'
            },
            {
              label: '宅地面積',
              statName: 'menseki/takuchimenseki'
            },
            {
              label: '宅地面積の対総面積割合',
              statName: 'menseki/takuchimensekiwariai'
            },
            {
              label: '可住地面積',
              statName: 'menseki/kazyuuchimenseki'
            },
            {
              label: '可住地面積の対総面積割合',
              statName: 'menseki/kazyuuchimensekiwariai'
            }
          ]
        },
        {
          label: '人口・世帯',
          children: [
            {
              label: '人口',
              children:
                [
                  {
                    label: '人口総数',
                    statName: 'jinkou/sousuu'
                  },
                  {
                    label: '県人口に占める人口割合',
                    statName: 'jinkou/wariai'
                  },
                  {
                    label: '男',
                    statName: 'jinkou/otoko'
                  },
                  {
                    label: '女',
                    statName: 'jinkou/onna'
                  },
                  {
                    label: '性比',
                    statName: 'jinkou/seihi'
                  }
                ]
            },
            {
              label: '年齢構成',
              children:
                [
                  {
                    label: '15歳未満人口',
                    statName: 'nenrei/under15'
                  },
                  {
                    label: '15歳未満３区分構成比',
                    statName: 'nenrei/under15kouseihi'
                  },
                  {
                    label: '15～64歳人口',
                    statName: 'nenrei/over15under64'
                  },
                  {
                    label: '15～64歳人口３区分構成比',
                    statName: 'nenrei/over15under64kouseihi'
                  },
                  {
                    label: '65歳以上人口',
                    statName: 'nenrei/over65'
                  },
                  {
                    label: '65歳以上人口３区分構成比',
                    statName: 'nenrei/over65kouseihi'
                  },
                  {
                    label: '年少人口指数',
                    statName: 'nenrei/nensyou'
                  },
                  {
                    label: '老年人口指数',
                    statName: 'nenrei/rounen'
                  },
                  {
                    label: '従属人口指数',
                    statName: 'nenrei/zyuuzoku'
                  },
                  {
                    label: '老年化指数',
                    statName: 'nenrei/rounenka'
                  },
                  {
                    label: '28～29年の人口増加率',
                    statName: 'nenrei/zoukaritu28to29'
                  },
                ]
            },
            {
              label: '人口動態',
              children:
                [
                  {
                    label: '自然動態',
                    children:[
                      {
                        label: '出生数',
                        statName: 'doutai/syusseisuu'
                      },
                      {
                        label: '出生率',
                        statName: 'doutai/syusseiritu'
                      },
                      {
                        label: '死亡数',
                        statName: 'doutai/shibousuu'
                      },
                      {
                        label: '自然増加率',
                        statName: 'doutai/shizenzoukaritu'
                      }
                    ]
                  },
                  {
                    label: '社会動態',
                    children:[
                      {
                        label: '転入者数',
                        statName: 'doutai/tennyuusyasuu'
                      },
                      {
                        label: '県内からの転入',
                        statName: 'doutai/kennaitennyuu'
                      },
                      {
                        label: '県外からの転入',
                        statName: 'doutai/kengaitennyuu'
                      },
                      {
                        label: '転出者数',
                        statName: 'doutai/tensyutusyasuu'
                      },
                      {
                        label: '県内へ転出',
                        statName: 'doutai/kennaitensyutu'
                      },
                      {
                        label: '県外へ転出',
                        statName: 'doutai/kengaitensyutu'
                      },
                      {
                        label: '社会増減率',
                        statName: 'doutai/syakaizougenritu'
                      }
                    ]
                  },
                ]
            },
            {
              label: '世帯',
              children:
                [
                  {
                    label: '世帯数',
                    children:
                      [
                        {
                          label: '世帯数',
                          statName: 'setai/setaisuu'
                        },
                        {
                          label: '増減数',
                          statName: 'setai/zougensuu'
                        },
                        {
                          label: '増減率',
                          statName: 'setai/zougenritu'
                        }
                      ]
                  },
                  {
                    label: '1世帯当たり人員',
                    statName: 'setai/setaijinin'
                  },
                  {
                    label: '核家族世帯数',
                    children:
                      [
                        {
                          label: '核家族世帯数',
                          statName: 'setai/kakusetaisuu'
                        },
                        {
                          label: '核家族世帯割合',
                          statName: 'setai/kakuwariai'
                        },
                        {
                          label: '夫婦のみの世帯',
                          statName: 'setai/kakuhuuhu'
                        },
                        {
                          label: '夫婦のみの世帯割合',
                          statName: 'setai/kakuhuuhuwariai'
                        },
                        {
                          label: '夫婦と子供からなる世帯',
                          statName: 'setai/kakuhuuhukodomo'
                        },
                        {
                          label: '男親と子供からなる世帯',
                          statName: 'setai/kakuotoko'
                        },
                        {
                          label: 'うち父子世帯',
                          statName: 'setai/kakuhushi'
                        },
                        {
                          label: '女親と子供からなる世帯',
                          statName: 'setai/kakuonna'
                        },
                        {
                          label: 'うち母子世帯',
                          statName: 'setai/kakuboshi'
                        },
                        {
                          label: '父子母子世帯割合',
                          statName: 'setai/hushiboshi'
                        }
                      ]
                  },
                  {
                    label: '単独世帯数',
                    children:
                      [
                        {
                          label: '単独世帯数',
                          statName: 'setai/tandokusetaisuu'
                        },
                        {
                          label: '単独世帯割合',
                          statName: 'setai/tandokuwariai'
                        }
                      ]
                  },
                  {
                    label: '65歳以上の単独世帯',
                    children:
                      [
                        {
                          label: '65歳以上の単独世帯',
                          statName: 'setai/tandokuover65setaisuu'
                        },
                        {
                          label: '65歳以上の単独世帯割合',
                          statName: 'setai/tandokuover65wariai'
                        }
                      ]
                  },
                  {
                    label: '65歳以上世帯員のいる一般世帯',
                    children:
                      [
                        {
                          label: '65歳以上世帯員のいる一般世帯数',
                          statName: 'setai/over65setai'
                        },
                        {
                          label: '65歳以上世帯員のいる一般世帯割合',
                          statName: 'setai/over65setaiwariai'
                        }
                      ]
                  },

                ]
            }
          ]
        },
        {
          label: '経済基盤',
          children: [
            {
              label: '事業所数',
              children:
                [
                  {
                    label: '事業所総数',
                    statName: 'jigyousyosuu/sousuu'
                  },
                  {
                    label: '第1次産業事業所数',
                    statName: 'jigyousyosuu/dai1suu'
                  },
                  {
                    label: '第1次産業事業所割合',
                    statName: 'jigyousyosuu/dai1wariai'
                  },
                  {
                    label: '第2次産業事業所数',
                    statName: 'jigyousyosuu/dai2suu'
                  },
                  {
                    label: '第2次産業事業所割合',
                    statName: 'jigyousyosuu/dai2wariai'
                  },
                  {
                    label: '第2次産業ー鉱業・採石業・砂利採取業',
                    statName: 'jigyousyosuu/kougyou'
                  },
                  {
                    label: '第2次産業ー建設業',
                    statName: 'jigyousyosuu/kensetugyou'
                  },
                  {
                    label: '第2次産業ー製造業',
                    statName: 'jigyousyosuu/seizougyou'
                  },
                  {
                    label: '第3次産業事業所数',
                    statName: 'jigyousyosuu/dai3suu'
                  },
                  {
                    label: '第3次産業事業所割合',
                    statName: 'jigyousyosuu/dai3wariai'
                  },
                  {
                    label: '第3次産業ー電気・ガス・熱供給・水道業',
                    statName: 'jigyousyosuu/denki'
                  },
                  {
                    label: '第3次産業ー情報通信業',
                    statName: 'jigyousyosuu/jouhou'
                  },
                  {
                    label: '第3次産業ー運輸業・郵便業',
                    statName: 'jigyousyosuu/unyu'
                  },
                  {
                    label: '第3次産業ー卸売業・小売業',
                    statName: 'jigyousyosuu/oroshi'
                  },
                  {
                    label: '第3次産業ー金融業・保険業',
                    statName: 'jigyousyosuu/kinyuu'
                  },
                  {
                    label: '第3次産業ー不動産業・物品賃貸業',
                    statName: 'jigyousyosuu/hudousan'
                  },
                  {
                    label: '第3次産業ー学術研究・専門技術サービス業',
                    statName: 'jigyousyosuu/gakuzyutu'
                  },
                  {
                    label: '第3次産業ー宿泊業・飲食サービス業',
                    statName: 'jigyousyosuu/syukuhaku'
                  },
                  {
                    label: '第3次産業ー生活関連サービス業・娯楽',
                    statName: 'jigyousyosuu/seikatu'
                  },
                  {
                    label: '第3次産業ー教育・学習支援業',
                    statName: 'jigyousyosuu/kyouiku'
                  },
                  {
                    label: '第3次産業ー医療・福祉',
                    statName: 'jigyousyosuu/iryou'
                  },
                  {
                    label: '第3次産業ー複合サービス事業',
                    statName: 'jigyousyosuu/hukugou'
                  },
                  {
                    label: '第3次産業ーサービス業(他に分類されないもの)',
                    statName: 'jigyousyosuu/service'
                  }
                ]
            },
            {
              label: '労働力状態',
              children:
                [
                  {
                    label: '総数(15歳以上人口)',
                    statName: 'roudouryoku/sousuu'
                  },
                  {
                    label: '労働力人口',
                    statName: 'roudouryoku/jinkou'
                  },
                  {
                    label: '労働力率',
                    statName: 'roudouryoku/roudouryokuritu'
                  },
                  {
                    label: '就業者',
                    statName: 'roudouryoku/syuugyousya'
                  },
                  {
                    label: '就業者総数割合',
                    statName: 'roudouryoku/syuugyousyawariai'
                  },
                  {
                    label: '完全失業者',
                    statName: 'roudouryoku/shitugyousya'
                  },
                  {
                    label: '完全失業者総数割合',
                    statName: 'roudouryoku/shitugyousyawariai'
                  },
                  {
                    label: '完全失業率',
                    statName: 'roudouryoku/shitugyouritu'
                  },
                  {
                    label: '非労働力人口',
                    statName: 'roudouryoku/hiroudoujinkou'
                  },
                  {
                    label: '非労働力率',
                    statName: 'roudouryoku/hiroudouryokuritu'
                  },
                  {
                    label: '非労働力率ー家事割合',
                    statName: 'roudouryoku/kajiwariai'
                  },
                  {
                    label: '自市町村内通勤者数',
                    statName: 'roudouryoku/jishichyouson'
                  },
                  {
                    label: '域内通勤者比率',
                    statName: 'roudouryoku/ikinaihiritu'
                  },
                  {
                    label: '他市町村からの通勤者',
                    statName: 'roudouryoku/fromhokahichyouson'
                  },
                  {
                    label: '他市町村からの通勤者比率',
                    statName: 'roudouryoku/fromhokahichyousonritu'
                  },
                  {
                    label: '他市町村への通勤者',
                    statName: 'roudouryoku/tohokahichyouson'
                  },
                  {
                    label: '他市町村への通勤者比率',
                    statName: 'roudouryoku/tohokahichyousonritu'
                  }
                ]
            },
            {
              label: '産業別労働力状態',
              children:
                [
                  {
                    label: '第1次産業',
                    statName: 'sangyoubetu/dai1'
                  },
                  {
                    label: '第1次産業就業者割合',
                    statName: 'sangyoubetu/dai1wariai'
                  },
                  {
                    label: '第1次産業ー農業・林業',
                    statName: 'sangyoubetu/nouringyou'
                  },
                  {
                    label: '第1次産業ー農業・林業うち農業',
                    statName: 'sangyoubetu/nougyou'
                  },
                  {
                    label: '第1次産業ー漁業',
                    statName: 'sangyoubetu/gyogyou'
                  },
                  {
                    label: '第2次産業',
                    statName: 'sangyoubetu/dai2'
                  },
                  {
                    label: '第2次産業就業者割合',
                    statName: 'sangyoubetu/dai2wariai'
                  },
                  {
                    label: '第2次産ー鉱業・採石・砂利採取業',
                    statName: 'sangyoubetu/kougyousaiseki'
                  },
                  {
                    label: '第2次産ー建設業',
                    statName: 'sangyoubetu/kensetu'
                  },
                  {
                    label: '第2次産ー製造業',
                    statName: 'sangyoubetu/seizou'
                  },
                  {
                    label: '第3次産業',
                    statName: 'sangyoubetu/dai3'
                  },
                  {
                    label: '第3次産業就業者割合',
                    statName: 'sangyoubetu/dai3wariai'
                  },
                  {
                    label: '第3次産ー電気・ガス・熱供給・水道業',
                    statName: 'sangyoubetu/denki'
                  },
                  {
                    label: '第3次産ー情報通信業',
                    statName: 'sangyoubetu/jouhou'
                  },
                  {
                    label: '第3次産ー運輸業・郵送業',
                    statName: 'sangyoubetu/unyu'
                  },
                  {
                    label: '第3次産ー卸売業・小売業',
                    statName: 'sangyoubetu/oroshi'
                  },
                  {
                    label: '第3次産ー金融業・保険業',
                    statName: 'sangyoubetu/kinyuu'
                  },
                  {
                    label: '第3次産ー不動産業・物品賃貸業',
                    statName: 'sangyoubetu/hudousan'
                  },
                  {
                    label: '第3次産ー学術研究・専門・技術サービス業',
                    statName: 'sangyoubetu/gakuzyutu'
                  },
                  {
                    label: '第3次産ー宿泊業・飲食サービス業',
                    statName: 'sangyoubetu/syukuhaku'
                  },
                  {
                    label: '第3次産ー生活関連サービス業・娯楽',
                    statName: 'sangyoubetu/seikatu'
                  },
                  {
                    label: '第3次産ー教育・学習支援業',
                    statName: 'sangyoubetu/kyouiku'
                  },
                  {
                    label: '第3次産ー医療・福祉',
                    statName: 'sangyoubetu/iryou'
                  },
                  {
                    label: '第3次産ー複合サービス業',
                    statName: 'sangyoubetu/hukugou'
                  },
                  {
                    label: '第3次産ーサービス業(他に分類されないもの)',
                    statName: 'sangyoubetu/service'
                  },
                  {
                    label: '第3次産ー公務(他に分類されるものを除く)',
                    statName: 'sangyoubetu/koumu'
                  },
                  {
                    label: '第3次産ー分類不能の産業',
                    statName: 'sangyoubetu/hunou'
                  }
                ]
            },
            {
              label: '従業上の地位',
              children:
                [
                  {
                    label: '雇用者',
                    statName: 'zyuugyouzyouchii/koyousya'
                  },
                  {
                    label: '雇用者割合(対就業者)',
                    statName: 'zyuugyouzyouchii/koyousyawariai'
                  },
                  {
                    label: '役員',
                    statName: 'zyuugyouzyouchii/yakuin'
                  },
                  {
                    label: '役員割合(対就業者)',
                    statName: 'zyuugyouzyouchii/yakuinwariai'
                  },
                  {
                    label: '雇人のある業主',
                    statName: 'zyuugyouzyouchii/yatoibito'
                  },
                  {
                    label: '雇人のある業主割合(対就業者)',
                    statName: 'zyuugyouzyouchii/yatoibitowariai'
                  },
                  {
                    label: '雇人のない業主',
                    statName: 'zyuugyouzyouchii/yatoibitonai'
                  },
                  {
                    label: '雇人のない業主割合(対就業者)',
                    statName: 'zyuugyouzyouchii/yatoibitonaiwariai'
                  },
                  {
                    label: '家族従業者',
                    statName: 'zyuugyouzyouchii/kazoku'
                  },
                  {
                    label: '家族従業者割合(対就業者)',
                    statName: 'zyuugyouzyouchii/kazokuwariai'
                  }
                ]
            },
            {
              label: '市町村民経済計算',
              children:
                [
                  {
                    label: '市町村内総生産',
                    statName: 'shicyousonmin/souseisan'
                  },
                  {
                    label: '就業者1人当たり実額',
                    statName: 'shicyousonmin/jitugaku'
                  },
                  {
                    label: '就業者1人当たり水準',
                    statName: 'shicyousonmin/suizyun'
                  },
                  {
                    label: '(参考)市町村民所得(分配)',
                    statName: 'shicyousonmin/syotoku'
                  }
                ]
            },
            {
              label: '生産活動',
              children:
                [
                  {
                    label: '農林業経営体数',
                    statName: 'seisankatudou/nouringyou'
                  },
                  {
                    label: '総農家数',
                    statName: 'seisankatudou/noukasuu'
                  },
                  {
                    label: '主業農家数(販売農家)',
                    statName: 'seisankatudou/syugyounoukasuu'
                  },
                  {
                    label: '主業農家割合',
                    statName: 'seisankatudou/syugyounoukawariai'
                  },
                  {
                    label: '農業従事者数(販売農家)',
                    statName: 'seisankatudou/nougyoujyuujisyasuu'
                  },
                  {
                    label: '農業就業人口(販売農家)',
                    statName: 'seisankatudou/nougyousyuugyoujinkou'
                  },
                  {
                    label: '基幹的農業従事者数(販売農家)',
                    statName: 'seisankatudou/kikanteki'
                  },
                  {
                    label: '経営耕地総面積(農業経営体)',
                    statName: 'seisankatudou/soumenseki'
                  },
                  {
                    label: '1経営体当たり経営耕地総面積',
                    statName: 'seisankatudou/atarisoumenseki'
                  },
                  {
                    label: '田のある農業経営体数',
                    statName: 'seisankatudou/tanoaru'
                  },
                  {
                    label: '1経営体当たり田の面積',
                    statName: 'seisankatudou/ataritanoaru'
                  },
                  {
                    label: '畑のある農業経営体数',
                    statName: 'seisankatudou/hatakearu'
                  },
                  {
                    label: '1経営体当たり畑の面積',
                    statName: 'seisankatudou/atarihatakearu'
                  },
                  {
                    label: '樹園地のある農業経営体数',
                    statName: 'seisankatudou/jyuenchi'
                  },
                  {
                    label: '1経営体当たり樹園地の面積',
                    statName: 'seisankatudou/atarijyuenchi'
                  },
                  {
                    label: '水稲収穫量',
                    statName: 'seisankatudou/suitou'
                  },
                  {
                    label: '水稲収穫量早期栽培',
                    statName: 'seisankatudou/suitousouki'
                  },
                  {
                    label: '水稲収穫量普通栽培',
                    statName: 'seisankatudou/suitouhutuu'
                  },
                  {
                    label: '麦収穫量',
                    statName: 'seisankatudou/mugi'
                  },
                  {
                    label: '葉たばこ販売重量',
                    statName: 'seisankatudou/tabako'
                  },
                  {
                    label: '乳用牛飼養頭数',
                    statName: 'seisankatudou/nyuuyougyuu'
                  },
                  {
                    label: '肉用牛飼養頭数',
                    statName: 'seisankatudou/nikuyougyuu'
                  },
                  {
                    label: '豚飼養頭数',
                    statName: 'seisankatudou/buta'
                  },
                  {
                    label: '採卵鶏飼養羽数',
                    statName: 'seisankatudou/sairankei'
                  },
                  {
                    label: 'ブロイラー出荷羽数',
                    statName: 'seisankatudou/bro'
                  },
                  {
                    label: '製造品出荷額等(製造、加工、その他)',
                    statName: 'seisankatudou/seizouhin'
                  },
                  {
                    label: '1事業所当たり製造品出荷額等(製造、加工、その他)',
                    statName: 'seisankatudou/atari0seizouhin'
                  },
                  {
                    label: '従業者1人当たり製造品出荷額等(製造、加工、その他)',
                    statName: 'seisankatudou/atari1seizouhin'
                  },
                  {
                    label: '事業所数',
                    statName: 'seisankatudou/jigyousyosuu'
                  },
                  {
                    label: '従業者数',
                    statName: 'seisankatudou/jyuugyousyasuu'
                  },
                  {
                    label: '1事業所当たり従業者数',
                    statName: 'seisankatudou/atarijyuugyousyasuu'
                  },
                  {
                    label: '商業年間商品販売額',
                    statName: 'seisankatudou/nenkanhanbaigaku'
                  },
                  {
                    label: '1商店当たり商業年間商品販売額',
                    statName: 'seisankatudou/atari0nenkanhanbaigaku'
                  },
                  {
                    label: '従業者1人当たり商業年間商品販売額',
                    statName: 'seisankatudou/atari1nenkanhanbaigaku'
                  },
                  {
                    label: '商店数',
                    statName: 'seisankatudou/syoutensuu'
                  },
                  {
                    label: '従業者数',
                    statName: 'seisankatudou/jyuugyousyasuuS'
                  },
                  {
                    label: '1商店当たり従業者数',
                    statName: 'seisankatudou/atarijyuugyousyasuuS'
                  },

                ]
            }
          ]
        },
        {
          label: '住宅',
          children:
            [
              {
                label: '住宅に住む一般世帯',
                statName: 'jyuutaku/ippan'
              },
            ]
        },
        {
          label: '社会保障',
          children:
            [
              {
                label: '生活保護被保護世帯数',
                statName: 'syaho/seihohihogo'
              },
              {
                label: '100世帯あたり生活保護被保護世帯数',
                statName: 'syaho/seihohihogo100atari'
              },
              {
                label: '生活保護被保実人員',
                statName: 'syaho/seihohihogozitu'
              },
              {
                label: '介護保険第1号被保険者に占める認定者割合',
                statName: 'syaho/kaigowariai'
              },
              {
                label: '介護保険受給者１人当たり費用額（年平均1か月）',
                statName: 'syaho/kaigo1atari'
              },
              {
                label: '国民年金被保険者数',
                statName: 'syaho/nenkinsuu'
              },
              {
                label: '老齢年金受給権者状況',
                statName: 'syaho/reoureizyukyuu'
              },
              {
                label: '老齢年金平均年金額',
                statName: 'syaho/reoureiheikin'
              },
            ]
        },
        // {
        //   label: '財政',
        //   children: [{
        //     label: '財政力',
        //     children: [{
        //       label: 'テスト財政力'
        //     }]
        //   },
        //     {
        //       label: '歳入',
        //       children: [{
        //         label: 'テスト歳入'
        //       }]
        //     }]
        // },
        // {
        //   label: '保育・学校教育',
        //   children: [
        //     {
        //       label: '保育所',
        //       children: [{
        //         label: 'テスト保育所'
        //       }]
        //     },
        //     {
        //       label: '幼稚園',
        //       children: [{
        //         label: 'テスト幼稚園'
        //       }]
        //     },
        //     {
        //       label: '幼保連携型認定こども縁',
        //       children: [{
        //         label: 'テストこども園'
        //       }]
        //     },
        //     {
        //       label: '小学校',
        //       children: [{
        //         label: 'テスト小学校'
        //       }]
        //     },
        //     {
        //       label: '中学校',
        //       children: [{
        //         label: 'テスト中学校'
        //       }]
        //     },
        //     {
        //       label: '高等学校',
        //       children: [{
        //         label: 'テスト高等学校'
        //       }]
        //     }
        //   ]
        // }
      ]
  },

  mutations: {
    //-------------------------------------------------------------------------------------------
    clearStat (state,payload) {
      const aaa = state.metaMiyazaki;
      state.metaMiyazaki = null;
      setTimeout(() => {
        state.metaMiyazaki = aaa
      }, 0);
      if(payload === 'leftSide') {
        state.leftStat.stat = '';
        state.leftStat.statData = {};
      } else {
        state.rightStat.stat = '';
        state.rightStat.statData = {};
      }
    },
    metaMiyazakiTimeReset (state) {
      const aaa = state.metaMiyazakiTime;
      state.metaMiyazakiTime = null;
      setTimeout(() => {
        state.metaMiyazakiTime = aaa
      }, 0);
    },

    eStatMetaPrehReset (state) {
      const aaa = state.eStatMetaPreh;
      state.eStatMetaPreh = null;
      setTimeout(() => {
        state.eStatMetaPreh = aaa
      }, 0);
    },
    eStatMetaCityReset (state) {
      const aaa = state.eStatMetaCity;
      state.eStatMetaCity = null;
      setTimeout(() => {
        state.eStatMetaCity = aaa
      }, 0);
    },
    statEstatCityCrear (state) {
      state.leftStatEstatCity.statData = [];
      state.rightStatEstatCity.statData = [];
    },
    yearRangeCityChange (state,payload) {
      state.yearRangeCity = payload
    },
    yearRangePrefChange (state,payload) {
      state.yearRangePref = payload
    },
    transitionSet (state,payload) {
      state.transition = payload
    },
    timeCityReload (state) {
      state.leftStatTimeCity.count = state.leftStatTimeCity.count + 1;
    },
    timePrefReload (state) {
      state.leftStatTimePref.count = state.leftStatTimePref.count + 1;
    },
    timeReload (state) {
      state.leftStatTime.count = state.leftStatTime.count + 1;
      state.leftStatTime.transition = false;
    },
    eStatReload (state,payload) {
      if (payload.side === 'left') {
        state.leftStatEstatPref.count = state.leftStatEstatPref.count + 1;
        state.leftStatEstatCity.count = state.leftStatEstatCity.count + 1;
        // state.leftStatEstatPref.div = payload.div;
      } else {
        state.rightStatEstatPref.count = state.rightStatEstatPref.count + 1;
        state.rightStatEstatCity.count = state.rightStatEstatCity.count + 1;
        // state.leftStatEstatPref.div = payload.div;
      }
    },
    //-------------------------------------------------------------------------------------------
    selectStatEstat (state,payload) {
      // console.time('selectStatEstat');
      // store.commit('base/chartDivLoadingShow', true);
      // const prefCode = payload.prefCode;
      // const prefOrCity = payload.prefOrCity;
      // let citys;
      // if (prefOrCity === 'city') {
      //   citys =Citycodes.filter(val => val.id.substr(0,2) === prefCode.substr(0,2));
      // } else {
      //   citys = ['dummy']
      // }
      // const plomises = [];
      // for (let i in citys) {
      //   plomises[i] =
      //     new Promise(function (resolve) {
      //       const statId = payload.statId.split('/')[0];
      //       const cat01 = payload.statId.split('/')[1];
      //       const unit = payload.statId.split('/')[2];
      //       const limit = 100000;
      //       const params = {
      //         metaGetFlg: 'Y',
      //         cntGetFlg: 'N',
      //         sectionHeaderFlg: '1',
      //         statsDataId: statId,
      //         cdCat01: cat01,
      //         limit: limit,
      //         appId: eStatApiId
      //       };
      //       if (citys[i] !== 'dummy') {
      //         params['cdArea'] = citys[i].id
      //       }
      //       axios({
      //         method: 'get',
      //         url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
      //         params: params
      //       })
      //       .then(response => {
      //         const times = [];
      //         const dataAr = response.data['GET_STATS_DATA']['STATISTICAL_DATA']['DATA_INF'].VALUE;
      //         for (let i in dataAr) {
      //           times.push(dataAr[i]['@time'])
      //         }
      //         const times2 = times.filter(function (x, i, self) {
      //           return self.indexOf(x) === i;
      //         });
      //         const dataSet = [];
      //         for (const times2Value of times2) {
      //           const data = dataAr.filter(val => val['@time'] === times2Value);
      //           const data2 = [];
      //           for (const dataValue of data) {
      //             if (dataValue['@area'] !== '00000') {
      //               if (payload.prefOrCity === 'pref') {
      //                 const prefs = store.state.base.prefOptions;
      //                 const prefsResult = prefs.find(val => val.value === dataValue['@area']);
      //                 const prefName = prefsResult.label;
      //                 data2.push({
      //                   citycode: dataValue['@area'],
      //                   cityname: prefName,
      //                   data: Number(dataValue['$'])
      //                 })
      //               } else if (payload.prefOrCity === 'city') {
      //                 if (dataValue['@area'].substr(0, 2) === prefCode.substr(0, 2)) {
      //                   // const citysResult = Citycodes.find(val => Number(val.id) === Number(dataValue['@area']));
      //                   // if (citysResult) {
      //                   //   const cityName = citysResult.name;
      //                     data2.push({
      //                       citycode: dataValue['@area'],
      //                       // cityname: cityName,
      //                       cityname: citys[i].name,
      //                       data: Number(dataValue['$'])
      //                     })
      //                   // }
      //                 }
      //               }
      //             }
      //           }
      //           dataSet.push({
      //             time: times2Value,
      //             data: data,
      //             data2: data2
      //           })
      //         }
      //         resolve({dataset: dataSet, unit: unit})
      //       });
      //     });
      // }
      // Promise.all(plomises).then(function (result) {
      //   console.timeEnd('selectStatEstat');
      //   const newDataset = [];
      //   for (let i in result) {
      //     for (let j in result[i].dataset) {
      //       if (i === '0') {
      //         newDataset[j] = {
      //           data: result[i].dataset[j].data,
      //           data2: result[i].dataset[j].data2,
      //           time: result[i].dataset[j].time,
      //         }
      //       } else {
      //         newDataset[j].data.push(result[i].dataset[j].data[0]);
      //         newDataset[j].data2.push(result[i].dataset[j].data2[0]);
      //       }
      //     }
      //   }
      //   let stat;
      //   if (payload.prefOrCity === 'pref') {
      //     stat = payload.side === 'leftSide' ? state.leftStatEstatPref : state.rightStatEstatPref;
      //   } else if (payload.prefOrCity === 'city') {
      //     stat = payload.side === 'leftSide' ? state.leftStatEstatCity : state.rightStatEstatCity;
      //   }
      //   stat.transition = true;
      //   stat.estat = true;
      //   stat.statName = payload.statName;
      //   // stat.statData = result[0].dataset;
      //   stat.statData = newDataset;
      //   stat.unit = result[0].unit;
      //   stat.div = 'all';
      //   store.commit('base/chartDivLoadingShow', false)
      //   console.log(stat)
      // })

      //------------------------------------------------------------------------------------

      console.time('selectStatEstat');
      store.commit('base/chartDivLoadingShow', true);
      const statId = payload.statId.split('/')[0];
      const cat01 = payload.statId.split('/')[1];
      const unit = payload.statId.split('/')[2];
      const prefCode = payload.prefCode;
      const limit = 100000;
      axios({
        method: 'get',
        url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
        params: {
          metaGetFlg: 'N',
          cntGetFlg: 'N',
          sectionHeaderFlg: '1',
          statsDataId: statId,
          // cdArea: cityCode,
          cdCat01: cat01,
          limit: limit,
          appId: eStatApiId
        }
      })
      .then(response => {
        const times = [];
        const dataAr = response.data['GET_STATS_DATA']['STATISTICAL_DATA']['DATA_INF'].VALUE;
        for (let i in dataAr) {
          times.push(dataAr[i]['@time'])
        }
        const times2 = times.filter(function (x, i, self) {
          return self.indexOf(x) === i;
        });
        const dataSet = [];
        for (const times2Value of times2) {
          const data =dataAr.filter(val => val['@time'] === times2Value);
          const data2 = [];
          for (const dataValue of data) {
            // if (dataValue['@area'] !== '00000') {
              if (payload.prefOrCity === 'pref') {
                const prefs = store.state.base.prefOptions;
                const prefsResult = prefs.find(val => val.value === dataValue['@area']);
                const prefName = prefsResult.label;
                data2.push({
                  citycode: dataValue['@area'],
                  cityname: prefName,
                  data: Number(dataValue['$']),
                  time: dataValue['@time']
                })
              } else if (payload.prefOrCity === 'city'){
                if (dataValue['@area'] .substr(0,2) === prefCode.substr(0,2)) {
                  const citysResult = Citycodes.find(val => val.id === dataValue['@area']);
                  if (citysResult) {
                    const kuFlg = function () {
                      if (dataValue['@area'].substr(0,2) === '13') {// 東京都の区は区ではない。
                        return false
                      } else if (dataValue['@area'].substr(2,2) === '13' || dataValue['@area'].substr(2,2) === '14' || dataValue['@area'].substr(2,2) === '15') {// 3桁目が1または13は政令都市
                        if (dataValue['@area'].substr(4, 1) !== '0') {
                          return true
                        } else {
                          return false
                        }
                      } else if (dataValue['@area'].substr(2,1) === '1') {// 3桁目が1または13は政令都市
                        if (Number(dataValue['@area'].substr(3, 3)) > 0) {
                            return true
                        } else {
                          return false
                        }
                      } else {
                        return false
                      }
                      // return dataValue['@area'].substr(2,1)
                    }();
                    if (!kuFlg) {
                      const cityName = citysResult.name;
                      data2.push({
                        citycode: dataValue['@area'],
                        cityname: cityName,
                        data: Number(dataValue['$']),
                        time: dataValue['@time']
                      })
                    }
                  }
                }
              }
            // }
          }
          dataSet.push({
            time: times2Value,
            data: data,
            data2: data2
          })
        }
        console.timeEnd('selectStatEstat');
        let stat;
        if (payload.prefOrCity === 'pref') {
          stat = payload.side === 'leftSide'? state.leftStatEstatPref: state.rightStatEstatPref;
        } else if (payload.prefOrCity === 'city'){
          stat = payload.side === 'leftSide'? state.leftStatEstatCity: state.rightStatEstatCity;
        }
        stat.transition = true;
        stat.estat = true;
        stat.statName = payload.statName;
        stat.statData = dataSet;
        stat.unit = unit;
        stat.div = 'all';
        stat.statsDataId = statId;
        stat.cdCat01 = cat01;
        store.commit('base/chartDivLoadingShow', false)
        // console.log(stat)
      });
    },
    //-------------------------------------------------------------------------------------------
    // 左右サイドのツリーから選択したとき
    selectStat (state,payload) {
      const data = statData;//別ファイルから
      const statName = payload.value.split('/')[0];
      const target = payload.value.split('/')[1];
      const statDataObj = data[statName];
      const column = statDataObj[target].column;
      const title = statDataObj[target].statName;
      const unit = statDataObj[target].unit;
      const data0 = statDataObj.data;
      const data1 = [];
      for (let i in data0) {
        const obj = {
          citycode: data0[i].citycode,
          cityname: data0[i].cityname,
          data: data0[i][column]
        };
        data1.push(obj)
      }
      const data2 = {
        title: title,
        unit: unit,
        data: data1
      };
      // console.log(payload.side)
      let stat;
      if (payload.side === 'leftSide') {
        stat = state.leftStat;
      } else {
        stat = state.rightStat;
      }
      stat.transition = true;
      stat.count = stat.count + 1;
      stat.stat = payload.value;
      stat.statData = data2;
      console.log(stat)
    },

    //-------------------------------------------------------------------------------------------
    selectStatTimeCity (state,payload) {
      if(!payload.cityCode) {
        // alert('市町村を選択してください。')
        // return;
      }
      const statIds = payload.statIds;
      const plomises = [];
      for (let i in statIds) {
        plomises[i] =
          new Promise(function (resolve) {
            const statId = statIds[i].split('/')[0];
            const cat01 = statIds[i].split('/')[1];
            const unit = statIds[i].split('/')[2];
            const cityCode = payload.cityCode;
            // console.log(statId, cat01, unit)
            const limit = 100000;
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
              params: {
                metaGetFlg: 'Y',
                cntGetFlg: 'N',
                sectionHeaderFlg: '1',
                statsDataId: statId,
                cdArea: cityCode,
                cdCat01: cat01,
                limit: limit,
                appId: eStatApiId
              }
            })
            .then(response => {
              const rStatData = response.data['GET_STATS_DATA']['STATISTICAL_DATA'];
              const classObjs = rStatData['CLASS_INF']['CLASS_OBJ'];
              const title = classObjs.find(val => val['@id'] === 'cat01').CLASS['@name'].split('_')[1];
              const data0 = rStatData['DATA_INF'].VALUE;
              const data1 = [];
              if (data0.length) {
                for (let j in data0) {
                  const obj = {
                    nen: '',
                    year: data0[j]['@time'].substr(0, 4),
                    data: Number(data0[j]['$'])
                  };
                  data1.push(obj)
                }
              } else {
                const obj = {
                  nen: '',
                  year: data0['@time'].substr(0, 4),
                  data: Number(data0['$'])
                };
                data1.push(obj)
              }
              const data2 = {
                // nodeId: nodeId,
                stat: statIds[i],
                title: title,
                unit: unit,
                data: data1
              };
              resolve(data2)
            });
          })
      }
      Promise.all(plomises).then(function (result) {
        const stat = state.leftStatTimeCity;
        stat.transition = true;
        stat.count = stat.count + 1;
        stat.endStat = payload.endStat;
        stat.statData = result;
        console.log(stat)
      })
    },
    //-------------------------------------------------------------------------------------------
    selectStatscatterPref (state,payload) {
      const statIds = payload.statIds;
      const plomises = [];
      for (let i in statIds) {
        plomises[i] =
          new Promise(function (resolve) {
            const statId = statIds[i].split('/')[0];
            const cat01 = statIds[i].split('/')[1];
            const unit = statIds[i].split('/')[2];
            const cityCode = payload.cityCode;
            // console.log(statId, cat01, unit)
            const limit = 100000;
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
              params: {
                metaGetFlg: 'Y',
                cntGetFlg: 'N',
                sectionHeaderFlg: '1',
                statsDataId: statId,
                cdArea: cityCode,
                cdCat01: cat01,
                limit: limit,
                appId: eStatApiId
              }
            })
            .then(response => {
              // console.log(response)
              const rStatData = response.data['GET_STATS_DATA']['STATISTICAL_DATA'];
              const classObjs = rStatData['CLASS_INF']['CLASS_OBJ'];
              const title = classObjs.find(val => val['@id'] === 'cat01').CLASS['@name'].split('_')[1];
              const data0 = rStatData['DATA_INF'].VALUE;
              const data1 = [];
              if (data0.length) {
                for (let j in data0) {
                  const obj = {
                    nen: '',
                    year: data0[j]['@time'].substr(0, 4),
                    data: Number(data0[j]['$'])
                  };
                  data1.push(obj)
                }
              } else {
                const obj = {
                  nen: '',
                  year: data0['@time'].substr(0, 4),
                  data: Number(data0['$'])
                };
                data1.push(obj)
              }
              console.log(statIds[i]);
              const data2 = {
                // nodeId: nodeId,
                stat: statIds[i],
                title: title,
                unit: unit,
                data: data1
              };
              resolve(data2)
            });
          })
      }
      Promise.all(plomises).then(function (result) {
        // console.log(result)
        const stat = payload.side === "leftSide"? state.leftStatTimePref: state.rightStatTimePref;
        stat.transition = true;
        stat.count = stat.count + 1;
        stat.stat = 'estat';
        stat.endStat = payload.endStat;
        stat.statData = result;
        console.log(stat)
      })
    },
    //-------------------------------------------------------------------------------------------
    selectStatTimePref (state,payload) {
      const statIds = payload.statIds;
      const plomises = [];
      for (let i in statIds) {
        plomises[i] =
          new Promise(function (resolve) {
            const statId = statIds[i].split('/')[0];
            const cat01 = statIds[i].split('/')[1];
            const unit = statIds[i].split('/')[2];
            const cityCode = payload.cityCode;
            // console.log(statId, cat01, unit)
            const limit = 100000;
            axios({
              method: 'get',
              url: 'https://api.e-stat.go.jp/rest/2.1/app/json/getStatsData',
              params: {
                metaGetFlg: 'Y',
                cntGetFlg: 'N',
                sectionHeaderFlg: '1',
                statsDataId: statId,
                cdArea: cityCode,
                cdCat01: cat01,
                limit: limit,
                appId: eStatApiId
              }
            })
            .then(response => {
              // console.log(response)
              const rStatData = response.data['GET_STATS_DATA']['STATISTICAL_DATA'];
              const classObjs = rStatData['CLASS_INF']['CLASS_OBJ'];
              const title = classObjs.find(val => val['@id'] === 'cat01').CLASS['@name'].split('_')[1];
              const data0 = rStatData['DATA_INF'].VALUE;
              const data1 = [];
              if (data0.length) {
                for (let j in data0) {
                  const obj = {
                    nen: '',
                    year: data0[j]['@time'].substr(0, 4),
                    data: Number(data0[j]['$'])
                  };
                  data1.push(obj)
                }
              } else {
                const obj = {
                  nen: '',
                  year: data0['@time'].substr(0, 4),
                  data: Number(data0['$'])
                };
                data1.push(obj)
              }
              console.log(statIds[i]);
              const data2 = {
                // nodeId: nodeId,
                stat: statIds[i],
                title: title,
                unit: unit,
                data: data1
              };
              resolve(data2)
            });
          })
      }
      Promise.all(plomises).then(function (result) {
        // console.log(result)
        const stat = state.leftStatTimePref;
        stat.transition = true;
        stat.count = stat.count + 1;
        stat.endStat = payload.endStat;
        stat.statData = result;
        console.log(stat)
      })
    },
    //-------------------------------------------------------------------------------------------
    selectStatTime (state,payload) {
      const data = statDataTime;
      const statNames = payload.statNames;
      const statData = [];
      for (let i in statNames) {
        // console.log(statNames[i])
        const statName = statNames[i].split('/')[0];
        // console.log(statName)
        const target = statNames[i].split('/')[1];
        // console.log(target)
        const statDataObj = data[statName];
        // console.log(statDataObj)
        const column = statDataObj[target].column;
        // console.log(column)
        const title = statDataObj[target].statName;
        const unit = statDataObj[target].unit;
        const data0 = statDataObj.data;
        // console.log(data0)
        const data1 = [];
        for (let j in data0) {
          const obj = {
            nen: data0[j].nen,
            year: data0[j].year,
            data: data0[j][column]
          };
          data1.push(obj)
        }
        const data2 = {
          stat: statNames[i],
          title: title,
          unit: unit,
          data: data1
        };
        statData.push(data2)
      }
      // console.log(payload.side)
      let stat;
      if (payload.side === 'leftSide') {
        stat = state.leftStatTime;
      } else {
        stat = state.rightStatTime;
      }
      stat.transition = true;
      stat.count = stat.count + 1;
      stat.endStat = payload.endStat;
      stat.statData = statData
    },
    //-------------------------------------------------------------------------------------------
    statReload (state,payload) {
      if (payload === 'left') {
        state.leftStat.transition = false;
        state.leftStat.count = state.leftStat.count + 1;
      } else {
        state.rightStat.transition = false;
        state.rightStat.count = state.rightStat.count + 1;
      }
    },
    //-------------------------------------------------------------------------------------------
    eStatMetaCitySet (state,payload) {
      const childrenArr = [];
      if (payload.cat01s.length) {
        for (let i in payload.cat01s) {
          // console.log(payload.cat01s[i]);
          const tgt = payload.cat01s[i];
          childrenArr.push({
            statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
            label: tgt['@name'].split('_')[1],
            cat01: tgt['@code'],
            unit: tgt['@unit']
          })
        }
      } else {
        const tgt = payload.cat01s;
        childrenArr.push({
          statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'],
          label: tgt['@name'].split('_')[1],
          cat01: tgt['@code'],
          unit: tgt['@unit']
        })
      }
      const target = state[payload.target];
      target[0].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      });
      target[1].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      });
      target[2].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      })
    },
    //-------------------------------------------------------------------------------------------
    eStatMetaPrehSet (state,payload) {
      const childrenArr = [];
      for (let i in payload.cat01s) {
        const tgt = payload.cat01s[i];
        childrenArr.push({
          statId: payload.statId + '/' + tgt['@code'] + '/' + tgt['@unit'] ,
          label: tgt['@name'].split('_')[1],
          cat01: tgt['@code'],
          unit: tgt['@unit']
        })
      }
      const target = state[payload.target];
      target[0].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      });
      target[1].children.find((value, index, array) => {
        if (value.statId === payload.statId) {
          array[index].children = childrenArr
        }
      })
    }
  }
};
export default statList
