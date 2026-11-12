import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <header class="topbar">
      <h1>Student Management System</h1>
      <nav><a routerLink="/students">Students</a></nav>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}
