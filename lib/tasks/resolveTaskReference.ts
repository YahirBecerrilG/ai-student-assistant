import { searchTasks } from "../tasks/searchTasks";
import { Task } from "../types/task";

export type TaskResolution =
    | {
        status: "unique";
        task: Task;
    }
    | {
        status: "ambiguous";
        tasks: Task[];
    }
    | {
        status: "not_found";
        tasks: [];
    };

export async function resolveTaskReference(
    userId: number,
    taskReference: string,
    candidateTasks?: Task[]
): Promise<TaskResolution> {

    /*
     * CASO 1:
     * No existen candidatos previos.
     *
     * Se trata de una búsqueda inicial.
     * searchTasks ya devuelve todas las coincidencias.
     */
    if (!candidateTasks) {

        const tasks = await searchTasks(
            userId,
            taskReference
        );

        if (tasks.length === 0) {
            return {
                status: "not_found",
                tasks: []
            };
        }

        if (tasks.length === 1) {
            return {
                status: "unique",
                task: tasks[0]
            };
        }

        return {
            status: "ambiguous",
            tasks
        };
    }

    /*
     * CASO 2:
     * Ya tenemos una lista de tareas candidatas.
     *
     * Ahora sí intentamos identificar cuál de ellas
     * corresponde a la respuesta del usuario.
     */

    const normalizedReference = taskReference
    .toLowerCase()
    .trim();

    /*
    * Primero intentamos encontrar una coincidencia
    * específica por nombre de tarea.
    */
    const nameMatches = candidateTasks.filter((task) => {

        const normalizedName = task.name
            .toLowerCase()
            .trim();

        return (
            normalizedReference.includes(normalizedName) ||
            normalizedName.includes(normalizedReference)
        );
    });

    if (nameMatches.length === 1) {
        return {
            status: "unique",
            task: nameMatches[0]
        };
    }

    if (nameMatches.length > 1) {
        return {
            status: "ambiguous",
            tasks: nameMatches
        };
    }

    /*
    * Si no coincidió por nombre, intentamos
    * utilizar materia o descripción.
    */
    const detailMatches = candidateTasks.filter((task) => {

        const normalizedSubject = task.subject
            ?.toLowerCase()
            .trim();

        const normalizedDescription = task.description
            ?.toLowerCase()
            .trim();

        return (
            (
                normalizedSubject !== undefined &&
                normalizedReference.includes(normalizedSubject)
            ) ||
            (
                normalizedDescription !== undefined &&
                normalizedReference.includes(normalizedDescription)
            )
        );
    });

    if (detailMatches.length === 1) {
        return {
            status: "unique",
            task: detailMatches[0]
        };
    }

    if (detailMatches.length > 1) {
        return {
            status: "ambiguous",
            tasks: detailMatches
        };
    }

    return {
        status: "not_found",
        tasks: []
    };
}