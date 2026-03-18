export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee: string;
  dueDate: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDTO {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  assignee?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
