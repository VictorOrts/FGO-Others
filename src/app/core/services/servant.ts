import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servant } from '../models/servant';
import { shareReplay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ServantService {
  private searchUrl = 'https://api.atlasacademy.io/basic/NA/servant/search';
  private exportUrl = 'https://api.atlasacademy.io/export/NA/basic_servant.json';
  private detailUrl = 'https://api.atlasacademy.io/nice/NA/servant/';

  constructor(private http: HttpClient) {}

  getServants(className?: string, rarity?: number, name?: string): Observable<Servant[]> {
    if (className || rarity || name) {
      let params = new HttpParams()
        .set('lang', 'en')
        .set('excludeCollectionNo', '0');

      if (className) {
        params = params.set('className', className.toLowerCase());
      }
      if (rarity) {
        params = params.set('rarity', rarity.toString());
      }
      if (name) {
        params = params.set('name', name);
      }
      
      return this.http.get<Servant[]>(this.searchUrl, { params }).pipe(
        map(servants => this.injectMockGrades(servants)),
        shareReplay(1)
      );
    } else {
      return this.http.get<Servant[]>(this.exportUrl).pipe(
        map(servants => this.injectMockGrades(servants.filter(s => s.collectionNo > 0))), 
        shareReplay(1)
      );
    }
  }

  private injectMockGrades(servants: Servant[]): Servant[] {
    const mockMap: { [key: number]: string } = {
      34: 'EX', // Kaleidoscope (wait, this is a CE, but let's check IDs)
      1: 'S',   // Mash
      3: 'S',   // Altera
      11: 'S',  // Emiya
      14: 'S',  // Cu Chulainn (NP5)
      59: 'S',  // Gilgamesh
      76: 'EX', // Zhuge Liang (Waver)
      77: 'S',  // Cu Chulainn (Alter)
      94: 'EX', // Arash (NP5)
      106: 'S', // Jeanne (Alter)
      150: 'EX', // Merlin
      215: 'EX', // Skadi
      259: 'EX', // Space Ishtar
      268: 'EX', // Castoria
      312: 'EX', // Koyanskaya
      314: 'EX', // Oberon
    };

    return servants.map(s => ({
      ...s,
      tierGrade: mockMap[s.collectionNo] || s.tierGrade
    }));
  }

  getServantDetails(id: number): Observable<Servant> {
    return this.http.get<Servant>(`${this.detailUrl}${id}?lang=en`).pipe(
      shareReplay(1)
    );
  }
}