import type { School } from '@/types';

export type SchoolCatalogItem = Pick<School, 'id' | 'name' | 'district' | 'type' | 'level' | 'acScore2025' | 'dScore2025' | 'hasBoarding' | 'hasDay' | 'plan2026' | 'totalPlan2025' | 'historicalScores' | 'wenli' | 'founded' | 'traits' | 'reputation'>;

export const schoolCatalog: SchoolCatalogItem[] = [
  {
    "id": "s1",
    "name": "深圳中学",
    "district": "罗湖",
    "type": "公办",
    "level": "四大名校",
    "acScore2025": 593,
    "dScore2025": 593,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1970,
    "totalPlan2025": 1970,
    "historicalScores": {
      "2021": {
        "ac": 576,
        "d": 578,
        "rank": 1
      },
      "2022": {
        "ac": 572,
        "d": 573,
        "rank": 1
      },
      "2023": {
        "ac": 574,
        "d": 575,
        "rank": 1
      },
      "2024": {
        "ac": 567,
        "d": 568,
        "rank": 1
      }
    },
    "wenli": "偏理",
    "founded": 1947,
    "traits": [
      "竞赛强校",
      "管理自由",
      "老牌名校"
    ],
    "reputation": {
      "count": 214,
      "overallSatisfaction": 91.4,
      "teacherQuality": 92.1,
      "teachingQuality": 91.6,
      "managementEffect": 62.7,
      "canteenSatisfaction": 73.5,
      "dormSatisfaction": 91.8,
      "activityRichness": 88,
      "teacherAttention": 75.5,
      "compositeScore": 83.3
    }
  },
  {
    "id": "s2",
    "name": "深圳实验学校（高中部）",
    "district": "南山",
    "type": "公办",
    "level": "四大名校",
    "acScore2025": 589,
    "dScore2025": 589,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 554,
    "totalPlan2025": 554,
    "historicalScores": {
      "2021": {
        "ac": 573,
        "d": 573,
        "rank": 2
      },
      "2022": {
        "ac": 571,
        "d": 571,
        "rank": 2
      },
      "2023": {
        "ac": 573,
        "d": 574,
        "rank": 2
      },
      "2024": {
        "ac": 567,
        "d": 567,
        "rank": 2
      }
    },
    "wenli": "偏理",
    "founded": 2023,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s3",
    "name": "深圳市高级中学中心校区",
    "district": "福田",
    "type": "公办",
    "level": "四大名校",
    "acScore2025": 588,
    "dScore2025": 588,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 945,
    "totalPlan2025": 945,
    "historicalScores": {
      "2021": {
        "ac": 568,
        "d": 570,
        "rank": 4
      },
      "2022": {
        "ac": 570,
        "d": 566,
        "rank": 3
      },
      "2023": {
        "ac": 572,
        "d": 572,
        "rank": 3
      },
      "2024": {
        "ac": 565,
        "d": 565,
        "rank": 4
      }
    },
    "wenli": "偏文",
    "founded": 2022,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 718,
      "overallSatisfaction": 84.4,
      "teacherQuality": 86.5,
      "teachingQuality": 86.8,
      "managementEffect": 64.4,
      "canteenSatisfaction": 53.2,
      "dormSatisfaction": 64,
      "activityRichness": 70.5,
      "teacherAttention": 79.1,
      "compositeScore": 73.6
    }
  },
  {
    "id": "s4",
    "name": "深圳外国语学校",
    "district": "盐田",
    "type": "公办",
    "level": "四大名校",
    "acScore2025": 587,
    "dScore2025": 587,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 831,
    "totalPlan2025": 831,
    "historicalScores": {
      "2021": {
        "ac": 570,
        "d": 569,
        "rank": 3
      },
      "2022": {
        "ac": 570,
        "d": 568,
        "rank": 4
      },
      "2023": {
        "ac": 572,
        "d": 572,
        "rank": 4
      },
      "2024": {
        "ac": 565,
        "d": 565,
        "rank": 3
      }
    },
    "wenli": "偏文",
    "founded": 1990,
    "traits": [
      "外语特色",
      "老牌名校"
    ],
    "reputation": {
      "count": 527,
      "overallSatisfaction": 84.7,
      "teacherQuality": 83.5,
      "teachingQuality": 85.5,
      "managementEffect": 64.7,
      "canteenSatisfaction": 65.7,
      "dormSatisfaction": 72,
      "activityRichness": 78,
      "teacherAttention": 80.9,
      "compositeScore": 76.9
    }
  },
  {
    "id": "s5",
    "name": "红岭中学",
    "district": "福田",
    "type": "公办",
    "level": "八大名校",
    "acScore2025": 584,
    "dScore2025": 584,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1312,
    "totalPlan2025": 1312,
    "historicalScores": {
      "2021": {
        "ac": 564,
        "d": 566,
        "rank": 5
      },
      "2022": {
        "ac": 566,
        "d": 562,
        "rank": 5
      },
      "2023": {
        "ac": 569,
        "d": 570,
        "rank": 5
      },
      "2024": {
        "ac": 560,
        "d": 561,
        "rank": 5
      }
    },
    "wenli": "偏理",
    "founded": 2023,
    "traits": [
      "新兴学校"
    ],
    "reputation": {
      "count": 144,
      "overallSatisfaction": 88,
      "teacherQuality": 86.6,
      "teachingQuality": 87.8,
      "managementEffect": 67.2,
      "canteenSatisfaction": 91.6,
      "dormSatisfaction": 75.6,
      "activityRichness": 82.2,
      "teacherAttention": 84,
      "compositeScore": 82.9
    }
  },
  {
    "id": "s6",
    "name": "育才中学",
    "district": "南山",
    "type": "公办",
    "level": "八大名校",
    "acScore2025": 582,
    "dScore2025": 582,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 770,
    "totalPlan2025": 770,
    "historicalScores": {
      "2021": {
        "ac": 557,
        "d": 559,
        "rank": 9
      },
      "2022": {
        "ac": 562,
        "d": 557,
        "rank": 9
      },
      "2023": {
        "ac": 567,
        "d": 567,
        "rank": 8
      },
      "2024": {
        "ac": 559,
        "d": 559,
        "rank": 7
      }
    },
    "wenli": "偏理",
    "founded": 1983,
    "traits": [
      "管理严格",
      "老牌名校"
    ],
    "reputation": {
      "count": 52,
      "overallSatisfaction": 90,
      "teacherQuality": 90,
      "teachingQuality": 93.3,
      "managementEffect": 65,
      "canteenSatisfaction": 70.6,
      "dormSatisfaction": 63.3,
      "activityRichness": 80,
      "teacherAttention": 85.6,
      "compositeScore": 79.7
    }
  },
  {
    "id": "s7",
    "name": "宝安中学（集团）高中部",
    "district": "宝安",
    "type": "公办",
    "level": "八大名校",
    "acScore2025": 582,
    "dScore2025": 580,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 561,
        "d": 566,
        "rank": 6
      },
      "2022": {
        "ac": 564,
        "d": 564,
        "rank": 6
      },
      "2023": {
        "ac": 568,
        "d": 569,
        "rank": 6
      },
      "2024": {
        "ac": 559,
        "d": 560,
        "rank": 6
      }
    },
    "wenli": "偏理",
    "founded": 1984,
    "traits": [
      "老牌名校"
    ],
    "reputation": {
      "count": 194,
      "overallSatisfaction": 88.3,
      "teacherQuality": 84.6,
      "teachingQuality": 88.9,
      "managementEffect": 61.2,
      "canteenSatisfaction": 90.3,
      "dormSatisfaction": 83.3,
      "activityRichness": 73.6,
      "teacherAttention": 83.6,
      "compositeScore": 81.7
    }
  },
  {
    "id": "s8",
    "name": "深圳市南山外国语学校（集团）高级中学",
    "district": "南山",
    "type": "公办",
    "level": "八大名校",
    "acScore2025": 577,
    "dScore2025": 575,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2021": {
        "ac": 558,
        "d": 559,
        "rank": 8
      },
      "2022": {
        "ac": 562,
        "d": 558,
        "rank": 8
      },
      "2023": {
        "ac": 561,
        "d": 563,
        "rank": 13
      },
      "2024": {
        "ac": 551,
        "d": 551,
        "rank": 11
      }
    },
    "wenli": "偏理",
    "founded": 2004,
    "traits": [
      "外语特色",
      "管理严格"
    ]
  },
  {
    "id": "s9",
    "name": "深圳大学附属中学（深大附中）",
    "district": "南山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 580,
    "dScore2025": 580,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 660,
    "totalPlan2025": 660,
    "historicalScores": {
      "2021": {
        "ac": 560,
        "d": 562,
        "rank": 7
      },
      "2022": {
        "ac": 563,
        "d": 560,
        "rank": 7
      },
      "2023": {
        "ac": 567,
        "d": 567,
        "rank": 7
      },
      "2024": {
        "ac": 558,
        "d": 558,
        "rank": 8
      }
    },
    "wenli": "均衡",
    "founded": 1986,
    "traits": [
      "艺术特色",
      "老牌名校"
    ],
    "reputation": {
      "count": 57,
      "overallSatisfaction": 89.8,
      "teacherQuality": 89.3,
      "teachingQuality": 87.7,
      "managementEffect": 68,
      "canteenSatisfaction": 72.3,
      "dormSatisfaction": 85.1,
      "activityRichness": 74.7,
      "teacherAttention": 83.3,
      "compositeScore": 81.3
    }
  },
  {
    "id": "s10",
    "name": "北师大南山附属学校高中部",
    "district": "南山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 580,
    "dScore2025": 580,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 440,
    "totalPlan2025": 440,
    "historicalScores": {
      "2021": {
        "ac": 542,
        "d": 542,
        "rank": 14
      },
      "2022": {
        "ac": 556,
        "d": 550,
        "rank": 13
      },
      "2023": {
        "ac": 563,
        "d": 561,
        "rank": 10
      },
      "2024": {
        "ac": 556,
        "d": 556,
        "rank": 9
      }
    },
    "wenli": "偏理",
    "founded": 2000,
    "traits": [
      "管理严格"
    ],
    "reputation": {
      "count": 75,
      "overallSatisfaction": 85.2,
      "teacherQuality": 79.5,
      "teachingQuality": 84,
      "managementEffect": 67,
      "canteenSatisfaction": 64.1,
      "dormSatisfaction": 74.3,
      "activityRichness": 61.1,
      "teacherAttention": 86.7,
      "compositeScore": 75.2
    }
  },
  {
    "id": "s11",
    "name": "深圳科学高中",
    "district": "龙岗",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 578,
    "dScore2025": 578,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1155,
    "totalPlan2025": 1155,
    "historicalScores": {
      "2021": {
        "ac": 553,
        "d": 557,
        "rank": 10
      },
      "2022": {
        "ac": 559,
        "d": 554,
        "rank": 10
      },
      "2023": {
        "ac": 565,
        "d": 565,
        "rank": 9
      },
      "2024": {
        "ac": 555,
        "d": 557,
        "rank": 10
      }
    },
    "wenli": "偏理",
    "founded": 2012,
    "traits": [
      "管理严格"
    ],
    "reputation": {
      "count": 131,
      "overallSatisfaction": 91.5,
      "teacherQuality": 88.7,
      "teachingQuality": 90.5,
      "managementEffect": 64.3,
      "canteenSatisfaction": 76.9,
      "dormSatisfaction": 86.3,
      "activityRichness": 78,
      "teacherAttention": 89.3,
      "compositeScore": 83.2
    }
  },
  {
    "id": "s12",
    "name": "深圳市第二高级中学",
    "district": "南山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 575,
    "dScore2025": 572,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1100,
    "totalPlan2025": 1100,
    "historicalScores": {
      "2021": {
        "ac": 548,
        "d": 552,
        "rank": 11
      },
      "2022": {
        "ac": 556,
        "d": 550,
        "rank": 12
      },
      "2023": {
        "ac": 561,
        "d": 561,
        "rank": 12
      },
      "2024": {
        "ac": 551,
        "d": 550,
        "rank": 12
      }
    },
    "wenli": "偏理",
    "founded": 2007,
    "reputation": {
      "count": 109,
      "overallSatisfaction": 84.8,
      "teacherQuality": 80.6,
      "teachingQuality": 80.8,
      "managementEffect": 60.9,
      "canteenSatisfaction": 58.9,
      "dormSatisfaction": 70.5,
      "activityRichness": 76.5,
      "teacherAttention": 81.7,
      "compositeScore": 74.3
    }
  },
  {
    "id": "s13",
    "name": "翠园中学",
    "district": "罗湖",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 575,
    "dScore2025": 574,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 735,
    "totalPlan2025": 735,
    "historicalScores": {
      "2021": {
        "ac": 545,
        "d": 553,
        "rank": 13
      },
      "2022": {
        "ac": 552,
        "d": 546,
        "rank": 16
      },
      "2023": {
        "ac": 559,
        "d": 558,
        "rank": 15
      },
      "2024": {
        "ac": 548,
        "d": 549,
        "rank": 15
      }
    },
    "wenli": "均衡",
    "founded": 1964,
    "traits": [
      "老牌名校"
    ],
    "reputation": {
      "count": 192,
      "overallSatisfaction": 84.5,
      "teacherQuality": 86.4,
      "teachingQuality": 85.4,
      "managementEffect": 65.1,
      "canteenSatisfaction": 62.2,
      "dormSatisfaction": 63.5,
      "activityRichness": 67.7,
      "teacherAttention": 81.1,
      "compositeScore": 74.5
    }
  },
  {
    "id": "s14",
    "name": "龙城高级中学",
    "district": "龙岗",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 575,
    "dScore2025": 575,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 539,
        "d": 551,
        "rank": 16
      },
      "2022": {
        "ac": 553,
        "d": 550,
        "rank": 14
      },
      "2023": {
        "ac": 560,
        "d": 561,
        "rank": 14
      },
      "2024": {
        "ac": 550,
        "d": 551,
        "rank": 13
      }
    },
    "wenli": "偏理",
    "founded": 1995,
    "traits": [
      "管理严格"
    ],
    "reputation": {
      "count": 53,
      "overallSatisfaction": 85.5,
      "teacherQuality": 86,
      "teachingQuality": 88.7,
      "managementEffect": 67.9,
      "canteenSatisfaction": 79.1,
      "dormSatisfaction": 89.6,
      "activityRichness": 81.9,
      "teacherAttention": 86.8,
      "compositeScore": 83.2
    }
  },
  {
    "id": "s15",
    "name": "南方科技大学附属中学",
    "district": "宝安",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 574,
    "dScore2025": 574,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 840,
    "totalPlan2025": 840,
    "historicalScores": {
      "2021": {
        "ac": 546,
        "d": 552,
        "rank": 12
      },
      "2022": {
        "ac": 558,
        "d": 554,
        "rank": 11
      },
      "2023": {
        "ac": 561,
        "d": 562,
        "rank": 11
      },
      "2024": {
        "ac": 549,
        "d": 552,
        "rank": 14
      }
    },
    "wenli": "偏理",
    "founded": 2020,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 111,
      "overallSatisfaction": 82,
      "teacherQuality": 88.1,
      "teachingQuality": 88.7,
      "managementEffect": 57.3,
      "canteenSatisfaction": 68.3,
      "dormSatisfaction": 82.2,
      "activityRichness": 72.6,
      "teacherAttention": 80.7,
      "compositeScore": 77.5
    }
  },
  {
    "id": "s16",
    "name": "龙华高级中学",
    "district": "龙华",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 571,
    "dScore2025": 570,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2021": {
        "ac": 529,
        "d": 538,
        "rank": 23
      },
      "2022": {
        "ac": 548,
        "d": 545,
        "rank": 19
      },
      "2023": {
        "ac": 557,
        "d": 558,
        "rank": 18
      },
      "2024": {
        "ac": 546,
        "d": 546,
        "rank": 17
      }
    },
    "wenli": "偏理",
    "founded": 2018,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 26,
      "overallSatisfaction": 81.2,
      "teacherQuality": 80.8,
      "teachingQuality": 78.8,
      "managementEffect": 64.3,
      "canteenSatisfaction": 92.3,
      "dormSatisfaction": 69.2,
      "activityRichness": 64.6,
      "teacherAttention": 82.7,
      "compositeScore": 76.7
    }
  },
  {
    "id": "s17",
    "name": "人大附中深圳学校",
    "district": "大鹏",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 571,
    "dScore2025": 570,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1210,
    "totalPlan2025": 1210,
    "historicalScores": {
      "2021": {
        "ac": 531,
        "d": 544,
        "rank": 19
      },
      "2022": {
        "ac": 546,
        "d": 546,
        "rank": 20
      },
      "2023": {
        "ac": 556,
        "d": 557,
        "rank": 19
      },
      "2024": {
        "ac": 545,
        "d": 544,
        "rank": 18
      }
    },
    "wenli": "均衡",
    "founded": 2016,
    "traits": [
      "新兴学校"
    ],
    "reputation": {
      "count": 103,
      "overallSatisfaction": 88.5,
      "teacherQuality": 88.1,
      "teachingQuality": 86.9,
      "managementEffect": 65.4,
      "canteenSatisfaction": 91.7,
      "dormSatisfaction": 87,
      "activityRichness": 74.4,
      "teacherAttention": 84.7,
      "compositeScore": 83.3
    }
  },
  {
    "id": "s18",
    "name": "深圳市第二实验学校",
    "district": "罗湖",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 568,
    "dScore2025": 570,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 472,
    "totalPlan2025": 472,
    "historicalScores": {
      "2021": {
        "ac": 540,
        "d": 547,
        "rank": 15
      },
      "2022": {
        "ac": 552,
        "d": 548,
        "rank": 15
      },
      "2023": {
        "ac": 558,
        "d": 558,
        "rank": 16
      },
      "2024": {
        "ac": 548,
        "d": 545,
        "rank": 16
      }
    },
    "wenli": "均衡",
    "founded": 1989,
    "traits": [
      "管理严格",
      "老牌名校"
    ],
    "reputation": {
      "count": 46,
      "overallSatisfaction": 84.3,
      "teacherQuality": 84.8,
      "teachingQuality": 87,
      "managementEffect": 61.7,
      "canteenSatisfaction": 73.3,
      "dormSatisfaction": 87.2,
      "activityRichness": 68.7,
      "teacherAttention": 85.9,
      "compositeScore": 79.1
    }
  },
  {
    "id": "s19",
    "name": "深圳实验学校光明高中部",
    "district": "光明",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 567,
    "dScore2025": 570,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 531,
        "d": 546,
        "rank": 20
      },
      "2022": {
        "ac": 551,
        "d": 549,
        "rank": 17
      },
      "2023": {
        "ac": 557,
        "d": 559,
        "rank": 17
      },
      "2024": {
        "ac": 543,
        "d": 547,
        "rank": 19
      }
    },
    "wenli": "均衡",
    "reputation": {
      "count": 77,
      "overallSatisfaction": 81.7,
      "teacherQuality": 82.2,
      "teachingQuality": 85.8,
      "managementEffect": 64.5,
      "canteenSatisfaction": 41.8,
      "dormSatisfaction": 84.4,
      "activityRichness": 76.6,
      "teacherAttention": 84.4,
      "compositeScore": 75.2
    }
  },
  {
    "id": "s20",
    "name": "深圳外国语学校龙华高中部",
    "district": "龙华",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 567,
    "dScore2025": 567,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 945,
    "totalPlan2025": 945,
    "historicalScores": {
      "2021": {
        "ac": 529,
        "d": 537,
        "rank": 22
      },
      "2022": {
        "ac": 542,
        "d": 534,
        "rank": 23
      },
      "2023": {
        "ac": 555,
        "d": 552,
        "rank": 20
      },
      "2024": {
        "ac": 543,
        "d": 541,
        "rank": 20
      }
    },
    "wenli": "偏理",
    "founded": 2017,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s21",
    "name": "广东实验中学深圳学校",
    "district": "龙岗",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 567,
    "dScore2025": 568,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 735,
    "totalPlan2025": 735,
    "historicalScores": {
      "2021": {
        "ac": 526,
        "d": 536,
        "rank": 24
      },
      "2022": {
        "ac": 546,
        "d": 543,
        "rank": 21
      },
      "2023": {
        "ac": 554,
        "d": 556,
        "rank": 21
      },
      "2024": {
        "ac": 542,
        "d": 543,
        "rank": 21
      }
    },
    "wenli": "偏理",
    "founded": 2021,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 83,
      "overallSatisfaction": 82.4,
      "teacherQuality": 81.3,
      "teachingQuality": 82.2,
      "managementEffect": 60.6,
      "canteenSatisfaction": 66.3,
      "dormSatisfaction": 92.8,
      "activityRichness": 70.6,
      "teacherAttention": 81.9,
      "compositeScore": 77.3
    }
  },
  {
    "id": "s22",
    "name": "育才中学蛇口校区",
    "district": "南山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 567,
    "dScore2025": 566,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 880,
    "totalPlan2025": 880,
    "wenli": "偏理",
    "founded": 1983,
    "traits": [
      "老牌名校"
    ]
  },
  {
    "id": "s23",
    "name": "深圳市高级中学东校区",
    "district": "坪山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 566,
    "dScore2025": 564,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 529,
        "d": 540,
        "rank": 21
      },
      "2022": {
        "ac": 540,
        "d": 540,
        "rank": 25
      },
      "2023": {
        "ac": 554,
        "d": 553,
        "rank": 23
      },
      "2024": {
        "ac": 541,
        "d": 538,
        "rank": 22
      }
    },
    "wenli": "均衡",
    "reputation": {
      "count": 122,
      "overallSatisfaction": 87.1,
      "teacherQuality": 84.4,
      "teachingQuality": 87.7,
      "managementEffect": 64.9,
      "canteenSatisfaction": 61.4,
      "dormSatisfaction": 69.7,
      "activityRichness": 81.6,
      "teacherAttention": 86.1,
      "compositeScore": 77.9
    }
  },
  {
    "id": "s24",
    "name": "新安中学（集团）高中部",
    "district": "宝安",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 565,
    "dScore2025": 567,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 840,
    "totalPlan2025": 840,
    "historicalScores": {
      "2021": {
        "ac": 535,
        "d": 545,
        "rank": 18
      },
      "2022": {
        "ac": 549,
        "d": 545,
        "rank": 18
      },
      "2023": {
        "ac": 554,
        "d": 555,
        "rank": 22
      },
      "2024": {
        "ac": 540,
        "d": 542,
        "rank": 23
      }
    },
    "wenli": "偏理",
    "founded": 2017,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 21,
      "overallSatisfaction": 87.1,
      "teacherQuality": 83.3,
      "teachingQuality": 88.1,
      "managementEffect": 63.3,
      "canteenSatisfaction": 70,
      "dormSatisfaction": 70.6,
      "activityRichness": 69.5,
      "teacherAttention": 78.6,
      "compositeScore": 76.3
    }
  },
  {
    "id": "s25",
    "name": "深圳大学附属实验中学",
    "district": "光明",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 564,
    "dScore2025": 566,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2021": {
        "ac": 503,
        "d": 526,
        "rank": 37
      },
      "2022": {
        "ac": 533,
        "d": 530,
        "rank": 31
      },
      "2023": {
        "ac": 549,
        "d": 550,
        "rank": 28
      },
      "2024": {
        "ac": 537,
        "d": 539,
        "rank": 26
      }
    },
    "wenli": "偏理",
    "founded": 2021,
    "traits": [
      "管理严格",
      "新兴学校"
    ]
  },
  {
    "id": "s26",
    "name": "深圳科学高中龙岗分校",
    "district": "龙岗",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 563,
    "dScore2025": 565,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 577,
    "totalPlan2025": 577,
    "historicalScores": {
      "2021": {
        "ac": 535,
        "d": 535,
        "rank": 17
      },
      "2022": {
        "ac": 544,
        "d": 540,
        "rank": 22
      },
      "2023": {
        "ac": 552,
        "d": 554,
        "rank": 24
      },
      "2024": {
        "ac": 538,
        "d": 539,
        "rank": 25
      }
    },
    "wenli": "均衡",
    "founded": 2021,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s27",
    "name": "华中师范大学龙岗附属中学",
    "district": "龙岗",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 563,
    "dScore2025": 563,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 517,
        "d": 536,
        "rank": 28
      },
      "2022": {
        "ac": 537,
        "d": 536,
        "rank": 27
      },
      "2023": {
        "ac": 550,
        "d": 551,
        "rank": 25
      },
      "2024": {
        "ac": 539,
        "d": 537,
        "rank": 24
      }
    },
    "wenli": "均衡",
    "founded": 2013,
    "reputation": {
      "count": 39,
      "overallSatisfaction": 76.4,
      "teacherQuality": 73.8,
      "teachingQuality": 78.2,
      "managementEffect": 61.2,
      "canteenSatisfaction": 51.8,
      "dormSatisfaction": 71.4,
      "activityRichness": 71.3,
      "teacherAttention": 75.6,
      "compositeScore": 70
    }
  },
  {
    "id": "s28",
    "name": "深圳北理莫斯科大学附属实验中学",
    "district": "龙岗",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 562,
    "dScore2025": 563,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2023": {
        "ac": 546,
        "d": 546,
        "rank": 30
      },
      "2024": {
        "ac": 534,
        "d": 535,
        "rank": 28
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s29",
    "name": "中国科学院深圳理工大学附属实验高级中学",
    "district": "光明",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 560,
    "dScore2025": 559,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 735,
    "totalPlan2025": 735,
    "historicalScores": {
      "2021": {
        "ac": 496,
        "d": 533,
        "rank": 40
      },
      "2022": {
        "ac": 523,
        "d": 531,
        "rank": 37
      },
      "2023": {
        "ac": 542,
        "d": 546,
        "rank": 39
      },
      "2024": {
        "ac": 528,
        "d": 531,
        "rank": 34
      }
    },
    "wenli": "偏理",
    "founded": 2021,
    "traits": [
      "管理严格",
      "新兴学校"
    ]
  },
  {
    "id": "s30",
    "name": "南头中学",
    "district": "南山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 559,
    "dScore2025": 560,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 924,
    "totalPlan2025": 924,
    "historicalScores": {
      "2021": {
        "ac": 522,
        "d": 537,
        "rank": 26
      },
      "2022": {
        "ac": 538,
        "d": 533,
        "rank": 26
      },
      "2023": {
        "ac": 549,
        "d": 551,
        "rank": 26
      },
      "2024": {
        "ac": 533,
        "d": 538,
        "rank": 30
      }
    },
    "wenli": "均衡",
    "founded": 1801,
    "traits": [
      "老牌名校"
    ],
    "reputation": {
      "count": 28,
      "overallSatisfaction": 81.8,
      "teacherQuality": 75.7,
      "teachingQuality": 77.1,
      "managementEffect": 70,
      "canteenSatisfaction": 64.6,
      "dormSatisfaction": 68.8,
      "activityRichness": 72.9,
      "teacherAttention": 72.1,
      "compositeScore": 72.9
    }
  },
  {
    "id": "s31",
    "name": "东北师范大学附属中学深圳学校",
    "district": "坪山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 558,
    "dScore2025": 561,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 660,
    "totalPlan2025": 660,
    "historicalScores": {
      "2021": {
        "ac": 485,
        "d": 525,
        "rank": 46
      },
      "2022": {
        "ac": 526,
        "d": 528,
        "rank": 36
      },
      "2023": {
        "ac": 546,
        "d": 549,
        "rank": 31
      },
      "2024": {
        "ac": 535,
        "d": 534,
        "rank": 27
      }
    },
    "wenli": "偏理",
    "founded": 2021,
    "traits": [
      "管理严格",
      "新兴学校"
    ]
  },
  {
    "id": "s32",
    "name": "盐田高级中学",
    "district": "盐田",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 557,
    "dScore2025": 559,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 524,
        "d": 538,
        "rank": 25
      },
      "2022": {
        "ac": 542,
        "d": 538,
        "rank": 24
      },
      "2023": {
        "ac": 549,
        "d": 553,
        "rank": 27
      },
      "2024": {
        "ac": 533,
        "d": 533,
        "rank": 29
      }
    },
    "wenli": "偏理",
    "founded": 1984,
    "traits": [
      "艺术特色",
      "管理严格",
      "老牌名校"
    ],
    "reputation": {
      "count": 22,
      "overallSatisfaction": 83.2,
      "teacherQuality": 82.3,
      "teachingQuality": 93.2,
      "managementEffect": 66,
      "canteenSatisfaction": 55,
      "dormSatisfaction": 70,
      "activityRichness": 78.2,
      "teacherAttention": 95.5,
      "compositeScore": 77.9
    }
  },
  {
    "id": "s33",
    "name": "深圳市红山中学",
    "district": "龙华",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 555,
    "dScore2025": 558,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2021": {
        "ac": 496,
        "d": 530,
        "rank": 41
      },
      "2022": {
        "ac": 521,
        "d": 527,
        "rank": 38
      },
      "2023": {
        "ac": 544,
        "d": 547,
        "rank": 37
      },
      "2024": {
        "ac": 529,
        "d": 531,
        "rank": 33
      }
    },
    "wenli": "偏理",
    "founded": 2021,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 24,
      "overallSatisfaction": 80.4,
      "teacherQuality": 74.6,
      "teachingQuality": 75,
      "managementEffect": 67.5,
      "canteenSatisfaction": 76.7,
      "dormSatisfaction": 82.6,
      "activityRichness": 63.3,
      "teacherAttention": 80,
      "compositeScore": 75
    }
  },
  {
    "id": "s34",
    "name": "深圳市格致中学",
    "district": "龙华",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 555,
    "dScore2025": 559,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2021": {
        "ac": 503,
        "d": 530,
        "rank": 36
      },
      "2022": {
        "ac": 529,
        "d": 533,
        "rank": 33
      },
      "2023": {
        "ac": 545,
        "d": 549,
        "rank": 33
      },
      "2024": {
        "ac": 530,
        "d": 533,
        "rank": 31
      }
    },
    "wenli": "偏理",
    "founded": 2021,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 16,
      "overallSatisfaction": 80.6,
      "teacherQuality": 73.8,
      "teachingQuality": 78.1,
      "managementEffect": 64.5,
      "canteenSatisfaction": 52.5,
      "dormSatisfaction": 80,
      "activityRichness": 62.5,
      "teacherAttention": 84.4,
      "compositeScore": 72
    }
  },
  {
    "id": "s35",
    "name": "华侨城高级中学",
    "district": "南山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 554,
    "dScore2025": 555,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 840,
    "totalPlan2025": 840,
    "historicalScores": {
      "2021": {
        "ac": 512,
        "d": 528,
        "rank": 30
      },
      "2022": {
        "ac": 534,
        "d": 526,
        "rank": 30
      },
      "2023": {
        "ac": 547,
        "d": 547,
        "rank": 29
      },
      "2024": {
        "ac": 530,
        "d": 532,
        "rank": 32
      }
    },
    "wenli": "偏理",
    "founded": 1981,
    "traits": [
      "老牌名校"
    ],
    "reputation": {
      "count": 24,
      "overallSatisfaction": 78.3,
      "teacherQuality": 70.8,
      "teachingQuality": 83.3,
      "managementEffect": 66.7,
      "canteenSatisfaction": 62.9,
      "dormSatisfaction": 81.2,
      "activityRichness": 56.7,
      "teacherAttention": 83.3,
      "compositeScore": 72.9
    }
  },
  {
    "id": "s36",
    "name": "深圳市龙岗区实验高级中学",
    "district": "龙岗",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 554,
    "dScore2025": 558,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 440,
    "totalPlan2025": 440,
    "historicalScores": {
      "2022": {
        "ac": 495,
        "d": 523,
        "rank": 48
      },
      "2023": {
        "ac": 532,
        "d": 545,
        "rank": 45
      },
      "2024": {
        "ac": 523,
        "d": 530,
        "rank": 39
      }
    },
    "wenli": "偏理",
    "founded": 2022,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 12,
      "overallSatisfaction": 80.8,
      "teacherQuality": 81.7,
      "teachingQuality": 83.3,
      "managementEffect": 60,
      "canteenSatisfaction": 63.3,
      "dormSatisfaction": 83.3,
      "activityRichness": 60,
      "teacherAttention": 91.7,
      "compositeScore": 75.5
    }
  },
  {
    "id": "s37",
    "name": "深圳市高级中学创新高中",
    "district": "龙岗",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 549,
    "dScore2025": 556,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 880,
    "totalPlan2025": 880,
    "historicalScores": {
      "2022": {
        "ac": 529,
        "d": 517,
        "rank": 32
      },
      "2023": {
        "ac": 544,
        "d": 541,
        "rank": 35
      },
      "2024": {
        "ac": 526,
        "d": 528,
        "rank": 37
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s38",
    "name": "罗湖外语学校",
    "district": "罗湖",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 549,
    "dScore2025": 556,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 835,
    "totalPlan2025": 835,
    "historicalScores": {
      "2021": {
        "ac": 509,
        "d": 531,
        "rank": 32
      },
      "2022": {
        "ac": 527,
        "d": 529,
        "rank": 35
      },
      "2023": {
        "ac": 542,
        "d": 544,
        "rank": 38
      },
      "2024": {
        "ac": 522,
        "d": 525,
        "rank": 42
      }
    },
    "wenli": "均衡",
    "reputation": {
      "count": 22,
      "overallSatisfaction": 76.4,
      "teacherQuality": 66.8,
      "teachingQuality": 70.5,
      "managementEffect": 66.5,
      "canteenSatisfaction": 44.1,
      "dormSatisfaction": 53.6,
      "activityRichness": 69.1,
      "teacherAttention": 88.6,
      "compositeScore": 67
    }
  },
  {
    "id": "s39",
    "name": "松岗中学",
    "district": "宝安",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 549,
    "dScore2025": 556,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 420,
    "totalPlan2025": 420,
    "historicalScores": {
      "2021": {
        "ac": 513,
        "d": 535,
        "rank": 29
      },
      "2022": {
        "ac": 535,
        "d": 533,
        "rank": 29
      },
      "2023": {
        "ac": 545,
        "d": 546,
        "rank": 34
      },
      "2024": {
        "ac": 527,
        "d": 530,
        "rank": 35
      }
    },
    "wenli": "偏理",
    "founded": 1945,
    "traits": [
      "老牌名校"
    ],
    "reputation": {
      "count": 5,
      "overallSatisfaction": 78,
      "teacherQuality": 82,
      "teachingQuality": 80,
      "managementEffect": 70,
      "canteenSatisfaction": 60,
      "dormSatisfaction": 75,
      "activityRichness": 68,
      "teacherAttention": 80,
      "compositeScore": 74.1
    }
  },
  {
    "id": "s40",
    "name": "福田中学",
    "district": "福田",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 549,
    "dScore2025": 555,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 488,
        "d": 521,
        "rank": 44
      },
      "2022": {
        "ac": 506,
        "d": 510,
        "rank": 43
      },
      "2023": {
        "ac": 538,
        "d": 541,
        "rank": 41
      },
      "2024": {
        "ac": 523,
        "d": 526,
        "rank": 41
      }
    },
    "wenli": "偏文",
    "founded": 1969,
    "traits": [
      "外语特色",
      "管理严格",
      "老牌名校"
    ],
    "reputation": {
      "count": 52,
      "overallSatisfaction": 82.3,
      "teacherQuality": 76.7,
      "teachingQuality": 77.9,
      "managementEffect": 64.4,
      "canteenSatisfaction": 62.1,
      "dormSatisfaction": 84.7,
      "activityRichness": 63.1,
      "teacherAttention": 80.2,
      "compositeScore": 73.9
    }
  },
  {
    "id": "s41",
    "name": "宝安第一外国语学校",
    "district": "宝安",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 548,
    "dScore2025": 553,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 800,
    "totalPlan2025": 800,
    "historicalScores": {
      "2021": {
        "ac": 518,
        "d": 535,
        "rank": 27
      },
      "2022": {
        "ac": 536,
        "d": 532,
        "rank": 28
      },
      "2023": {
        "ac": 545,
        "d": 548,
        "rank": 32
      },
      "2024": {
        "ac": 526,
        "d": 532,
        "rank": 38
      }
    },
    "wenli": "均衡",
    "founded": 1999,
    "traits": [
      "管理严格"
    ],
    "reputation": {
      "count": 20,
      "overallSatisfaction": 75,
      "teacherQuality": 69.5,
      "teachingQuality": 75,
      "managementEffect": 60,
      "canteenSatisfaction": 55.5,
      "dormSatisfaction": 64.3,
      "activityRichness": 68,
      "teacherAttention": 77.5,
      "compositeScore": 68.1
    }
  },
  {
    "id": "s42",
    "name": "深圳技术大学附属中学",
    "district": "坪山",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 548,
    "dScore2025": 554,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2021": {
        "ac": 484,
        "d": 523,
        "rank": 47
      },
      "2022": {
        "ac": 489,
        "d": 516,
        "rank": 51
      },
      "2023": {
        "ac": 528,
        "d": 540,
        "rank": 48
      },
      "2024": {
        "ac": 518,
        "d": 523,
        "rank": 44
      }
    },
    "wenli": "偏理",
    "founded": 2021,
    "traits": [
      "新兴学校"
    ],
    "reputation": {
      "count": 14,
      "overallSatisfaction": 80.7,
      "teacherQuality": 74.3,
      "teachingQuality": 89.3,
      "managementEffect": 67.3,
      "canteenSatisfaction": 69.3,
      "dormSatisfaction": 92.9,
      "activityRichness": 82.9,
      "teacherAttention": 89.3,
      "compositeScore": 80.8
    }
  },
  {
    "id": "s43",
    "name": "深圳第二外国语学校",
    "district": "龙华",
    "type": "公办",
    "level": "区属重点",
    "acScore2025": 547,
    "dScore2025": 552,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 990,
    "totalPlan2025": 990,
    "historicalScores": {
      "2021": {
        "ac": 503,
        "d": 527,
        "rank": 35
      },
      "2022": {
        "ac": 514,
        "d": 521,
        "rank": 39
      },
      "2023": {
        "ac": 541,
        "d": 544,
        "rank": 40
      },
      "2024": {
        "ac": 523,
        "d": 525,
        "rank": 40
      }
    },
    "wenli": "均衡",
    "founded": 2009,
    "traits": [
      "管理严格"
    ],
    "reputation": {
      "count": 30,
      "overallSatisfaction": 85.3,
      "teacherQuality": 75,
      "teachingQuality": 80,
      "managementEffect": 70,
      "canteenSatisfaction": 64.3,
      "dormSatisfaction": 75.9,
      "activityRichness": 85.3,
      "teacherAttention": 75,
      "compositeScore": 76.3
    }
  },
  {
    "id": "s44",
    "name": "香港中文大学(深圳)附属明德高级中学",
    "district": "福田",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 554,
    "dScore2025": 557,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2021": {
        "ac": 503,
        "d": 522,
        "rank": 34
      },
      "2022": {
        "ac": 528,
        "d": 517,
        "rank": 34
      },
      "2023": {
        "ac": 544,
        "d": 544,
        "rank": 36
      },
      "2024": {
        "ac": 527,
        "d": 527,
        "rank": 36
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s45",
    "name": "深圳市龙津中学",
    "district": "宝安",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 545,
    "dScore2025": 552,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1155,
    "totalPlan2025": 1155,
    "historicalScores": {
      "2022": {
        "ac": 505,
        "d": 522,
        "rank": 44
      },
      "2023": {
        "ac": 537,
        "d": 544,
        "rank": 42
      },
      "2024": {
        "ac": 520,
        "d": 525,
        "rank": 43
      }
    },
    "wenli": "偏理",
    "founded": 2022,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 28,
      "overallSatisfaction": 73.6,
      "teacherQuality": 61.8,
      "teachingQuality": 64.3,
      "managementEffect": 63.8,
      "canteenSatisfaction": 43.6,
      "dormSatisfaction": 80.4,
      "activityRichness": 68.6,
      "teacherAttention": 66.8,
      "compositeScore": 65.4
    }
  },
  {
    "id": "s46",
    "name": "西交利物浦大学基础教育集团外国语高级中学",
    "district": "福田",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 541,
    "dScore2025": 547,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 735,
    "totalPlan2025": 735,
    "historicalScores": {
      "2021": {
        "ac": 494,
        "d": 519,
        "rank": 43
      },
      "2022": {
        "ac": 500,
        "d": 509,
        "rank": 45
      },
      "2023": {
        "ac": 530,
        "d": 528,
        "rank": 47
      },
      "2024": {
        "ac": 513,
        "d": 515,
        "rank": 46
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s47",
    "name": "深圳市第三高级中学（国内高考班）",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 541,
    "dScore2025": 547,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 787,
    "totalPlan2025": 787,
    "historicalScores": {
      "2021": {
        "ac": 497,
        "d": 524,
        "rank": 39
      },
      "2022": {
        "ac": 507,
        "d": 511,
        "rank": 42
      },
      "2023": {
        "ac": 531,
        "d": 534,
        "rank": 46
      },
      "2024": {
        "ac": 514,
        "d": 519,
        "rank": 45
      }
    },
    "wenli": "偏理",
    "founded": 2012,
    "traits": [
      "管理严格"
    ],
    "reputation": {
      "count": 21,
      "overallSatisfaction": 86.2,
      "teacherQuality": 79,
      "teachingQuality": 78.6,
      "managementEffect": 61.4,
      "canteenSatisfaction": 60.5,
      "dormSatisfaction": 64.3,
      "activityRichness": 63.8,
      "teacherAttention": 81,
      "compositeScore": 71.8
    }
  },
  {
    "id": "s48",
    "name": "深圳市高级中学理慧高中",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 541,
    "dScore2025": 546,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 945,
    "totalPlan2025": 945,
    "historicalScores": {
      "2022": {
        "ac": 507,
        "d": 512,
        "rank": 41
      },
      "2023": {
        "ac": 532,
        "d": 527,
        "rank": 44
      },
      "2024": {
        "ac": 512,
        "d": 513,
        "rank": 47
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s49",
    "name": "罗湖高级中学",
    "district": "罗湖",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 540,
    "dScore2025": 545,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 682,
    "totalPlan2025": 682,
    "historicalScores": {
      "2021": {
        "ac": 479,
        "d": 520,
        "rank": 50
      },
      "2022": {
        "ac": 492,
        "d": 508,
        "rank": 50
      },
      "2023": {
        "ac": 526,
        "d": 529,
        "rank": 50
      },
      "2024": {
        "ac": 510,
        "d": 513,
        "rank": 48
      }
    },
    "wenli": "均衡",
    "founded": 1984,
    "traits": [
      "管理严格",
      "老牌名校"
    ],
    "reputation": {
      "count": 31,
      "overallSatisfaction": 75.5,
      "teacherQuality": 74.2,
      "teachingQuality": 69.4,
      "managementEffect": 67.4,
      "canteenSatisfaction": 57.4,
      "dormSatisfaction": 60,
      "activityRichness": 61.3,
      "teacherAttention": 76.5,
      "compositeScore": 67.7
    }
  },
  {
    "id": "s50",
    "name": "深圳市燕川中学",
    "district": "宝安",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 538,
    "dScore2025": 549,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1155,
    "totalPlan2025": 1155,
    "historicalScores": {
      "2022": {
        "ac": 478,
        "d": 516,
        "rank": 56
      },
      "2023": {
        "ac": 515,
        "d": 539,
        "rank": 55
      },
      "2024": {
        "ac": 504,
        "d": 522,
        "rank": 52
      }
    },
    "wenli": "偏理",
    "founded": 2022,
    "traits": [
      "新兴学校"
    ],
    "reputation": {
      "count": 11,
      "overallSatisfaction": 87.3,
      "teacherQuality": 86.4,
      "teachingQuality": 77.3,
      "managementEffect": 70,
      "canteenSatisfaction": 71.8,
      "dormSatisfaction": 81.8,
      "activityRichness": 78.2,
      "teacherAttention": 90.9,
      "compositeScore": 80.5
    }
  },
  {
    "id": "s51",
    "name": "深圳市红岭教育集团大鹏华侨中学",
    "district": "大鹏",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 538,
    "dScore2025": 548,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2023": {
        "ac": 522,
        "d": 532,
        "rank": 52
      },
      "2024": {
        "ac": 508,
        "d": 519,
        "rank": 50
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s52",
    "name": "平冈中学",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 536,
    "dScore2025": 550,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 650,
    "totalPlan2025": 650,
    "historicalScores": {
      "2021": {
        "ac": 485,
        "d": 526,
        "rank": 45
      },
      "2022": {
        "ac": 485,
        "d": 522,
        "rank": 53
      },
      "2023": {
        "ac": 519,
        "d": 536,
        "rank": 53
      },
      "2024": {
        "ac": 504,
        "d": 520,
        "rank": 53
      }
    },
    "wenli": "偏理",
    "founded": 1930,
    "traits": [
      "老牌名校"
    ],
    "reputation": {
      "count": 9,
      "overallSatisfaction": 83.3,
      "teacherQuality": 83.3,
      "teachingQuality": 83.3,
      "managementEffect": 70,
      "canteenSatisfaction": 63.3,
      "dormSatisfaction": 61.1,
      "activityRichness": 68.9,
      "teacherAttention": 77.8,
      "compositeScore": 73.9
    }
  },
  {
    "id": "s53",
    "name": "深圳市高级中学有为高中",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 534,
    "dScore2025": 540,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 525,
    "totalPlan2025": 525,
    "historicalScores": {
      "2023": {
        "ac": 510,
        "d": 520,
        "rank": 58
      },
      "2024": {
        "ac": 503,
        "d": 506,
        "rank": 54
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s54",
    "name": "深圳外国语学校弘知高中",
    "district": "光明",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 531,
    "dScore2025": 537,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2022": {
        "ac": 480,
        "d": 502,
        "rank": 55
      },
      "2023": {
        "ac": 517,
        "d": 520,
        "rank": 54
      },
      "2024": {
        "ac": 502,
        "d": 501,
        "rank": 55
      }
    },
    "wenli": "偏理",
    "founded": 2022,
    "traits": [
      "管理严格",
      "新兴学校"
    ]
  },
  {
    "id": "s55",
    "name": "西乡中学",
    "district": "宝安",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 530,
    "dScore2025": 540,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 494,
        "d": 527,
        "rank": 42
      },
      "2022": {
        "ac": 488,
        "d": 517,
        "rank": 52
      },
      "2023": {
        "ac": 513,
        "d": 531,
        "rank": 56
      },
      "2024": {
        "ac": 493,
        "d": 511,
        "rank": 56
      }
    },
    "wenli": "偏文",
    "founded": 1969,
    "traits": [
      "管理严格",
      "老牌名校"
    ],
    "reputation": {
      "count": 36,
      "overallSatisfaction": 80.6,
      "teacherQuality": 78.9,
      "teachingQuality": 77.8,
      "managementEffect": 60.9,
      "canteenSatisfaction": 61.1,
      "dormSatisfaction": 67.2,
      "activityRichness": 68.9,
      "teacherAttention": 76.4,
      "compositeScore": 71.5
    }
  },
  {
    "id": "s56",
    "name": "深圳市高级中学文博高中",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 529,
    "dScore2025": 539,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2022": {
        "ac": 494,
        "d": 513,
        "rank": 49
      },
      "2023": {
        "ac": 525,
        "d": 525,
        "rank": 51
      },
      "2024": {
        "ac": 507,
        "d": 508,
        "rank": 51
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s57",
    "name": "深圳实验学校明理高中",
    "district": "坪山",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 528,
    "dScore2025": 540,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2022": {
        "ac": 508,
        "d": 505,
        "rank": 40
      },
      "2023": {
        "ac": 533,
        "d": 527,
        "rank": 43
      },
      "2024": {
        "ac": 509,
        "d": 511,
        "rank": 49
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s58",
    "name": "深圳实验学校崇文高中",
    "district": "坪山",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 528,
    "dScore2025": 530,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 945,
    "totalPlan2025": 945,
    "historicalScores": {
      "2022": {
        "ac": 346,
        "d": 477,
        "rank": 79
      },
      "2023": {
        "ac": 503,
        "d": 516,
        "rank": 63
      },
      "2024": {
        "ac": 492,
        "d": 496,
        "rank": 57
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s59",
    "name": "光明区高级中学",
    "district": "光明",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 525,
    "dScore2025": 543,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1584,
    "totalPlan2025": 1584,
    "historicalScores": {
      "2021": {
        "ac": 479,
        "d": 524,
        "rank": 49
      },
      "2022": {
        "ac": 476,
        "d": 513,
        "rank": 57
      },
      "2023": {
        "ac": 505,
        "d": 533,
        "rank": 60
      },
      "2024": {
        "ac": 489,
        "d": 514,
        "rank": 58
      }
    },
    "wenli": "均衡",
    "reputation": {
      "count": 16,
      "overallSatisfaction": 77.5,
      "teacherQuality": 73.1,
      "teachingQuality": 65.6,
      "managementEffect": 60,
      "canteenSatisfaction": 63.1,
      "dormSatisfaction": 53.3,
      "activityRichness": 47.5,
      "teacherAttention": 65.6,
      "compositeScore": 63.2
    }
  },
  {
    "id": "s60",
    "name": "深圳市龙华外国语高级中学",
    "district": "龙华",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 524,
    "dScore2025": 539,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2022": {
        "ac": 461,
        "d": 499,
        "rank": 62
      },
      "2023": {
        "ac": 497,
        "d": 521,
        "rank": 67
      },
      "2024": {
        "ac": 482,
        "d": 504,
        "rank": 66
      }
    },
    "wenli": "均衡",
    "reputation": {
      "count": 12,
      "overallSatisfaction": 74.2,
      "teacherQuality": 76.7,
      "teachingQuality": 75,
      "managementEffect": 58.8,
      "canteenSatisfaction": 63.3,
      "dormSatisfaction": 72.7,
      "activityRichness": 73.3,
      "teacherAttention": 83.3,
      "compositeScore": 72.2
    }
  },
  {
    "id": "s61",
    "name": "深圳市福海中学",
    "district": "宝安",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 524,
    "dScore2025": 540,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 707,
    "totalPlan2025": 707,
    "historicalScores": {
      "2022": {
        "ac": 466,
        "d": 507,
        "rank": 61
      },
      "2023": {
        "ac": 501,
        "d": 527,
        "rank": 64
      },
      "2024": {
        "ac": 484,
        "d": 509,
        "rank": 62
      }
    },
    "wenli": "偏理",
    "founded": 2022,
    "traits": [
      "新兴学校"
    ],
    "reputation": {
      "count": 9,
      "overallSatisfaction": 83.3,
      "teacherQuality": 80,
      "teachingQuality": 77.8,
      "managementEffect": 57.5,
      "canteenSatisfaction": 52.2,
      "dormSatisfaction": 77.8,
      "activityRichness": 86.7,
      "teacherAttention": 74.4,
      "compositeScore": 73.7
    }
  },
  {
    "id": "s62",
    "name": "深圳市第七高级中学",
    "district": "宝安",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 521,
    "dScore2025": 537,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 482,
        "d": 522,
        "rank": 48
      },
      "2022": {
        "ac": 475,
        "d": 508,
        "rank": 58
      },
      "2023": {
        "ac": 504,
        "d": 528,
        "rank": 62
      },
      "2024": {
        "ac": 485,
        "d": 509,
        "rank": 60
      }
    },
    "wenli": "均衡",
    "founded": 2015,
    "traits": [
      "管理严格",
      "新兴学校"
    ],
    "reputation": {
      "count": 12,
      "overallSatisfaction": 69.2,
      "teacherQuality": 59.2,
      "teachingQuality": 62.5,
      "managementEffect": 70,
      "canteenSatisfaction": 60,
      "dormSatisfaction": 60,
      "activityRichness": 70,
      "teacherAttention": 79.2,
      "compositeScore": 66.3
    }
  },
  {
    "id": "s63",
    "name": "深圳市第一职业技术学校（综合高中）",
    "district": "福田",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 519,
    "dScore2025": 519,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 120,
    "totalPlan2025": 120,
    "historicalScores": {
      "2021": {
        "ac": 508,
        "d": 508,
        "rank": 33
      },
      "2022": {
        "ac": 495,
        "d": 495,
        "rank": 47
      },
      "2023": {
        "ac": 499,
        "d": 499,
        "rank": 66
      },
      "2024": {
        "ac": 487,
        "d": 487,
        "rank": 59
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s64",
    "name": "深圳实验学校卓越高中",
    "district": "坪山",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 519,
    "dScore2025": 531,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 840,
    "totalPlan2025": 840,
    "historicalScores": {
      "2022": {
        "ac": 345,
        "d": 452,
        "rank": 80
      },
      "2023": {
        "ac": 496,
        "d": 516,
        "rank": 68
      },
      "2024": {
        "ac": 481,
        "d": 495,
        "rank": 67
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s65",
    "name": "深圳市致理中学",
    "district": "龙华",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 517,
    "dScore2025": 538,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1575,
    "totalPlan2025": 1575,
    "historicalScores": {
      "2023": {
        "ac": 492,
        "d": 523,
        "rank": 70
      },
      "2024": {
        "ac": 474,
        "d": 506,
        "rank": 69
      }
    },
    "wenli": "偏理",
    "founded": 2023,
    "traits": [
      "新兴学校"
    ],
    "reputation": {
      "count": 8,
      "overallSatisfaction": 78.8,
      "teacherQuality": 72.5,
      "teachingQuality": 81.2,
      "managementEffect": 60,
      "canteenSatisfaction": 77.5,
      "dormSatisfaction": 92.9,
      "activityRichness": 70,
      "teacherAttention": 81.2,
      "compositeScore": 76.8
    }
  },
  {
    "id": "s66",
    "name": "深圳实验学校至臻高中",
    "district": "坪山",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 517,
    "dScore2025": 531,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 420,
    "totalPlan2025": 420,
    "historicalScores": {
      "2023": {
        "ac": 490,
        "d": 515,
        "rank": 73
      },
      "2024": {
        "ac": 473,
        "d": 495,
        "rank": 70
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s67",
    "name": "深圳外国语学校博雅高中",
    "district": "光明",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 517,
    "dScore2025": 530,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 945,
    "totalPlan2025": 945,
    "historicalScores": {
      "2022": {
        "ac": 461,
        "d": 488,
        "rank": 63
      },
      "2023": {
        "ac": 504,
        "d": 521,
        "rank": 61
      },
      "2024": {
        "ac": 485,
        "d": 498,
        "rank": 61
      }
    },
    "wenli": "均衡",
    "founded": 2022,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s68",
    "name": "北京大学附属中学深圳学校",
    "district": "福田",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 511,
    "dScore2025": 534,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 525,
    "totalPlan2025": 525,
    "historicalScores": {
      "2021": {
        "ac": 463,
        "d": 513,
        "rank": 53
      },
      "2022": {
        "ac": 453,
        "d": 499,
        "rank": 66
      },
      "2023": {
        "ac": 481,
        "d": 514,
        "rank": 78
      },
      "2024": {
        "ac": 463,
        "d": 495,
        "rank": 79
      }
    },
    "wenli": "偏文",
    "founded": 1993
  },
  {
    "id": "s69",
    "name": "观澜中学",
    "district": "龙华",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 511,
    "dScore2025": 534,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 475,
        "d": 521,
        "rank": 52
      },
      "2022": {
        "ac": 472,
        "d": 506,
        "rank": 59
      },
      "2023": {
        "ac": 501,
        "d": 525,
        "rank": 65
      },
      "2024": {
        "ac": 476,
        "d": 505,
        "rank": 68
      }
    },
    "wenli": "均衡",
    "founded": 1914,
    "traits": [
      "管理严格",
      "老牌名校"
    ],
    "reputation": {
      "count": 13,
      "overallSatisfaction": 78.5,
      "teacherQuality": 64.6,
      "teachingQuality": 69.2,
      "managementEffect": 65,
      "canteenSatisfaction": 82.3,
      "dormSatisfaction": 83.3,
      "activityRichness": 60,
      "teacherAttention": 73.1,
      "compositeScore": 72
    }
  },
  {
    "id": "s70",
    "name": "深圳外国语学校致远高中",
    "district": "光明",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 511,
    "dScore2025": 530,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2022": {
        "ac": 399,
        "d": 442,
        "rank": 78
      },
      "2023": {
        "ac": 492,
        "d": 517,
        "rank": 72
      },
      "2024": {
        "ac": 468,
        "d": 497,
        "rank": 72
      }
    },
    "wenli": "偏理",
    "founded": 2022,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s71",
    "name": "坪山高级中学",
    "district": "坪山",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 508,
    "dScore2025": 535,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 800,
    "totalPlan2025": 800,
    "historicalScores": {
      "2021": {
        "ac": 466,
        "d": 518,
        "rank": 51
      },
      "2022": {
        "ac": 469,
        "d": 506,
        "rank": 60
      },
      "2023": {
        "ac": 493,
        "d": 520,
        "rank": 69
      },
      "2024": {
        "ac": 468,
        "d": 498,
        "rank": 71
      }
    },
    "wenli": "均衡",
    "reputation": {
      "count": 22,
      "overallSatisfaction": 78.2,
      "teacherQuality": 79,
      "teachingQuality": 73.2,
      "managementEffect": 64.3,
      "canteenSatisfaction": 52.7,
      "dormSatisfaction": 73.5,
      "activityRichness": 70.9,
      "teacherAttention": 78.2,
      "compositeScore": 71.2
    }
  },
  {
    "id": "s72",
    "name": "深圳市盐港中学（综合高中）",
    "district": "盐田",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 508,
    "dScore2025": 508,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 100,
    "totalPlan2025": 100,
    "historicalScores": {
      "2022": {
        "ac": 485,
        "d": 485,
        "rank": 54
      },
      "2023": {
        "ac": 506,
        "d": 506,
        "rank": 59
      },
      "2024": {
        "ac": 482,
        "d": 482,
        "rank": 65
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s73",
    "name": "深圳市行知职业技术学校（综合高中）",
    "district": "罗湖",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 507,
    "dScore2025": 507,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 150,
    "totalPlan2025": 150,
    "historicalScores": {
      "2022": {
        "ac": 447,
        "d": 447,
        "rank": 73
      },
      "2023": {
        "ac": 492,
        "d": 492,
        "rank": 71
      },
      "2024": {
        "ac": 482,
        "d": 482,
        "rank": 64
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s74",
    "name": "深圳外国语学校理工高中",
    "district": "光明",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 505,
    "dScore2025": 528,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 525,
    "totalPlan2025": 525,
    "historicalScores": {
      "2023": {
        "ac": 490,
        "d": 516,
        "rank": 75
      },
      "2024": {
        "ac": 465,
        "d": 495,
        "rank": 75
      }
    },
    "wenli": "偏理",
    "founded": 2023,
    "traits": [
      "管理严格",
      "新兴学校"
    ]
  },
  {
    "id": "s75",
    "name": "深圳市龙华科技实验高级中学",
    "district": "龙华",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 505,
    "dScore2025": 531,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1732,
    "totalPlan2025": 1732,
    "historicalScores": {
      "2024": {
        "ac": 466,
        "d": 497,
        "rank": 74
      }
    },
    "wenli": "偏理",
    "founded": 2024,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s76",
    "name": "深圳市聚龙科学中学",
    "district": "坪山",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 501,
    "dScore2025": 533,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2022": {
        "ac": 458,
        "d": 506,
        "rank": 64
      },
      "2023": {
        "ac": 490,
        "d": 520,
        "rank": 74
      },
      "2024": {
        "ac": 464,
        "d": 500,
        "rank": 77
      }
    },
    "wenli": "偏理",
    "founded": 2022,
    "traits": [
      "竞赛强校",
      "新兴学校"
    ],
    "reputation": {
      "count": 34,
      "overallSatisfaction": 80.3,
      "teacherQuality": 67.6,
      "teachingQuality": 69.4,
      "managementEffect": 62,
      "canteenSatisfaction": 56.5,
      "dormSatisfaction": 88.2,
      "activityRichness": 62.4,
      "teacherAttention": 71.2,
      "compositeScore": 69.7
    }
  },
  {
    "id": "s77",
    "name": "宝安中学（集团）石岩外国语学校",
    "district": "宝安",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 498,
    "dScore2025": 529,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 567,
    "totalPlan2025": 567,
    "historicalScores": {
      "2021": {
        "ac": 512,
        "d": 512,
        "rank": 31
      },
      "2022": {
        "ac": 497,
        "d": 497,
        "rank": 46
      },
      "2023": {
        "ac": 512,
        "d": 512,
        "rank": 57
      },
      "2024": {
        "ac": 447,
        "d": 494,
        "rank": 89
      }
    },
    "wenli": "均衡",
    "founded": 1995,
    "traits": [
      "管理严格"
    ]
  },
  {
    "id": "s78",
    "name": "光明中学",
    "district": "光明",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 496,
    "dScore2025": 526,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2021": {
        "ac": 460,
        "d": 515,
        "rank": 54
      },
      "2022": {
        "ac": 457,
        "d": 503,
        "rank": 65
      },
      "2023": {
        "ac": 482,
        "d": 518,
        "rank": 77
      },
      "2024": {
        "ac": 459,
        "d": 494,
        "rank": 80
      }
    },
    "wenli": "偏理",
    "founded": 1965,
    "traits": [
      "老牌名校"
    ],
    "reputation": {
      "count": 5,
      "overallSatisfaction": 68,
      "teacherQuality": 46,
      "teachingQuality": 60,
      "managementEffect": 62.5,
      "canteenSatisfaction": 44,
      "dormSatisfaction": 66.7,
      "activityRichness": 44,
      "teacherAttention": 70,
      "compositeScore": 57.6
    }
  },
  {
    "id": "s79",
    "name": "横岗高级中学",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 496,
    "dScore2025": 527,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 850,
    "totalPlan2025": 850,
    "historicalScores": {
      "2021": {
        "ac": 457,
        "d": 515,
        "rank": 56
      },
      "2022": {
        "ac": 451,
        "d": 503,
        "rank": 68
      },
      "2023": {
        "ac": 480,
        "d": 516,
        "rank": 79
      },
      "2024": {
        "ac": 458,
        "d": 494,
        "rank": 81
      }
    },
    "wenli": "偏文",
    "founded": 2011,
    "reputation": {
      "count": 8,
      "overallSatisfaction": 76.2,
      "teacherQuality": 57.5,
      "teachingQuality": 68.8,
      "managementEffect": 60,
      "canteenSatisfaction": 65,
      "dormSatisfaction": 60,
      "activityRichness": 60,
      "teacherAttention": 87.5,
      "compositeScore": 66.9
    }
  },
  {
    "id": "s80",
    "name": "龙华中学",
    "district": "龙华",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 491,
    "dScore2025": 527,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 420,
    "totalPlan2025": 420,
    "historicalScores": {
      "2021": {
        "ac": 453,
        "d": 520,
        "rank": 60
      },
      "2022": {
        "ac": 447,
        "d": 496,
        "rank": 72
      },
      "2023": {
        "ac": 468,
        "d": 515,
        "rank": 86
      },
      "2024": {
        "ac": 449,
        "d": 490,
        "rank": 87
      }
    },
    "wenli": "均衡",
    "founded": 1956,
    "traits": [
      "管理严格",
      "老牌名校"
    ]
  },
  {
    "id": "s81",
    "name": "深圳市第二实验学校明远高中",
    "district": "大鹏",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 490,
    "dScore2025": 526,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 630,
    "totalPlan2025": 630,
    "historicalScores": {
      "2023": {
        "ac": 486,
        "d": 514,
        "rank": 76
      },
      "2024": {
        "ac": 464,
        "d": 492,
        "rank": 78
      }
    },
    "wenli": "偏理",
    "founded": 2023,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s82",
    "name": "布吉高级中学",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 490,
    "dScore2025": 525,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 1050,
    "totalPlan2025": 1050,
    "historicalScores": {
      "2021": {
        "ac": 458,
        "d": 515,
        "rank": 55
      },
      "2022": {
        "ac": 452,
        "d": 502,
        "rank": 67
      },
      "2023": {
        "ac": 476,
        "d": 513,
        "rank": 80
      },
      "2024": {
        "ac": 454,
        "d": 491,
        "rank": 83
      }
    },
    "wenli": "均衡",
    "reputation": {
      "count": 7,
      "overallSatisfaction": 84.3,
      "teacherQuality": 82.9,
      "teachingQuality": 78.6,
      "managementEffect": 70,
      "canteenSatisfaction": 55.7,
      "dormSatisfaction": 75,
      "activityRichness": 77.1,
      "teacherAttention": 71.4,
      "compositeScore": 74.4
    }
  },
  {
    "id": "s83",
    "name": "平湖外国语学校",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 486,
    "dScore2025": 523,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 350,
    "totalPlan2025": 350,
    "historicalScores": {
      "2021": {
        "ac": 454,
        "d": 515,
        "rank": 58
      },
      "2022": {
        "ac": 449,
        "d": 501,
        "rank": 71
      },
      "2023": {
        "ac": 475,
        "d": 511,
        "rank": 81
      },
      "2024": {
        "ac": 451,
        "d": 491,
        "rank": 84
      }
    },
    "wenli": "偏文",
    "founded": 2003,
    "traits": [
      "外语特色",
      "管理严格"
    ],
    "reputation": {
      "count": 12,
      "overallSatisfaction": 70,
      "teacherQuality": 61.7,
      "teachingQuality": 75,
      "managementEffect": 70,
      "canteenSatisfaction": 45.8,
      "dormSatisfaction": 63.6,
      "activityRichness": 56.7,
      "teacherAttention": 75,
      "compositeScore": 64.7
    }
  },
  {
    "id": "s84",
    "name": "深圳中学科技高中",
    "district": "深汕",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 485,
    "dScore2025": 522,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 1000,
    "totalPlan2025": 1000,
    "historicalScores": {
      "2024": {
        "ac": 464,
        "d": 495,
        "rank": 76
      }
    },
    "wenli": "偏理",
    "founded": 2024,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s85",
    "name": "沙井中学",
    "district": "宝安",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 484,
    "dScore2025": 525,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 650,
    "totalPlan2025": 650,
    "historicalScores": {
      "2021": {
        "ac": 456,
        "d": 514,
        "rank": 57
      },
      "2022": {
        "ac": 449,
        "d": 502,
        "rank": 70
      },
      "2023": {
        "ac": 474,
        "d": 514,
        "rank": 83
      },
      "2024": {
        "ac": 450,
        "d": 490,
        "rank": 85
      }
    },
    "wenli": "偏理",
    "founded": 1956,
    "traits": [
      "老牌名校"
    ],
    "reputation": {
      "count": 5,
      "overallSatisfaction": 78,
      "teacherQuality": 74,
      "teachingQuality": 80,
      "managementEffect": 70,
      "canteenSatisfaction": 70,
      "dormSatisfaction": 60,
      "activityRichness": 52,
      "teacherAttention": 70,
      "compositeScore": 69.2
    }
  },
  {
    "id": "s86",
    "name": "深圳中学数理高中",
    "district": "深汕",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 483,
    "dScore2025": 528,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 1000,
    "totalPlan2025": 1000,
    "historicalScores": {
      "2023": {
        "ac": 528,
        "d": 533,
        "rank": 49
      },
      "2024": {
        "ac": 483,
        "d": 515,
        "rank": 63
      }
    },
    "wenli": "偏理",
    "founded": 2023,
    "traits": [
      "竞赛强校",
      "新兴学校"
    ]
  },
  {
    "id": "s87",
    "name": "深圳中学实验高中",
    "district": "深汕",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 483,
    "dScore2025": 523,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 1000,
    "totalPlan2025": 1000,
    "historicalScores": {
      "2024": {
        "ac": 467,
        "d": 494,
        "rank": 73
      }
    },
    "wenli": "偏理",
    "founded": 2024,
    "traits": [
      "竞赛强校",
      "新兴学校"
    ]
  },
  {
    "id": "s88",
    "name": "深圳市第二高级中学深汕实验学校",
    "district": "深汕",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 481,
    "dScore2025": 522,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 900,
    "totalPlan2025": 900,
    "historicalScores": {
      "2022": {
        "ac": 450,
        "d": 504,
        "rank": 69
      },
      "2023": {
        "ac": 463,
        "d": 507,
        "rank": 87
      },
      "2024": {
        "ac": 448,
        "d": 491,
        "rank": 88
      }
    },
    "wenli": "偏理",
    "founded": 2022,
    "traits": [
      "新兴学校"
    ]
  },
  {
    "id": "s89",
    "name": "深圳市艺术高中",
    "district": "龙华",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 479,
    "dScore2025": 515,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 420,
    "totalPlan2025": 420,
    "historicalScores": {
      "2021": {
        "ac": 453,
        "d": 511,
        "rank": 59
      },
      "2022": {
        "ac": 446,
        "d": 496,
        "rank": 74
      },
      "2023": {
        "ac": 471,
        "d": 505,
        "rank": 85
      },
      "2024": {
        "ac": 450,
        "d": 490,
        "rank": 86
      }
    },
    "wenli": "均衡",
    "founded": 2020,
    "traits": [
      "艺术特色",
      "新兴学校"
    ],
    "reputation": {
      "count": 5,
      "overallSatisfaction": 96,
      "teacherQuality": 80,
      "teachingQuality": 80,
      "managementEffect": 70,
      "canteenSatisfaction": 80,
      "dormSatisfaction": 60,
      "activityRichness": 84,
      "teacherAttention": 90,
      "compositeScore": 80
    }
  },
  {
    "id": "s90",
    "name": "深圳市美术学校",
    "district": "罗湖",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 474,
    "dScore2025": 508,
    "hasBoarding": true,
    "hasDay": true,
    "plan2026": 417,
    "totalPlan2025": 417,
    "historicalScores": {
      "2021": {
        "ac": 500,
        "d": 500,
        "rank": 38
      },
      "2022": {
        "ac": 423,
        "d": 500,
        "rank": 77
      },
      "2023": {
        "ac": 472,
        "d": 483,
        "rank": 84
      },
      "2024": {
        "ac": 442,
        "d": 485,
        "rank": 91
      }
    },
    "wenli": "纯文",
    "founded": 2005,
    "traits": [
      "艺术特色"
    ]
  },
  {
    "id": "s91",
    "name": "深圳市第三高级中学（国家留学基金委自费出国留学班）",
    "district": "龙岗",
    "type": "公办",
    "level": "普通公办",
    "acScore2025": 437,
    "dScore2025": 437,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 376,
    "totalPlan2025": 376,
    "historicalScores": {
      "2021": {
        "ac": 371,
        "d": 371,
        "rank": 62
      },
      "2022": {
        "ac": 345,
        "d": 345,
        "rank": 81
      },
      "2023": {
        "ac": 434,
        "d": 434,
        "rank": 89
      },
      "2024": {
        "ac": 432,
        "d": 432,
        "rank": 92
      }
    },
    "wenli": "均衡"
  },
  {
    "id": "s92",
    "name": "梅沙高中",
    "district": "盐田",
    "type": "民办",
    "level": "普通公办",
    "acScore2025": 510,
    "dScore2025": 518,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 300
  },
  {
    "id": "s93",
    "name": "深圳市富源学校",
    "district": "宝安",
    "type": "民办",
    "level": "民办",
    "acScore2025": 429,
    "dScore2025": 429,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 800
  },
  {
    "id": "s94",
    "name": "桃源居中澳实验学校",
    "district": "宝安",
    "type": "民办",
    "level": "民办",
    "acScore2025": 413,
    "dScore2025": 413,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 600
  },
  {
    "id": "s95",
    "name": "深圳市承翰学校",
    "district": "龙岗",
    "type": "民办",
    "level": "民办",
    "acScore2025": 389,
    "dScore2025": 389,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 400
  },
  {
    "id": "s96",
    "name": "华侨（康桥）书院",
    "district": "宝安",
    "type": "民办",
    "level": "民办",
    "acScore2025": 381,
    "dScore2025": 381,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 500
  },
  {
    "id": "s97",
    "name": "福桥高级中学",
    "district": "宝安",
    "type": "民办",
    "level": "民办",
    "acScore2025": 372,
    "dScore2025": 372,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 500
  },
  {
    "id": "s98",
    "name": "深圳市滨海高级中学",
    "district": "宝安",
    "type": "民办",
    "level": "民办",
    "acScore2025": 355,
    "dScore2025": 355,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 400
  },
  {
    "id": "s99",
    "name": "深圳市格睿特高级中学",
    "district": "龙华",
    "type": "民办",
    "level": "民办",
    "acScore2025": 351,
    "dScore2025": 351,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 400
  },
  {
    "id": "s100",
    "name": "深圳市明瑞高级中学",
    "district": "宝安",
    "type": "民办",
    "level": "民办",
    "acScore2025": 341,
    "dScore2025": 341,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 400
  },
  {
    "id": "s101",
    "name": "深圳市立人高级中学",
    "district": "龙岗",
    "type": "民办",
    "level": "民办",
    "acScore2025": 345,
    "dScore2025": 345,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 400
  },
  {
    "id": "s102",
    "name": "深圳杰仁高级中学",
    "district": "宝安",
    "type": "民办",
    "level": "民办",
    "acScore2025": 342,
    "dScore2025": 342,
    "hasBoarding": true,
    "hasDay": false,
    "plan2026": 400
  }
];
