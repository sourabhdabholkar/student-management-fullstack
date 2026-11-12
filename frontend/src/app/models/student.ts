// Mirrors the Student entity on the backend
export interface Student {
  id?: number;
  name: string;
  email: string;
  course: string;
  phone?: string;
  createdAt?: string;
}
