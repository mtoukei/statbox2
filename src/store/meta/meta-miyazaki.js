const metaMiyazaki = [
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
              children: [
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
              children: [
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
];
export default metaMiyazaki
