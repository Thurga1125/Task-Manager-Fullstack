import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen" style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdf4 100%)">
      <app-sidebar></app-sidebar>

      <main class="ml-64 flex-1 p-8 flex flex-col items-center">
        <div class="w-full max-w-2xl">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Settings</h1>
          <p class="text-teal-500 mt-1">Manage your profile and account</p>
        </div>

        <div class="space-y-6">

          <!-- Profile Picture Card -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Profile Picture</h2>
            <div class="flex items-center gap-6">
              <div class="relative">
                <div class="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border-4 border-teal-100 shadow-lg" style="background: linear-gradient(135deg, #0f766e, #0d9488);">
                  <img *ngIf="profilePicture" [src]="profilePicture" alt="Profile" class="w-full h-full object-cover">
                  <span *ngIf="!profilePicture" class="text-white text-2xl font-bold">{{ avatarLetter }}</span>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-slate-500 mb-3">Upload a photo (JPG, PNG, GIF). Max 5MB.</p>
                <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  Choose Photo
                  <input type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)">
                </label>
                <button *ngIf="profilePicture" (click)="removeProfilePicture()"
                  class="ml-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors">
                  Remove
                </button>
              </div>
            </div>
            <div *ngIf="profileSuccess" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              Profile picture updated successfully!
            </div>
            <div *ngIf="profileError" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {{ profileError }}
            </div>
          </div>

          <!-- Account Info Card -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Account Information</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-3 border-b border-teal-50">
                <span class="text-sm font-medium text-slate-500">Username</span>
                <span class="text-sm font-semibold text-slate-900">{{ username }}</span>
              </div>
              <div class="flex items-center justify-between py-3">
                <span class="text-sm font-medium text-slate-500">Email</span>
                <span class="text-sm font-semibold text-slate-900">{{ email }}</span>
              </div>
            </div>
          </div>

          <!-- Change Password Card -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Change Password</h2>
            <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
              <div *ngIf="passwordSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                Password changed successfully!
              </div>
              <div *ngIf="passwordError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {{ passwordError }}
              </div>

              <div class="mb-4">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                <input type="password" formControlName="currentPassword" placeholder="Enter current password"
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  [class.border-red-400]="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched">
                <p *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched"
                  class="mt-1 text-xs text-red-500">Current password is required</p>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <input type="password" formControlName="newPassword" placeholder="At least 6 characters"
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  [class.border-red-400]="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched">
                <p *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched"
                  class="mt-1 text-xs text-red-500">New password must be at least 6 characters</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                <input type="password" formControlName="confirmPassword" placeholder="Repeat new password"
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  [class.border-red-400]="passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched">
                <p *ngIf="passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched"
                  class="mt-1 text-xs text-red-500">Passwords do not match</p>
              </div>

              <button type="submit" [disabled]="savingPassword"
                class="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold transition-colors disabled:opacity-50 shadow-md shadow-teal-200">
                {{ savingPassword ? 'Updating...' : 'Update Password' }}
              </button>
            </form>
          </div>

        </div>
        </div>
      </main>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  passwordForm: FormGroup;
  savingPassword = false;
  passwordSuccess = false;
  passwordError = '';
  profilePicture = '';
  profileSuccess = false;
  profileError = '';

  get username(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).username : '';
  }

  get email(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).email : '';
  }

  get avatarLetter(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : 'U';
  }

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.profilePicture = JSON.parse(user).profilePicture || '';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPw = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return newPw === confirm ? null : { mismatch: true };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.profileError = 'File must be under 5MB';
      return;
    }
    this.profileError = '';
    this.authService.uploadAvatar(file).subscribe({
      next: ({ url }) => {
        this.authService.updateProfile(url).subscribe({
          next: () => {
            this.profilePicture = url;
            this.profileSuccess = true;
            setTimeout(() => this.profileSuccess = false, 3000);
          },
          error: () => { this.profileError = 'Failed to update profile picture'; }
        });
      },
      error: err => {
        this.profileError = err.error?.error || 'Failed to upload image';
      }
    });
  }

  removeProfilePicture(): void {
    this.authService.updateProfile('').subscribe({
      next: () => {
        this.profilePicture = '';
        this.profileSuccess = true;
        setTimeout(() => this.profileSuccess = false, 3000);
      },
      error: () => { this.profileError = 'Failed to remove profile picture'; }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.savingPassword = true;
    this.passwordError = '';
    this.passwordSuccess = false;
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.passwordSuccess = true;
        this.savingPassword = false;
        this.passwordForm.reset();
        setTimeout(() => this.passwordSuccess = false, 3000);
      },
      error: err => {
        this.passwordError = err.error?.error || 'Failed to change password';
        this.savingPassword = false;
      }
    });
  }
}
