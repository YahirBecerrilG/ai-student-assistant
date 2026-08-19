import {Task} from "../types/task";
import { prisma } from "../prisma";
import { mapPrismaTaskToTask } from "./taskMapper";

// función para obtener una tarea específica de un usuario
export async function getTask(userId: number, taskId: number): Promise<Task | null> {
    const task = await prisma.task.findFirst({ // Obtener la tarea específica del usuario (el primero que coincida con el userId y taskId)
        where: {
            id: taskId,
            userId
        }
    });

    if (!task){
        return null; // Si no se encuentra la tarea, devolver null
    }

    return mapPrismaTaskToTask(task); // Mapear la tarea de Prisma a nuestro tipo Task
}
