import {Task} from "../types/task";
import { prisma } from "../prisma";
import { mapPrismaTaskToTask } from "./taskMapper";

// función para obtener todas las tareas de un usuario específico
export async function getTasks(userId: number): Promise<Task[]> {
    const prismaTasks = await prisma.task.findMany({ // Obtener todas las tareas del usuario
        where: {
            userId
        }
    });

    return prismaTasks.map(mapPrismaTaskToTask); // Mapear las tareas de Prisma a nuestro tipo Task
}
