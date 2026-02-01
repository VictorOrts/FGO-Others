import { Servant } from '../models/servant';

export class RatingEngine {
  static suggestGrade(servant: Servant): string {
    let score = 0;

    // --- 1. NP Battery (The Gold Standard) ---
    const hasFullBattery = this.checkSkillDetails(servant, ['50%', '80%', '100%'], true); 
    const hasMidBattery = this.checkSkillDetails(servant, ['30%', '40%'], true);
    const hasSmallBattery = this.checkSkillDetails(servant, ['10%', '20%', 'Charge NP', 'NP Gauge'], true);
    const hasTeamBattery = (this.checkSkillDetails(servant, ['all allies', 'each ally', 'all party'], true) && 
                           this.checkSkillDetails(servant, ['NP Gauge', 'Charge NP'], true)) ||
                           this.checkSkillDetails(servant, ['Zhuge Liang', 'Waver', 'Merlin', 'Castoria', 'Skadi'], false, false);

    if (hasFullBattery) score += 6;
    else if (hasMidBattery) score += 4;
    else if (hasSmallBattery) score += 2;
    
    if (hasTeamBattery) score += 4; // Support value is king

    // --- 2. Looping & Farming Potential ---
    const isAOE = this.checkSkillDetails(servant, ['damage to all enemies'], false, true);
    const hasRefund = this.checkSkillDetails(servant, ['NP Gain', 'recharge', 'refund', 'overcharge'], true);
    
    if (isAOE) score += 1.5; 
    if (isAOE && hasRefund) score += 3.5; // High loop potential

    // --- 3. Damage Buffs & Team Support ---
    const isSupport = this.checkSkillDetails(servant, ['all allies', 'each ally'], true);
    const hasPowerBuff = this.checkSkillDetails(servant, ['Attack Up', 'Performance Up', 'Damage Up', 'Power Up', 'Critical Strength'], true);
    
    if (isSupport && hasPowerBuff) score += 4.5; // Meta supports
    else if (hasPowerBuff) score += 1.5; // Self buff

    // --- 4. Special Utility (CQs) ---
    const hasSpecial = this.checkSkillDetails(servant, ['Ignore Invincibility', 'Pierce', 'Sure Hit', 'Remove Buffs'], true);
    const hasSurvival = this.checkSkillDetails(servant, ['Invincibility', 'Evade', 'Damage Cut', 'Guts'], true);
    
    if (hasSpecial) score += 1.5;
    if (hasSurvival) score += 0.5;

    // --- 5. Custom Guide Scale (EX, EX-, A+, A, B+, B, C+, C, D+, D, E) ---
    const name = servant.name.toLowerCase();
    
    // Hardcoded Absolute Meta Gods
    const metaGods = ['altria caster', 'oberon', 'koyanskaya of light', 'skadi', 'zhuge liang', 'arash', 'chen gong'];
    if (metaGods.some(god => name.includes(god))) return 'EX';

    // Tier Thresholds (Rarity Based Strictness)
    if (servant.rarity === 5) {
      if (score >= 20) return 'EX';
      if (score >= 18) return 'EX-';
      if (score >= 15) return 'A+';
      if (score >= 12) return 'A';
      if (score >= 10) return 'B+';
      if (score >= 8) return 'B';
      if (score >= 6) return 'C+';
      if (score >= 4) return 'C';
      if (score >= 2) return 'D+';
      if (score >= 1) return 'D';
      return 'E';
    } 
    
    if (servant.rarity === 4) {
      if (score >= 15) return 'EX-';
      if (score >= 8) return 'A+';
      if (score >= 4) return 'A';
      if (score >= 3) return 'B+';
      if (score >= 2) return 'B';
      if (score >= 1) return 'C+';
      if (score >= 0.5) return 'C';
      return 'D';
    }

    // 1-3* (Assumes NP5 peak)
    if (score >= 9) return 'A+';
    if (score >= 7) return 'A';
    if (score >= 5) return 'B+';
    if (score >= 3) return 'B';
    if (score >= 1) return 'C';
    return 'D';
  }

  private static checkSkillDetails(
    servant: Servant, 
    keywords: string[], 
    lookInSkills: boolean = true, 
    lookInNP: boolean = true
  ): boolean {
    const text: string[] = [];
    if (lookInSkills && servant.skills) {
      text.push(...servant.skills.map(s => s.detail));
    }
    if (lookInNP && servant.noblePhantasms) {
      text.push(...servant.noblePhantasms.map(n => n.detail));
    }
    
    const combined = text.join(' ').toLowerCase();
    return keywords.some(k => combined.includes(k.toLowerCase()));
  }
}
