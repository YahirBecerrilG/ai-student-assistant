import { Task } from "../types/task";

type PrismaTask = {
    id: number;
    userId: number;
    name: string;
    category: string;
    priority: string;
    dateText: string | null;
    scheduledDate: Date | null;
    description: string | null;
    subject: string | null;
    estimatedTime: number | null;
    createdAt: Date;
};

export function mapPrismaTaskToTask(task: PrismaTask): Task {
    return {
        id: task.id,
        userId: task.userId,
        name: task.name,
        category: task.category as Task["category"],
        priority: task.priority as Task["priority"],
        dateText: task.dateText,
        scheduledDate: task.scheduledDate,
        description: task.description,
        subject: task.subject,
        estimatedTime: task.estimatedTime,
        createdAt: task.createdAt,
    };
}