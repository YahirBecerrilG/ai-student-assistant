import { Task } from "../types/task";
const tasks: Task[] = [];

export function getTasks(): Task[] {
    return tasks;
}

export function addTask(task: Task): void {
    tasks.push(task);
}



