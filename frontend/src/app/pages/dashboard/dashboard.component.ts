import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen" style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdf4 100%)">
      <app-sidebar></app-sidebar>

      <main class="ml-64 flex-1 p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">My Projects</h1>
            <p class="text-slate-500 mt-1">Manage and track all your projects</p>
          </div>
          <button (click)="openCreateModal()"
            class="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold shadow-lg shadow-teal-600/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Project
          </button>
        </div>

        <!-- Search + Sort Row -->
        <div class="flex items-center gap-4 mb-6">
          <div class="relative flex-1">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
            </svg>
            <input [(ngModel)]="searchTerm" (ngModelChange)="onSearch()" type="text"
              placeholder="Search projects..."
              class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-700 placeholder-slate-400 shadow-sm">
            <button *ngIf="searchTerm" (click)="clearSearch()"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <!-- Sort Dropdown -->
          <div class="relative">
            <select [(ngModel)]="sortBy" (ngModelChange)="applySort()"
              class="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 text-sm font-medium shadow-sm cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <!-- Error Banner -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0"/>
          </svg>
          {{ errorMessage }}
          <button (click)="errorMessage = ''" class="ml-auto text-red-400 hover:text-red-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Skeleton Loaders -->
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let s of skeletons" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
            <div class="flex items-start justify-between mb-4">
              <div class="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div class="flex gap-1">
                <div class="w-7 h-7 bg-slate-100 rounded-lg"></div>
                <div class="w-7 h-7 bg-slate-100 rounded-lg"></div>
              </div>
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
        <div *ngIf="!loading && displayedProjects.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
          <div class="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
            <svg class="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-700 mb-2">{{ searchTerm ? 'No projects found' : 'No projects yet' }}</h3>
          <p class="text-slate-400 mb-4">{{ searchTerm ? 'Try a different search term' : 'Create your first project to get started' }}</p>
          <button *ngIf="!searchTerm" (click)="openCreateModal()" class="px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium transition-colors shadow-lg shadow-teal-600/20">
            Create Project
          </button>
        </div>

        <!-- Projects Grid -->
        <div *ngIf="!loading && displayedProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let project of displayedProjects"
            class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all group">
            <div class="flex items-start justify-between mb-4">
              <div class="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <!-- Action Buttons -->
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button (click)="openEditModal(project, $event)"
                  class="p-1.5 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded-lg transition-all"
                  title="Edit project">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button (click)="confirmDelete(project, $event)"
                  class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete project">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
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

        <!-- Pagination -->
        <div *ngIf="!loading && totalElements > 0" class="flex items-center justify-between mt-8">
          <p class="text-sm text-slate-500">
            Showing {{ displayedProjects.length }} of {{ totalElements }} project{{ totalElements !== 1 ? 's' : '' }}
          </p>
          <div *ngIf="totalPages > 1" class="flex items-center gap-2">
            <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0"
              class="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button *ngFor="let p of pageNumbers" (click)="goToPage(p)"
              [class]="p === currentPage ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'"
              class="w-9 h-9 rounded-xl border font-medium text-sm transition-all">
              {{ p + 1 }}
            </button>
            <button (click)="goToPage(currentPage + 1)" [disabled]="isLastPage"
              class="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Create Project Modal -->
    <div *ngIf="showCreateModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeCreateModal()">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" (click)="$event.stopPropagation()">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">New Project</h2>
        <form [formGroup]="projectForm" (ngSubmit)="createProject()">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Project Name <span class="text-red-500">*</span></label>
            <input type="text" formControlName="name" placeholder="My Awesome Project"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-slate-50"
              [class.border-red-400]="projectForm.get('name')?.invalid && projectForm.get('name')?.touched">
            <p *ngIf="projectForm.get('name')?.hasError('required') && projectForm.get('name')?.touched" class="mt-1 text-xs text-red-500">Project name is required</p>
            <p *ngIf="projectForm.get('name')?.hasError('maxlength') && projectForm.get('name')?.touched" class="mt-1 text-xs text-red-500">Name must be 100 characters or fewer</p>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Description <span class="text-slate-400 font-normal">(optional)</span></label>
            <textarea formControlName="description" placeholder="Describe your project..."
              rows="3" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none bg-slate-50"></textarea>
            <p *ngIf="projectForm.get('description')?.hasError('maxlength') && projectForm.get('description')?.touched" class="mt-1 text-xs text-red-500">Description must be 500 characters or fewer</p>
          </div>
          <div *ngIf="saveError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{{ saveError }}</div>
          <div class="flex gap-3">
            <button type="button" (click)="closeCreateModal()" class="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
            <button type="submit" [disabled]="saving" class="flex-1 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-teal-600/20">
              {{ saving ? 'Creating...' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Project Modal -->
    <div *ngIf="showEditModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeEditModal()">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" (click)="$event.stopPropagation()">
        <h2 class="text-2xl font-bold text-slate-900 mb-1">Edit Project</h2>
        <p class="text-slate-400 text-sm mb-6">Update your project details</p>
        <form [formGroup]="editProjectForm" (ngSubmit)="updateProject()">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Project Name <span class="text-red-500">*</span></label>
            <input type="text" formControlName="name" placeholder="Project name"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-slate-50"
              [class.border-red-400]="editProjectForm.get('name')?.invalid && editProjectForm.get('name')?.touched">
            <p *ngIf="editProjectForm.get('name')?.hasError('required') && editProjectForm.get('name')?.touched" class="mt-1 text-xs text-red-500">Project name is required</p>
            <p *ngIf="editProjectForm.get('name')?.hasError('maxlength') && editProjectForm.get('name')?.touched" class="mt-1 text-xs text-red-500">Name must be 100 characters or fewer</p>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Description <span class="text-slate-400 font-normal">(optional)</span></label>
            <textarea formControlName="description" placeholder="Describe your project..."
              rows="3" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none bg-slate-50"></textarea>
            <p *ngIf="editProjectForm.get('description')?.hasError('maxlength') && editProjectForm.get('description')?.touched" class="mt-1 text-xs text-red-500">Description must be 500 characters or fewer</p>
          </div>
          <div *ngIf="editError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{{ editError }}</div>
          <div class="flex gap-3">
            <button type="button" (click)="closeEditModal()" class="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
            <button type="submit" [disabled]="updating" class="flex-1 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-teal-600/20">
              {{ updating ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteConfirm" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelDelete()">
      <div class="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mx-auto mb-4">
          <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 text-center mb-2">Delete Project</h3>
        <p class="text-slate-500 text-sm text-center mb-1">Are you sure you want to delete</p>
        <p class="text-slate-800 font-semibold text-center mb-2">"{{ projectToDelete?.name }}"</p>
        <p class="text-red-500 text-xs text-center mb-6">This will permanently delete the project and all its tasks.</p>
        <div class="flex gap-3">
          <button (click)="cancelDelete()" class="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">
            Cancel
          </button>
          <button (click)="executeDelete()" [disabled]="deleting"
            class="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-colors disabled:opacity-50">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  displayedProjects: Project[] = [];
  loading = true;
  showCreateModal = false;
  showEditModal = false;
  showDeleteConfirm = false;
  saving = false;
  updating = false;
  deleting = false;
  projectForm: FormGroup;
  editProjectForm: FormGroup;
  skeletons = [1, 2, 3, 4, 5, 6];
  searchTerm = '';
  sortBy = 'newest';
  currentPage = 0;
  pageSize = 9;
  totalPages = 0;
  totalElements = 0;
  isLastPage = true;
  errorMessage = '';
  saveError = '';
  editError = '';
  editingProject: Project | null = null;
  projectToDelete: Project | null = null;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  constructor(private projectService: ProjectService, private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
    this.editProjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.errorMessage = '';
    this.projectService.getProjects(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.projects = response;
          this.totalPages = 1;
          this.totalElements = response.length;
          this.isLastPage = true;
        } else {
          this.projects = response.content ?? [];
          this.totalPages = response.totalPages ?? 1;
          this.totalElements = response.totalElements ?? this.projects.length;
          this.isLastPage = response.last ?? true;
        }
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        this.errorMessage = err.error?.error || 'Failed to load projects. Please try again.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.projects];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description?.toLowerCase().includes(term))
      );
    }
    // Client-side sort
    switch (this.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    this.displayedProjects = filtered;
  }

  applySort(): void {
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.loadProjects();
    }, 300);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.applyFilters();
    this.loadProjects();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadProjects();
  }

  // Create
  openCreateModal(): void {
    this.showCreateModal = true;
    this.saveError = '';
    this.projectForm.reset();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.saveError = '';
    this.projectForm.reset();
  }

  createProject(): void {
    if (this.projectForm.invalid) { this.projectForm.markAllAsTouched(); return; }
    this.saving = true;
    this.saveError = '';
    this.projectService.createProject(this.projectForm.value).subscribe({
      next: () => {
        this.currentPage = 0;
        this.loadProjects();
        this.closeCreateModal();
        this.saving = false;
      },
      error: err => {
        const fieldErrors = err.error?.fields;
        if (fieldErrors) {
          this.saveError = Object.values(fieldErrors).join(', ');
        } else {
          this.saveError = err.error?.error || 'Failed to create project. Please try again.';
        }
        this.saving = false;
      }
    });
  }

  // Edit
  openEditModal(project: Project, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.editingProject = project;
    this.editProjectForm.patchValue({ name: project.name, description: project.description || '' });
    this.editError = '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingProject = null;
    this.editError = '';
    this.editProjectForm.reset();
  }

  updateProject(): void {
    if (this.editProjectForm.invalid) { this.editProjectForm.markAllAsTouched(); return; }
    if (!this.editingProject) return;
    this.updating = true;
    this.editError = '';
    this.projectService.updateProject(this.editingProject.id, this.editProjectForm.value).subscribe({
      next: (updated) => {
        const idx = this.projects.findIndex(p => p.id === updated.id);
        if (idx >= 0) this.projects[idx] = updated;
        this.applyFilters();
        this.closeEditModal();
        this.updating = false;
      },
      error: err => {
        const fieldErrors = err.error?.fields;
        if (fieldErrors) {
          this.editError = Object.values(fieldErrors).join(', ');
        } else {
          this.editError = err.error?.error || 'Failed to update project. Please try again.';
        }
        this.updating = false;
      }
    });
  }

  // Delete
  confirmDelete(project: Project, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.projectToDelete = project;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.projectToDelete = null;
    this.deleting = false;
  }

  executeDelete(): void {
    if (!this.projectToDelete) return;
    this.deleting = true;
    this.projectService.deleteProject(this.projectToDelete.id).subscribe({
      next: () => {
        if (this.projects.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }
        this.cancelDelete();
        this.loadProjects();
      },
      error: err => {
        this.errorMessage = err.error?.error || 'Failed to delete project. Please try again.';
        this.cancelDelete();
      }
    });
  }
}
