import { effect, Service, signal } from '@angular/core';

export type Theme = 'system' | 'light';

@Service()
export class ThemeService {

  theme = signal<Theme>((localStorage.getItem('theme') as Theme) ?? 'system');

  constructor() {
    effect(() => {
      document.body.setAttribute('data-theme', this.theme());
      localStorage.setItem('theme', this.theme());
    });
  }

  setTheme(t: Theme) {
    this.theme.set(t);
  }

}
