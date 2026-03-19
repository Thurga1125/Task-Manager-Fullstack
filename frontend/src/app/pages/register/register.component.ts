import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  styles: [`
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateX(-30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .form-panel { animation: fadeSlideIn 0.4s ease both; }
  `],
  template: `
    <div class="min-h-screen flex relative">

      <!-- Back button -->
      <a routerLink="/" class="absolute top-5 left-5 z-50 flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium group">
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back
      </a>

      <!-- Left Panel — Form -->
      <div class="flex-1 flex items-center justify-center bg-white p-8">
        <div class="form-panel w-full max-w-md">
          <div class="flex flex-col items-center mb-6">
            <img src="logo.jpg" alt="TaskHub Logo" class="w-20 h-20 object-contain mb-3">
          </div>
          <h1 class="text-4xl font-bold text-slate-800 text-center mb-2">Create Account</h1>
          <p class="text-slate-400 text-center text-sm mb-8">Fill in your details to get started</p>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div *ngIf="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{{ error }}</div>

            <!-- Username -->
            <div class="mb-4">
              <div class="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3"
                   [class.ring-2]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                   [class.ring-red-400]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
                <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <input type="text" formControlName="username" placeholder="Username"
                  class="flex-1 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 text-sm">
              </div>
              <p *ngIf="registerForm.get('username')?.hasError('required') && registerForm.get('username')?.touched" class="mt-1 text-xs text-red-500 pl-1">Username is required</p>
              <p *ngIf="registerForm.get('username')?.hasError('minlength') && registerForm.get('username')?.touched" class="mt-1 text-xs text-red-500 pl-1">Username must be at least 3 characters</p>
              <p *ngIf="registerForm.get('username')?.hasError('maxlength') && registerForm.get('username')?.touched" class="mt-1 text-xs text-red-500 pl-1">Username must be 50 characters or fewer</p>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <div class="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3"
                   [class.ring-2]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                   [class.ring-red-400]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input type="email" formControlName="email" placeholder="Email address"
                  class="flex-1 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 text-sm">
              </div>
              <p *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched" class="mt-1 text-xs text-red-500 pl-1">Email is required</p>
              <p *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched" class="mt-1 text-xs text-red-500 pl-1">Please enter a valid email address</p>
            </div>

            <!-- Password -->
            <div class="mb-2">
              <div class="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3"
                   [class.ring-2]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                   [class.ring-red-400]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input type="password" formControlName="password" placeholder="Password"
                  class="flex-1 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 text-sm"
                  (input)="updatePasswordStrength()">
              </div>
              <p *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched" class="mt-1 text-xs text-red-500 pl-1">Password is required</p>
              <p *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched" class="mt-1 text-xs text-red-500 pl-1">Password must be at least 6 characters</p>
            </div>

            <!-- Password Strength Indicator -->
            <div *ngIf="registerForm.get('password')?.value" class="mb-6 px-1">
              <div class="flex gap-1.5 mb-1.5">
                <div *ngFor="let seg of [0,1,2,3]"
                  class="h-1.5 flex-1 rounded-full transition-all duration-300"
                  [class]="seg < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-slate-200'">
                </div>
              </div>
              <p class="text-xs" [class]="strengthTextColors[passwordStrength - 1] || 'text-slate-400'">
                {{ strengthLabels[passwordStrength - 1] || '' }}
                <span class="text-slate-400 ml-1">{{ strengthHints[passwordStrength - 1] || '' }}</span>
              </p>
            </div>
            <div *ngIf="!registerForm.get('password')?.value" class="mb-6"></div>

            <button type="submit" [disabled]="loading"
              class="w-full py-3 font-bold text-white rounded-full tracking-widest text-sm uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style="background: linear-gradient(135deg, #134e4a, #0d9488)">
              {{ loading ? 'Creating...' : 'Sign Up' }}
            </button>
          </form>

          <p class="text-center text-slate-400 text-sm mt-6 md:hidden">
            Already have an account?
            <a routerLink="/login" class="text-teal-600 font-semibold hover:underline">Sign In</a>
          </p>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="hidden md:flex w-2/5 flex-col items-center justify-center p-12 relative overflow-hidden"
           style="background: linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #0d9488 100%)">
        <div class="absolute top-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-20" style="background: rgba(255,255,255,0.3)"></div>
        <div class="absolute bottom-[-80px] right-[-40px] w-72 h-72 rounded-full opacity-15" style="background: rgba(255,255,255,0.2)"></div>
        <div class="absolute top-1/3 right-[-30px] w-32 h-32 rounded-full opacity-10" style="background: rgba(255,255,255,0.3)"></div>

        <div class="flex flex-col items-center gap-2 mb-16">
          <span class="text-5xl font-extrabold text-white tracking-wide">TaskHub</span>
        </div>

        <div class="text-center z-10">
          <h2 class="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
          <p class="text-teal-200 text-base leading-relaxed mb-10">
            To keep connected with us please<br>login with your personal info
          </p>
          <a routerLink="/login"
            class="inline-block px-10 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-teal-700 transition-all tracking-widest text-sm uppercase">
            Sign In
          </a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  passwordStrength = 0;

  strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  strengthTextColors = ['text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-600'];
  strengthHints = [
    '— add numbers or symbols',
    '— add uppercase letters',
    '— add special characters',
    '— great password!'
  ];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    if (authService.isLoggedIn) router.navigate(['/dashboard']);
  }

  updatePasswordStrength(): void {
    const password = this.registerForm.get('password')?.value || '';
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    this.passwordStrength = Math.max(1, score);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        const fieldErrors = err.error?.fields;
        if (fieldErrors) {
          this.error = Object.values(fieldErrors).join(', ');
        } else {
          this.error = err.error?.error || 'Registration failed. Please check your details and try again.';
        }
        this.loading = false;
      }
    });
  }
}
