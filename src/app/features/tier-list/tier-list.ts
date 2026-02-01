import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServantService } from '../../core/services/servant';
import { Servant, Skill, NoblePhantasm } from '../../core/models/servant';
import { RatingEngine } from '../../core/utils/rating-engine';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-tier-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tier-list.html',
  styleUrls: ['./tier-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TierList implements OnInit {
  raritiesArr = [5, 4, 3, 2, 1, 0];
  
  // Signal-based filtering logic
  private classFilter$ = new BehaviorSubject<string>('');
  private rarityFilter$ = new BehaviorSubject<number | undefined>(undefined);
  private nameFilter$ = new BehaviorSubject<string>('');

  servants = toSignal(
    combineLatest([
      this.classFilter$,
      this.rarityFilter$,
      this.nameFilter$.pipe(debounceTime(300), distinctUntilChanged())
    ]).pipe(
      switchMap(([className, rarity, name]) => this.servantService.getServants(className, rarity, name))
    ),
    { initialValue: [] as Servant[] }
  );

  // Computed signals for grouped tiers to avoid function calls in template
  groupedTiers = computed(() => {
    const allServants = this.servants();
    const groups: { [key: number]: Servant[] } = {};
    this.raritiesArr.forEach(r => {
      groups[r] = allServants.filter(s => s.rarity === r);
    });
    return groups;
  });

  constructor(
    private servantService: ServantService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  updateFilter(event: any): void {
    this.classFilter$.next(event.target.value);
  }

  updateRarityFilter(event: any): void {
    const value = event.target.value;
    this.rarityFilter$.next(value ? Number(value) : undefined);
  }

  updateNameFilter(event: any): void {
    this.nameFilter$.next(event.target.value);
  }

  // Helper for template to check if a tier has data
  hasTiers(rarity: number): boolean {
    return (this.groupedTiers()[rarity]?.length || 0) > 0;
  }

  // Header Gradient remains the same
  getHeaderGradient(rarity: number): string {
    switch (rarity) {
      case 5:
      case 4:
        return 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)'; // Gold
      case 3:
        return 'linear-gradient(135deg, #bdc3c7 0%, #7f8c8d 100%)'; // Silver
      case 2:
      case 1:
        return 'linear-gradient(135deg, #d35400 0%, #a04000 100%)'; // Bronze
      case 0:
        return 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)'; // Black
      default:
        return 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
    }
  }

  // Modal Logic
  selectedServant: Servant | null = null;
  currentAscension = 1;
  isModalLoading = false;

  selectServant(servant: Servant): void {
    this.isModalLoading = true;
    this.cdr.detectChanges();
    
    // Fetch full details before showing modal with a timeout
    this.servantService.getServantDetails(servant.id).pipe(
      timeout(8000), // 8 seconds timeout
      catchError(err => {
        console.error('Error fetching details, falling back to basic data', err);
        return of(servant); // Fallback to basic data
      })
    ).subscribe({
      next: (details) => {
        if (!details.tierGrade) {
          details.tierGrade = RatingEngine.suggestGrade(details);
        }
        this.selectedServant = details;
        this.currentAscension = 1;
        this.isModalLoading = false;
        document.body.style.overflow = 'hidden'; 
        this.cdr.detectChanges();
      },
      error: () => {
        this.isModalLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    this.selectedServant = null;
    this.isModalLoading = false;
    document.body.style.overflow = '';
    this.cdr.detectChanges();
  }

  setAscension(stage: number): void {
    this.currentAscension = stage;
  }

  getAscensionImage(): string {
    if (!this.selectedServant?.extraAssets?.charaGraph?.ascension) {
      return '';
    }
    // Map stage 1-4 to API keys (usually keys are present directly)
    // Keys in API might be strictly the ascension ID which varies.
    // However, for basic usage, let's try to map keys.
    // Actually, API returns keys like "100100", "100110". 
    // Wait, nice endpoint returns strictly what is available.
    // Usually 1st key is stage 1.
    // Let's iterate object keys or use a simpler approach if possible.
    // For standard servants, ascension keys correspond to stages.
    
    const ascensions = this.selectedServant.extraAssets.charaGraph.ascension;
    const keys = Object.keys(ascensions);
    // Simple logic: return key at index (stage - 1)
    if (keys[this.currentAscension - 1]) {
       return ascensions[keys[this.currentAscension - 1]];
    }
    return this.selectedServant.face;
  }

  getHitCount(cardType: string): number {
    if (!this.selectedServant?.hits || !this.selectedServant.hits[cardType.toLowerCase()]) {
      return 0;
    }
    return this.selectedServant.hits[cardType.toLowerCase()].reduce((a, b) => a + b, 0);
  }

  getTraitNames(): string[] {
    return this.selectedServant?.traits?.map(t => t.name) || [];
  }

  get activeSkills(): Skill[] {
    if (!this.selectedServant?.skills) return [];
    // Get unique skills by num, taking the latest one for each
    const skillMap = new Map<number, Skill>();
    this.selectedServant.skills.forEach(s => {
      skillMap.set(s.num, s);
    });
    return Array.from(skillMap.values()).sort((a, b) => a.num - b.num);
  }

  get activeNP(): NoblePhantasm | null {
    if (!this.selectedServant?.noblePhantasms || this.selectedServant.noblePhantasms.length === 0) {
      return null;
    }
    // Return latest NP (index 0 is usually fine for basic display)
    return this.selectedServant.noblePhantasms[this.selectedServant.noblePhantasms.length - 1];
  }

  getNpCardType(): string {
    const card = this.activeNP?.card;
    if (!card) return 'extra';
    
    // Atlas Academy API mapping: 1=Arts, 2=Buster, 3=Quick
    switch (card) {
      case '1': return 'arts';
      case '2': return 'buster';
      case '3': return 'quick';
      default: return card.toLowerCase(); // fallback for literal strings if any
    }
  }

  get npCardInitial(): string {
    const type = this.getNpCardType();
    return type.charAt(0).toUpperCase();
  }

  getNpCardImage(): string {
    const type = this.getNpCardType();
    if (!type || type === 'extra') return '';
    // Use 'Card_' prefix for Noble Phantasm as requested (Card_Arts.webp, etc.)
    const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
    return `/images/cards/Card_${capitalized}.webp`;
  }

  getCardIcon(type: string): string {
    if (!type) return '';
    // Use simple name for hit counts (Arts.webp, etc.)
    const capitalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return `/images/cards/${capitalized}.webp`;
  }

  getNpGain(): string {
    const np = this.activeNP;
    if (!np || !np.npGain || !np.npGain.arts) return '0%';
    // Arts NP gain is usually the base for comparison
    const val = np.npGain.arts[0];
    return (val / 100).toFixed(2) + '%';
  }

  getNpAttack(): string {
    const np = this.activeNP;
    if (!np || !np.npGain || !np.npGain.defence) return '0%';
    const val = np.npGain.defence[0];
    return (val / 100).toFixed(2) + '%';
  }

  getStarAbsorption(): string {
    return (this.selectedServant?.starAbsorb || 0).toString();
  }

  getStarGen(): string {
    const val = this.selectedServant?.starGen || 0;
    return (val / 10).toFixed(1) + '%';
  }

  getDeathChance(): string {
    const val = this.selectedServant?.instantDeathChance || 0;
    return (val / 10).toFixed(1) + '%';
  }

  getGradeClass(grade?: string): string {
    if (!grade) return '';
    return 'grade-' + grade.toLowerCase()
      .replace('+', '-p')
      .replace('-', '-m');
  }
}
