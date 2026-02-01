export interface Skill {
  num: number;
  name: string;
  icon?: string;
  detail: string;
  condLimitCount?: number;
}

export interface NoblePhantasm {
  name: string;
  icon?: string;
  card: string;
  detail: string;
  npGain?: {
    buster: number[];
    arts: number[];
    quick: number[];
    extra: number[];
    defence: number[];
  };
}

export interface Servant {
  id: number;
  collectionNo: number;
  name: string;
  className: string;
  rarity: number;
  face: string;
  tierGrade?: string;
  atkMax: number;
  hpMax: number;
  cards?: string[];
  attribute?: string;
  alignments?: string[];
  traits?: { name: string }[];
  hits?: { [key: string]: number[] };
  atkBase?: number;
  hpBase?: number;
  starAbsorb?: number;
  starGen?: number;
  instantDeathChance?: number;
  skills?: Skill[];
  noblePhantasms?: NoblePhantasm[];
  atkGrowth?: number[];
  hpGrowth?: number[];
  extraAssets?: {
    charaGraph: {
      ascension: {
        [key: string]: string;
      };
    };
  };
}