import { Task, UpdateTaskInput} from "../types/task";
import { normalizeEstimatedTime, normalizeDate } from "./normalization";
import { prisma } from "../prisma";
import { mapPrismaTaskToTask } from "./taskMapper";

export async function updateTask(userId: number, input: UpdateTaskInput): Promise<Task | null> {

    // Encontrar la funcion
    const task = await prisma.task.findFirst({
        where: {
            id: input.taskId,
            userId
        }
    }); 
    // Si no se encuentra la tarea, devolver null
    if (!task) {
        return null;
    }

    // Preparar los datos para la actualización, manteniendo los valores existentes si no se proporcionan nuevos valores
    const data = {
        name: input.name !== undefined
            ? input.name
            : task.name,

        category: input.category !== undefined
            ? input.category
            : task.category,

        priority: input.priority !== undefined
            ? input.priority
            : task.priority,

        dateText: input.dateText !== undefined
            ? input.dateText
            : task.dateText,

        description: input.description !== undefined
            ? input.description
            : task.description,

        subject: input.subject !== undefined
            ? input.subject
            : task.subject,

        estimatedTime: input.estimatedTime !== undefined
            ? normalizeEstimatedTime(input.estimatedTime)
            : task.estimatedTime,

        scheduledDate: input.dateText !== undefined
            ? normalizeDate(input.dateText, new Date())
            : task.scheduledDate,
    };
    // Actualizar la tarea
    const updatedTask = await prisma.task.update({
        where: {
            id: task.id,
        },
        data,
    });

    return mapPrismaTaskToTask(updatedTask);
}
