/**
 * 江南古风城镇 —— 建筑类型定义（生产链版）
 *
 * 设计思路：把原版的“住宅/商业/工业”三分法，映射为古代城镇的
 *   - 民居（residence）   ：提供人口（劳动力）
 *   - 工坊（workshop）    ：消耗原料、产出商品（生产链核心）
 *   - 商贾（commerce）    ：消耗商品、产出银两（金币）
 *   - 市政（civic）       ：治安、消防、医疗、教育、环境
 *   - 景观（landscape）   ：提升“繁荣度”，吸引人口与商旅
 *
 * 生产链示例：
 *   农田(稻米) ──→ 酒楼/面铺(消耗稻米,产出银两)
 *   桑园(蚕丝) ──→ 织坊(消耗蚕丝,产出布匹) ──→ 成衣铺(消耗布匹,产出银两)
 *   茶园(茶叶) ──→ 茶楼(消耗茶叶,产出银两+繁荣)
 *
 * 数值口径沿用原版 { maxPop, maxJobs, pollution, landValue }，
 * 其中 pollution 在古风语境下代表“喧嚣/脏乱”，landValue 代表“地气/繁华”。
 * 生产链消耗/产出通过下面的 PRODUCTION 表单独描述，由 simulation 层读取。
 */

export type BuildingType =
  // 基础地形
  | 'empty' | 'grass' | 'water' | 'road' | 'bridge' | 'rail' | 'tree'
  // 民居（劳动力）
  | 'thatched_hut'      // 茅草屋
  | 'tile_house'        // 青瓦民居
  | 'courtyard'         // 三进院落
  | 'mansion'           // 大户宅邸
  // 工坊（生产链）
  | 'paddy_field'       // 稻田  → 稻米
  | 'mulberry_grove'    // 桑园  → 蚕丝
  | 'tea_plantation'    // 茶园  → 茶叶
  | 'weaving_workshop'  // 织坊  → 消耗蚕丝，产出布匹
  | 'tailor_shop'       // 成衣铺 → 消耗布匹，产出银两
  | 'pottery_kiln'      // 陶窑  → 陶器
  | 'paper_workshop'    // 造纸坊 → 纸张
  | 'ink_workshop'      // 墨坊  → 消耗纸张，产出徽墨
  | 'wine_shop'         // 酒坊  → 消耗稻米，产出美酒
  // 商贾（消费+银两）
  | 'tea_house'         // 茶楼   → 消耗茶叶，产出银两+繁荣
  | 'noodle_shop'       // 面铺   → 消耗稻米，产出银两
  | 'cloth_market'      // 布庄   → 消耗布匹，产出银两
  | 'general_store'     // 杂货铺
  | 'inn'               // 客栈
  | 'pawnshop'          // 当铺
  // 市政
  | 'yamen'             // 衙门（治安）
  | 'watchtower'        // 更楼（治安）
  | 'clinic'            // 医馆（医疗）
  | 'school'            // 私塾（教育）
  | 'academy'           // 书院（教育）
  | 'fire_brigade'      // 水龙局（消防）
  // 景观/宗教（繁荣度）
  | 'pavilion'          // 亭台
  | 'garden'            // 园林
  | 'large_garden'      // 大园林
  | 'temple'            // 城隍庙
  | 'pagoda'            // 宝塔
  | 'archway'           // 牌坊
  | 'lotus_pond'        // 荷塘
  // 公用设施
  | 'well'              // 水井
  | 'ferry'             // 渡口
  | 'granary'           // 粮仓
  // 特殊/地标
  | 'city_gate'         // 城门
  | 'guild_hall'        // 会馆/行会
  | 'dock'              // 码头
  | 'theater_stage';    // 戏台

export type BridgeType = 'small' | 'medium' | 'large' | 'suspension';
export type BridgeOrientation = 'ns' | 'ew';
export type BridgeTrackType = 'road' | 'rail';

export interface Building {
  type: BuildingType;
  level: number;
  population: number;
  jobs: number;
  powered: boolean;
  watered: boolean;
  onFire: boolean;
  fireProgress: number;
  age: number;
  constructionProgress: number;
  abandoned: boolean;
  flipped?: boolean;
  cityId?: string;
  bridgeType?: BridgeType;
  bridgeOrientation?: BridgeOrientation;
  bridgeVariant?: number;
  bridgePosition?: 'start' | 'middle' | 'end';
  bridgeIndex?: number;
  bridgeSpan?: number;
  bridgeTrackType?: BridgeTrackType;
}

