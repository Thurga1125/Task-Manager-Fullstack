export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  projectId: string;
  userId: string;
  createdAt: string;
}

export interface TaskDTO {
  title: string;
  description?: string;
  status?: string;
}
