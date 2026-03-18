import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskDTO, PageResponse } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTasks(projectId: string, search = '', page = 0, size = 100): Observable<PageResponse<Task>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search);
    return this.http.get<PageResponse<Task>>(`${this.apiUrl}/projects/${projectId}/tasks`, { params });
  }

  createTask(projectId: string, dto: TaskDTO): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/projects/${projectId}/tasks`, dto);
  }

  updateTask(taskId: string, dto: TaskDTO): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, dto);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
  }
}
