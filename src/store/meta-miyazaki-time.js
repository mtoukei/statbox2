const metaMiyazakiTime = [
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
  {
    label: '林業',
    children: [
      {
        label: '素材生産量',
        statName: 'ringyou/sozaiseisannryou/千㎥'
      }
    ]
  },
  {
    label: '漁業',
    children: [
      {
        label: '海面漁業漁獲量',
        statName: 'gyogyou/kaimennyogyougyokakuryou/トン'
      }
    ]
  },
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
  {
    label: '労働',
    children: [
      {
        label: '月間給与1人平均',
        statName: 'roudou/gekkankinngakukyuuyosougaku/円'
      },
    ]
  },
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
];
export default metaMiyazakiTime
