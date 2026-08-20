import { Task } from "../types/task";
import { prisma } from "../prisma";
import { mapPrismaTaskToTask } from "./taskMapper";

export async function searchTasks(
    userId: number,
    query: string
): Promise<Task[]> {

    const tasks = await prisma.task.findMany({
        where: {
            userId,
            OR: [
                {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    subject: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });

    return tasks.map(mapPrismaTaskToTask);
}