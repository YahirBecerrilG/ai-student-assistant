import {Task} from "../types/task";
import { prisma } from "../prisma";
import { mapPrismaTaskToTask } from "./taskMapper";

export async function deleteTask(userId: number, taskId: number): Promise<Task | null> {
    const task = await prisma.task.findFirst({ // Obtener la tarea específica del usuario (el primero que coincida con el userId y taskId)
        where: {
            id: taskId,
            userId
        }
    });

    if (!task){
        return null; // Si no se encuentra la tarea, devolver null
    }

    const deletedTask = await prisma.task.delete({ // Eliminar la tarea específica del usuario
        where: {
            id: taskId
        }
    });
    return mapPrismaTaskToTask(deletedTask);
}