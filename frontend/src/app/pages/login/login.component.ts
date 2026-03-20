import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  styles: [`
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .form-panel { animation: fadeSlideIn 0.4s ease both; }
  `],
  template: `
    <div class="min-h-screen flex relative">

      <!-- Back button — top-left of full page -->
      <a routerLink="/" class="absolute top-5 left-5 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium group">
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back
      </a>

      <!-- Left Panel -->
      <div class="hidden md:flex w-2/5 flex-col items-center justify-center p-12 relative overflow-hidden"
           style="background: linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #0d9488 100%)">
        <!-- Decorative circles -->
        <div class="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20" style="background: rgba(255,255,255,0.3)"></div>
        <div class="absolute bottom-[-80px] left-[-40px] w-72 h-72 rounded-full opacity-15" style="background: rgba(255,255,255,0.2)"></div>
        <div class="absolute top-1/3 left-[-30px] w-32 h-32 rounded-full opacity-10" style="background: rgba(255,255,255,0.3)"></div>

        <!-- Logo -->
        <div class="flex flex-col items-center gap-2 mb-16">
          <span class="text-5xl font-extrabold text-white tracking-wide">TaskHub</span>
        </div>

        <div class="text-center z-10">
          <h2 class="text-4xl font-bold text-white mb-4">Hello!</h2>
          <p class="text-teal-200 text-base leading-relaxed mb-10">
            Enter your personal details<br>and start your journey with us
          </p>
          <a routerLink="/register"
            class="inline-block px-10 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-teal-700 transition-all tracking-widest text-sm uppercase">
            Sign Up
          </a>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="flex-1 flex items-center justify-center bg-white p-8">
        <div class="form-panel w-full max-w-md">
          <!-- Logo above Sign In -->
          <div class="flex flex-col items-center mb-6">
            <img src="logo.jpg" alt="TaskHub Logo" class="w-20 h-20 object-contain mb-3">
          </div>
          <h1 class="text-4xl font-bold text-slate-800 text-center mb-2">Sign In</h1>
          <p class="text-slate-400 text-center text-sm mb-8">Use your email and password</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div *ngIf="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {{ error }}
            </div>

            <div class="mb-4">
              <div class="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3"
                   [class.ring-2]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                   [class.ring-red-400]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input type="email" formControlName="email" placeholder="Email"
                  class="flex-1 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 text-sm">
              </div>
              <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="mt-1 text-xs text-red-500 pl-1">Valid email is required</p>
            </div>

            <div class="mb-8">
              <div class="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3"
                   [class.ring-2]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                   [class.ring-red-400]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input type="password" formControlName="password" placeholder="Password"
                  class="flex-1 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 text-sm">
              </div>
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-1 text-xs text-red-500 pl-1">Password is required</p>
            </div>

            <button type="submit" [disabled]="loading"
              class="w-full py-3 font-bold text-white rounded-full tracking-widest text-sm uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style="background: linear-gradient(135deg, #134e4a, #0d9488)">
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>

          <!-- Mobile link -->
          <p class="text-center text-slate-400 text-sm mt-6 md:hidden">
            Don't have an account?
            <a routerLink="/register" class="text-teal-600 font-semibold hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    if (authService.isLoggedIn) router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error?.error || 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}