/** 民居：提供人口（劳动力） */
export const RESIDENTIAL_BUILDINGS: BuildingType[] = [
  'thatched_hut', 'tile_house', 'courtyard', 'mansion',
];

/** 商贾：消费商品、产出银两 */
export const COMMERCIAL_BUILDINGS: BuildingType[] = [
  'tea_house', 'noodle_shop', 'cloth_market', 'general_store', 'inn', 'pawnshop',
];

/** 工坊：生产/加工商品（含原料产地） */
export const INDUSTRIAL_BUILDINGS: BuildingType[] = [
  'paddy_field', 'mulberry_grove', 'tea_plantation',
  'weaving_workshop', 'tailor_shop', 'pottery_kiln',
  'paper_workshop', 'ink_workshop', 'wine_shop',
];

export const BUILDING_STATS: Record<BuildingType, { maxPop: number; maxJobs: number; pollution: number; landValue: number }> = {
  // 基础地形
  empty: { maxPop: 0, maxJobs: 0, pollution: 0, landValue: 0 },
  grass: { maxPop: 0, maxJobs: 0, pollution: 0, landValue: 0 },
  water: { maxPop: 0, maxJobs: 0, pollution: 0, landValue: 5 },
  road: { maxPop: 0, maxJobs: 0, pollution: 2, landValue: 0 },
  bridge: { maxPop: 0, maxJobs: 0, pollution: 1, landValue: 5 },
  rail: { maxPop: 0, maxJobs: 0, pollution: 1, landValue: -2 },
  tree: { maxPop: 0, maxJobs: 0, pollution: -5, landValue: 2 },

  // 民居
  thatched_hut: { maxPop: 6, maxJobs: 0, pollution: 0, landValue: 8 },
  tile_house: { maxPop: 14, maxJobs: 0, pollution: 0, landValue: 18 },
  courtyard: { maxPop: 30, maxJobs: 0, pollution: 0, landValue: 35 },
  mansion: { maxPop: 18, maxJobs: 0, pollution: 0, landValue: 60 },

  // 工坊 —— 原料产地（污染极低）
  paddy_field: { maxPop: 0, maxJobs: 12, pollution: 1, landValue: 8 },
  mulberry_grove: { maxPop: 0, maxJobs: 10, pollution: 0, landValue: 10 },
  tea_plantation: { maxPop: 0, maxJobs: 10, pollution: 0, landValue: 12 },
  // 工坊 —— 加工类（有一定污染）
  weaving_workshop: { maxPop: 0, maxJobs: 30, pollution: 6, landValue: 14 },
  tailor_shop: { maxPop: 0, maxJobs: 25, pollution: 4, landValue: 18 },
  pottery_kiln: { maxPop: 0, maxJobs: 35, pollution: 14, landValue: 10 },
  paper_workshop: { maxPop: 0, maxJobs: 28, pollution: 10, landValue: 12 },
  ink_workshop: { maxPop: 0, maxJobs: 22, pollution: 8, landValue: 16 },
  wine_shop: { maxPop: 0, maxJobs: 20, pollution: 6, landValue: 16 },

  // 商贾
  tea_house: { maxPop: 0, maxJobs: 15, pollution: 2, landValue: 30 },
  noodle_shop: { maxPop: 0, maxJobs: 10, pollution: 3, landValue: 18 },
  cloth_market: { maxPop: 0, maxJobs: 28, pollution: 4, landValue: 26 },
  general_store: { maxPop: 0, maxJobs: 20, pollution: 2, landValue: 20 },
  inn: { maxPop: 0, maxJobs: 25, pollution: 3, landValue: 28 },
  pawnshop: { maxPop: 0, maxJobs: 18, pollution: 1, landValue: 22 },

  // 市政
  yamen: { maxPop: 0, maxJobs: 30, pollution: 0, landValue: 30 },
  watchtower: { maxPop: 0, maxJobs: 8, pollution: 0, landValue: 14 },
  clinic: { maxPop: 0, maxJobs: 20, pollution: 0, landValue: 22 },
  school: { maxPop: 0, maxJobs: 18, pollution: 0, landValue: 20 },
  academy: { maxPop: 0, maxJobs: 40, pollution: 0, landValue: 35 },
  fire_brigade: { maxPop: 0, maxJobs: 15, pollution: 0, landValue: 12 },

  // 景观/宗教（负污染=净化环境，高地气=繁荣）
  pavilion: { maxPop: 0, maxJobs: 2, pollution: -8, landValue: 25 },
  garden: { maxPop: 0, maxJobs: 4, pollution: -12, landValue: 30 },
  large_garden: { maxPop: 0, maxJobs: 8, pollution: -22, landValue: 50 },
  temple: { maxPop: 0, maxJobs: 15, pollution: -6, landValue: 40 },
  pagoda: { maxPop: 0, maxJobs: 10, pollution: -5, landValue: 45 },
  archway: { maxPop: 0, maxJobs: 2, pollution: -4, landValue: 28 },
  lotus_pond: { maxPop: 0, maxJobs: 2, pollution: -15, landValue: 26 },

  // 公用设施
  well: { maxPop: 0, maxJobs: 2, pollution: 0, landValue: 8 },
  ferry: { maxPop: 0, maxJobs: 10, pollution: 2, landValue: 18 },
  granary: { maxPop: 0, maxJobs: 12, pollution: 2, landValue: 14 },

  // 特殊/地标
  city_gate: { maxPop: 0, maxJobs: 10, pollution: 0, landValue: 35 },
  guild_hall: { maxPop: 0, maxJobs: 40, pollution: 2, landValue: 42 },
  dock: { maxPop: 0, maxJobs: 50, pollution: 8, landValue: 40 },
  theater_stage: { maxPop: 0, maxJobs: 18, pollution: 2, landValue: 38 },
};

