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
    taskReference: string
): Promise<TaskResolution> {

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