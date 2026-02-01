import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // Uso de Signals para manejar el estado de forma reactiva y eficiente [47, Turno 7]
  protected readonly title = signal('FGO Servant Tracker');
  protected readonly darkMode = signal(false);

  // La lógica compleja de datos se debe delegar a un servicio, no aquí [2]
  constructor() {
    // Check local storage preference
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    this.darkMode.set(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    }
  }

  toggleTheme(): void {
    this.darkMode.update(val => !val);
    const isDark = this.darkMode();
    
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }
}
