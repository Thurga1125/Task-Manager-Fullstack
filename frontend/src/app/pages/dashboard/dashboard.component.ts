import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen" style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdf4 100%)">
      <app-sidebar></app-sidebar>

      <main class="ml-64 flex-1 p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">My Projects</h1>
            <p class="text-slate-500 mt-1">Manage and track all your projects</p>
          </div>
          <button (click)="showModal = true"
            class="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold shadow-lg shadow-teal-600/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Project
          </button>
        </div>

        <!-- Skeleton Loaders -->
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let s of skeletons" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
            <div class="flex items-start justify-between mb-4">
              <div class="w-10 h-10 bg-slate-200 rounded-xl"></div>
            </div>
            <div class="h-5 bg-slate-200 rounded-lg mb-3 w-3/4"></div>
            <div class="h-4 bg-slate-100 rounded-lg mb-2 w-full"></div>
            <div class="h-4 bg-slate-100 rounded-lg mb-4 w-2/3"></div>
            <div class="flex items-center justify-between">
              <div class="h-3 bg-slate-100 rounded w-24"></div>
              <div class="h-6 bg-slate-100 rounded-lg w-20"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && projects.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
          <div class="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
            <svg class="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-700 mb-2">No projects yet</h3>
          <p class="text-slate-400 mb-4">Create your first project to get started</p>
          <button (click)="showModal = true" class="px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium transition-colors shadow-lg shadow-teal-600/20">
            Create Project
          </button>
        </div>

        <!-- Projects Grid -->
        <div *ngIf="!loading && projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let project of projects"
            class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all group">
            <div class="flex items-start justify-between mb-4">
              <div class="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <button (click)="deleteProject(project.id, $event)"
                class="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
            <a [routerLink]="['/projects', project.id]" class="block">
              <h3 class="text-lg font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">{{ project.name }}</h3>
              <p class="text-slate-500 text-sm line-clamp-2 mb-4">{{ project.description || 'No description' }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">{{ project.createdAt | date:'MMM d, y' }}</span>
                <span class="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">View Tasks →</span>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>

    <!-- Create Project Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeModal()">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" (click)="$event.stopPropagation()">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">New Project</h2>
        <form [formGroup]="projectForm" (ngSubmit)="createProject()">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Project Name *</label>
            <input type="text" formControlName="name" placeholder="My Awesome Project"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-slate-50"
              [class.border-red-400]="projectForm.get('name')?.invalid && projectForm.get('name')?.touched">
            <p *ngIf="projectForm.get('name')?.invalid && projectForm.get('name')?.touched" class="mt-1 text-xs text-red-500">Project name is required</p>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea formControlName="description" placeholder="Describe your project..."
              rows="3" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none bg-slate-50"></textarea>
          </div>
          <div class="flex gap-3">
            <button type="button" (click)="closeModal()" class="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
            <button type="submit" [disabled]="saving" class="flex-1 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-teal-600/20">
              {{ saving ? 'Creating...' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  showModal = false;
  saving = false;
  projectForm: FormGroup;
  skeletons = [1, 2, 3];

  constructor(private projectService: ProjectService, private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: projects => { this.projects = projects; this.loading = false; },
      error: () => this.loading = false
    });
  }

  createProject(): void {
    if (this.projectForm.invalid) { this.projectForm.markAllAsTouched(); return; }
    this.saving = true;
    this.projectService.createProject(this.projectForm.value).subscribe({
      next: project => {
        this.projects.unshift(project);
        this.closeModal();
        this.saving = false;
      },
      error: () => this.saving = false
    });
  }

  deleteProject(id: string, event: Event): void {
    event.preventDefault();
    if (!confirm('Delete this project and all its tasks?')) return;
    this.projectService.deleteProject(id).subscribe({
      next: () => this.projects = this.projects.filter(p => p.id !== id)
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.projectForm.reset();
  }
}
