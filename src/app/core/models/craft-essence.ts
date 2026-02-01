import { Skill } from './servant';

export interface CraftEssence {
  id: number;
  collectionNo: number;
  name: string;
  rarity: number;
  cost: number;
  lvMax: number;
  atkMax: number;
  hpMax: number;
  atkBase: number;
  hpBase: number;
  face?: string;
  extraAssets?: {
    equipFace: {
      equip: {
        [key: string]: string;
      };
    };
    charaGraph?: {
      equip: {
        [key: string]: string;
      };
    };
  };
  skills: Skill[];
}
