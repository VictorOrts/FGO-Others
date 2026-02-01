import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CraftEssenceService } from '../../core/services/craft-essence';
import { CraftEssence } from '../../core/models/craft-essence';

@Component({
  selector: 'app-craft-essences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './craft-essences.html',
  styleUrls: ['./craft-essences.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CraftEssencesComponent implements OnInit {
  filteredCEs = signal<CraftEssence[]>([]);
  loading = signal(false); // Default to false since we start search in ngOnInit
  searchTerm = signal('');
  selectedRarity = signal<number>(5);
  
  selectedCE = signal<CraftEssence | null>(null);
  showModal = signal(false);
  modalLoading = signal(false);

  rarities = [5, 4, 3, 2, 1];

  get baseSkills() {
    return (this.selectedCE()?.skills || []).filter(s => !s.condLimitCount || s.condLimitCount === 0);
  }

  get mlbSkills() {
    return (this.selectedCE()?.skills || []).filter(s => s.condLimitCount === 4);
  }

  constructor(private ceService: CraftEssenceService) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.loading.set(true);
    this.ceService.searchCraftEssences(
      this.searchTerm() || undefined,
      this.selectedRarity() || undefined
    ).subscribe({
      next: (data) => {
        this.filteredCEs.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearchChange(event: any): void {
    this.searchTerm.set(event.target.value);
    this.applyFilters();
  }

  onRarityChange(event: any): void {
    this.selectedRarity.set(+event.target.value);
    this.applyFilters();
  }

  selectCE(ce: CraftEssence): void {
    this.selectedCE.set(ce);
    this.showModal.set(true);
    this.modalLoading.set(true);
    
    this.ceService.getDetails(ce.id).subscribe({
      next: (details) => {
        this.selectedCE.set(details);
        this.modalLoading.set(false);
      },
      error: () => this.modalLoading.set(false)
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedCE.set(null);
  }

  getCEImage(ce: CraftEssence, isFull: boolean = false): string {
    if (isFull && ce.extraAssets?.charaGraph?.equip) {
      const art = ce.extraAssets.charaGraph.equip[ce.id];
      if (art) return art;
    }
    return ce.face || (ce.extraAssets?.equipFace?.equip && ce.extraAssets.equipFace.equip[ce.id]) || '';
  }

  getSkillDetail(skill: any): string {
    return skill.detail || skill.unmodifiedDetail || '';
  }
}
