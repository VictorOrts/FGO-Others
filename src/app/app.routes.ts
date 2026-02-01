import { Routes } from '@angular/router';
// Components are now lazy-loaded via loadComponent

export const routes: Routes = [
  { 
    path: 'tier-list', 
    loadComponent: () => import('./features/tier-list/tier-list').then(m => m.TierList) 
  },
  { 
    path: 'craft-essences', 
    loadComponent: () => import('./features/craft-essences/craft-essences').then(m => m.CraftEssencesComponent) 
  },
  { 
    path: 'materials', 
    loadComponent: () => import('./shared/components/coming-soon/coming-soon').then(m => m.ComingSoonComponent), 
    data: { title: 'Calculadora de Materiales', icon: '💎' } 
  },
  { 
    path: 'command-codes', 
    loadComponent: () => import('./shared/components/coming-soon/coming-soon').then(m => m.ComingSoonComponent), 
    data: { title: 'Command Codes', icon: '📜' } 
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./shared/components/coming-soon/coming-soon').then(m => m.ComingSoonComponent), 
    data: { title: 'Mis Favoritos', icon: '⭐' } 
  },
  { path: '', redirectTo: 'tier-list', pathMatch: 'full' }
];
