import { CreateTaskInput, Task } from "../types/task";
import { normalizeEstimatedTime, normalizeDate } from "./normalization";
import { prisma } from "../prisma";
import { mapPrismaTaskToTask } from "./taskMapper";

export async function createTask(
    userId: number,
    input: CreateTaskInput): Promise<Task> {
    const {
        name,
        category,
        priority,
        dateText,
        description,
        subject,
        estimatedTime
    } = input;

    const task = await prisma.task.create({
        data: {
            userId,
            name,
            category,
            priority,
            dateText,  
            description,
            subject,
            estimatedTime: normalizeEstimatedTime(estimatedTime),
            scheduledDate: normalizeDate(dateText, new Date()),
        },
    });


    return mapPrismaTaskToTask(task);
}