/**
 * 古风生产链定义
 *  - input  : 消耗的原料建筑类型（来自上游工坊/产地）
 *  - output : 产出的商品建筑类型（供下游或商贾消费）
 *  - rate   : 每 tick 的处理量（相对值，供 simulation 读取）
 * 没有 input 表示是“原料产地”（如稻田产稻米，自身不消耗）；
 * 没有 output 表示“终端消费品”，通常由商贾类建筑消化换银两。
 */
export interface ProductionChain {
  input?: BuildingType;
  output?: BuildingType;
  rate: number;
}

export const PRODUCTION: Record<BuildingType, ProductionChain> = {
  // 地形/基础设施不参与生产
  empty: {}, grass: {}, water: {}, road: {}, bridge: {}, rail: {}, tree: {},

  // 原料产地：只产出，不消耗
  paddy_field: { output: 'paddy_field', rate: 4 },        // 产出稻米
  mulberry_grove: { output: 'mulberry_grove', rate: 3 },  // 产出蚕丝
  tea_plantation: { output: 'tea_plantation', rate: 3 },  // 产出茶叶

  // 加工：消耗上游 → 产出下游
  weaving_workshop: { input: 'mulberry_grove', output: 'weaving_workshop', rate: 2 }, // 蚕丝→布匹
  tailor_shop: { input: 'weaving_workshop', output: 'tailor_shop', rate: 2 },        // 布匹→成衣(银两)
  pottery_kiln: { output: 'pottery_kiln', rate: 2 },
  paper_workshop: { output: 'paper_workshop', rate: 2 },
  ink_workshop: { input: 'paper_workshop', output: 'ink_workshop', rate: 2 },        // 纸→墨
  wine_shop: { input: 'paddy_field', output: 'wine_shop', rate: 2 },                 // 稻米→酒

  // 商贾：消化商品（input），不产出实物，换银两由经济系统处理
  tea_house: { input: 'tea_plantation', rate: 3 },
  noodle_shop: { input: 'paddy_field', rate: 3 },
  cloth_market: { input: 'weaving_workshop', rate: 3 },
  general_store: {},
  inn: {},
  pawnshop: {},

  // 市政/景观/设施不参与生产
  thatched_hut: {}, tile_house: {}, courtyard: {}, mansion: {},
  yamen: {}, watchtower: {}, clinic: {}, school: {}, academy: {}, fire_brigade: {},
  pavilion: {}, garden: {}, large_garden: {}, temple: {}, pagoda: {}, archway: {}, lotus_pond: {},
  well: {}, ferry: {}, granary: {},
  city_gate: {}, guild_hall: {}, dock: {}, theater_stage: {},
};
