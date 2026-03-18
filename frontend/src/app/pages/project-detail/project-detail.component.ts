import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-sidebar [projectId]="projectId"></app-sidebar>

      <main class="ml-64 flex-1 p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <a routerLink="/dashboard" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </a>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ project?.name || 'Loading...' }}</h1>
              <p class="text-gray-500 mt-0.5">{{ project?.description }}</p>
            </div>
          </div>
          <button (click)="openCreateModal()"
            class="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold shadow-md shadow-teal-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Task
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-4 gap-4 mb-6 mt-6">
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-sm text-gray-500 mb-1">Total Tasks</p>
            <p class="text-3xl font-bold text-teal-600">{{ tasks.length }}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-sm text-gray-500 mb-1">To Do</p>
            <p class="text-3xl font-bold text-gray-700">{{ countByStatus('TO_DO') }}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-sm text-gray-500 mb-1">In Progress</p>
            <p class="text-3xl font-bold text-teal-500">{{ countByStatus('IN_PROGRESS') }}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-sm text-gray-500 mb-1">Done</p>
            <p class="text-3xl font-bold text-green-500">{{ countByStatus('DONE') }}</p>
          </div>
        </div>

        <!-- Filter -->
        <div class="flex gap-2 mb-6">
          <button *ngFor="let f of filters" (click)="activeFilter = f.value"
            [class]="activeFilter === f.value ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300'"
            class="px-4 py-2 rounded-xl font-medium text-sm transition-colors">
            {{ f.label }}
          </button>
        </div>

        <!-- Kanban Board -->
        <div *ngIf="!loading" class="grid gap-6" [class]="activeFilter === 'ALL' ? 'grid-cols-3' : 'grid-cols-1 max-w-lg'">
          <div *ngFor="let col of visibleColumns" class="bg-gray-100 rounded-2xl p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-700">{{ col.label }} ({{ getColumnTasks(col.status).length }})</h3>
              <span [class]="col.dotClass" class="w-2.5 h-2.5 rounded-full"></span>
            </div>
            <div class="space-y-3 min-h-24">
              <div *ngIf="getColumnTasks(col.status).length === 0"
                class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400 text-sm">
                No tasks
              </div>
              <div *ngFor="let task of getColumnTasks(col.status)"
                class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <h4 class="font-semibold text-gray-900 text-sm leading-tight">{{ task.title }}</h4>
                  <div class="flex gap-1 shrink-0">
                    <button (click)="openEditModal(task)" class="p-1 text-gray-400 hover:text-teal-500 hover:bg-teal-50 rounded transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button (click)="deleteTask(task.id)" class="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p *ngIf="task.description" class="text-gray-500 text-xs line-clamp-2 mb-3">{{ task.description }}</p>
                <div class="flex items-center justify-between">
                  <span [class]="getStatusClass(task.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ getStatusLabel(task.status) }}</span>
                  <span class="text-xs text-gray-400">{{ task.createdAt | date:'MMM d' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="loading" class="flex items-center justify-center h-64">
          <div class="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    </div>

    <!-- Task Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="closeModal()">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" (click)="$event.stopPropagation()">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ editingTask ? 'Edit Task' : 'New Task' }}</h2>
        <form [formGroup]="taskForm" (ngSubmit)="saveTask()">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
            <input type="text" formControlName="title" placeholder="Enter task title"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              [class.border-red-400]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
            <p *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" class="mt-1 text-xs text-red-500">Title is required</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea formControlName="description" placeholder="Optional description..."
              rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <div class="grid grid-cols-3 gap-2">
              <label *ngFor="let s of statusOptions" class="relative cursor-pointer">
                <input type="radio" formControlName="status" [value]="s.value" class="sr-only">
                <div [class]="taskForm.get('status')?.value === s.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600'"
                  class="border-2 rounded-xl p-3 text-center text-sm font-medium transition-all hover:border-teal-300">
                  {{ s.label }}
                </div>
              </label>
            </div>
          </div>
          <div class="flex gap-3">
            <button type="button" (click)="closeModal()" class="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">Cancel</button>
            <button type="submit" [disabled]="saving" class="flex-1 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold transition-colors disabled:opacity-50">
              {{ saving ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProjectDetailComponent implements OnInit {
  projectId = '';
  project: Project | null = null;
  tasks: Task[] = [];
  loading = true;
  showModal = false;
  saving = false;
  editingTask: Task | null = null;
  activeFilter = 'ALL';
  taskForm: FormGroup;

  filters = [
    { label: 'All Tasks', value: 'ALL' },
    { label: 'To Do', value: 'TO_DO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' }
  ];

  columns = [
    { label: 'To Do', status: 'TO_DO', dotClass: 'bg-gray-400' },
    { label: 'In Progress', status: 'IN_PROGRESS', dotClass: 'bg-teal-500' },
    { label: 'Done', status: 'DONE', dotClass: 'bg-green-500' }
  ];

  statusOptions = [
    { label: 'To Do', value: 'TO_DO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' }
  ];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      status: ['TO_DO']
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.projectService.getProject(this.projectId).subscribe(p => this.project = p);
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks(this.projectId).subscribe({
      next: tasks => { this.tasks = tasks; this.loading = false; },
      error: () => this.loading = false
    });
  }

  countByStatus(status: string): number {
    return this.tasks.filter(t => t.status === status).length;
  }

  get visibleColumns() {
    if (this.activeFilter === 'ALL') return this.columns;
    return this.columns.filter(col => col.status === this.activeFilter);
  }

  getColumnTasks(status: string): Task[] {
    const filtered = this.activeFilter === 'ALL' ? this.tasks : this.tasks.filter(t => t.status === this.activeFilter);
    return filtered.filter(t => t.status === status);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { TO_DO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      TO_DO: 'bg-gray-100 text-gray-600',
      IN_PROGRESS: 'bg-teal-100 text-teal-700',
      DONE: 'bg-green-100 text-green-700'
    };
    return map[status] || '';
  }

  openCreateModal(): void {
    this.editingTask = null;
    this.taskForm.reset({ status: 'TO_DO' });
    this.showModal = true;
  }

  openEditModal(task: Task): void {
    this.editingTask = task;
    this.taskForm.patchValue({ title: task.title, description: task.description, status: task.status });
    this.showModal = true;
  }

  saveTask(): void {
    if (this.taskForm.invalid) { this.taskForm.markAllAsTouched(); return; }
    this.saving = true;
    const dto = this.taskForm.value;
    const obs = this.editingTask
      ? this.taskService.updateTask(this.editingTask.id, dto)
      : this.taskService.createTask(this.projectId, dto);
    obs.subscribe({
      next: task => {
        if (this.editingTask) {
          const idx = this.tasks.findIndex(t => t.id === task.id);
          if (idx >= 0) this.tasks[idx] = task;
        } else {
          this.tasks.push(task);
        }
        this.closeModal();
        this.saving = false;
      },
      error: () => this.saving = false
    });
  }

  deleteTask(id: string): void {
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => this.tasks = this.tasks.filter(t => t.id !== id)
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.taskForm.reset({ status: 'TO_DO' });
    this.editingTask = null;
  }
}
