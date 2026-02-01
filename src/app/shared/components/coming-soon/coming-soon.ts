import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="coming-soon-container">
      <div class="icon">{{ icon() }}</div>
      <h2>{{ title() }}</h2>
      <p>Esta sección está actualmente en desarrollo.</p>
      <div class="progress-bar">
        <div class="progress" [style.width]="'30%'"></div>
      </div>
      <p class="small">Vuelve pronto para ver las actualizaciones.</p>
    </div>
  `,
  styles: [`
    .coming-soon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      background: var(--filter-bg);
      border-radius: 20px;
      margin: 40px auto;
      max-width: 600px;
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 30px var(--shadow-color);
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 2rem;
      color: var(--text-primary);
      margin-bottom: 10px;
    }
    p {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      margin: 30px 0;
      overflow: hidden;
    }
    .progress {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #a29bfe);
      border-radius: 4px;
    }
    .small {
      font-size: 0.9rem;
      opacity: 0.7;
    }
  `]
})
export class ComingSoonComponent implements OnInit {
  title = signal('Próximamente');
  icon = signal('🚀');

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['title']) this.title.set(data['title']);
      if (data['icon']) this.icon.set(data['icon']);
    });
  }
}
