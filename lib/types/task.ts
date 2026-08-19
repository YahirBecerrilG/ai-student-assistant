export type Category =
  | "exam"
  | "assignment"
  | "project"
  | "study"
  | "other";

export type Priority =
  | "low"
  | "medium"
  | "high"
  | "unknown";

export interface Task {
  id: number;
  userId: number;
  name: string;
  category: Category;
  priority: Priority;
  dateText: string | null;
  scheduledDate: Date | null;
  description: string | null;
  subject: string | null;
  estimatedTime: number | null;
  createdAt: Date;
}

export interface CreateTaskInput {
    name: string;
    category: Category;
    priority: Priority;
    dateText: string | null;
    description: string | null;
    subject: string | null;
    estimatedTime: string | null;
}

export interface UpdateTaskInput {
    taskId: number;
    name?: string;
    category?: Category;
    priority?: Priority;
    dateText?: string | null;
    description?: string | null;
    subject?: string | null;
    estimatedTime?: string | null;
}