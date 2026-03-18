export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
}

export interface ProjectDTO {
  name: string;
  description?: string;
}
