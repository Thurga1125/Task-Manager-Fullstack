import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(-100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    .sidebar-animate {
      animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
  `],
  template: `
    <div class="sidebar-animate fixed left-0 top-0 h-full w-64 flex flex-col z-10 bg-white border-r border-slate-200 shadow-sm">
      <!-- Logo -->
      <div class="p-6 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <img src="logo.jpg" alt="TaskHub Logo" class="w-10 h-10">
          <span class="text-xl font-bold text-slate-800 tracking-wide"></span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-4 space-y-1">
        <a routerLink="/dashboard" routerLinkActive="bg-teal-100 text-teal-700 font-semibold"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-all font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
          </svg>
          Dashboard
        </a>
        <a *ngIf="projectId" [routerLink]="['/projects', projectId]" routerLinkActive="bg-teal-100 text-teal-700 font-semibold"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-all font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Tasks
        </a>
      </nav>

      <!-- User + Logout -->
      <div class="p-4 border-t border-slate-100">
        <a routerLink="/settings"
           class="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 hover:bg-slate-100 transition-all cursor-pointer">
          <div class="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm"
               style="background: linear-gradient(135deg, #0f766e, #0d9488);">
            <img *ngIf="profilePicture" [src]="profilePicture" alt="Profile" class="w-full h-full object-cover">
            <span *ngIf="!profilePicture" class="text-white text-sm font-bold">{{ avatarLetter }}</span>
          </div>
          <div class="flex-1 text-left min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ username }}</p>
            <p class="text-xs text-slate-400 truncate">Online</p>
          </div>
        </a>
        <button (click)="logout()"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  `
})
export class SidebarComponent {
  @Input() projectId?: string;

  get username(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).username : '';
  }

  get profilePicture(): string {
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user).profilePicture || '') : '';
  }

  get avatarLetter(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : 'U';
  }

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
