import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { CraftEssence } from '../models/craft-essence';

@Injectable({ providedIn: 'root' })
export class CraftEssenceService {
  private apiUrl = 'https://api.atlasacademy.io/nice/NA/equip';

  constructor(private http: HttpClient) {}

  getCraftEssences(): Observable<CraftEssence[]> {
    return this.http.get<CraftEssence[]>(`${this.apiUrl}?lang=en`).pipe(
      shareReplay(1)
    );
  }

  searchCraftEssences(name?: string, rarity?: number): Observable<CraftEssence[]> {
    let url = `https://api.atlasacademy.io/basic/NA/equip/search?lang=en&type=servantEquip`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    if (rarity) url += `&rarity=${rarity}`;
    
    return this.http.get<CraftEssence[]>(url);
  }

  getDetails(id: number): Observable<CraftEssence> {
    return this.http.get<CraftEssence>(`${this.apiUrl}/${id}?lang=en`).pipe(
      shareReplay(1)
    );
  }
}
