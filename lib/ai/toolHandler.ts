import type { ChatCompletionMessageToolCall } from "openai/resources/chat/completions";

import { createTask } from "../tasks/createTask";
import { getTasks } from "../tasks/getTasks";
import { getTask } from "../tasks/getTask";
import { updateTask } from "../tasks/updateTask";
import { deleteTask } from "../tasks/deleteTask";
import { searchTasks } from "../tasks/searchTasks";
import { resolveTaskReference } from "../tasks/resolveTaskReference";
import { setPendingAction } from "../ai/pendingAction";

export async function handleToolCall(
    toolCall: ChatCompletionMessageToolCall,
    userId: number,
) {

    if (toolCall.type !== "function") {
        throw new Error("El tipo de tool no es compatible.");
    }

    let toolArguments;

    try {
        toolArguments = JSON.parse(
            toolCall.function.arguments
        );
    } catch {
        return {
            success: false,
            error: "Los argumentos de la herramienta no tienen un formato válido."
        };
    }

    try {

        if (toolCall.function.name === "createTask") {

            const task = await createTask(
                userId,
                toolArguments
            );

            return {
                success: true,
                task
            };
        }

        if (toolCall.function.name === "getTasks") {

            const tasks = await getTasks(userId);

            return {
                success: true,
                tasks
            };
        }

        if (toolCall.function.name === "getTask") {

            const task = await getTask(
                userId,
                toolArguments.taskId
            );

            return {
                success: task !== null,
                task
            };
        }

        if (toolCall.function.name === "deleteTask") {

            if (toolArguments.taskReference === undefined) {

                return {
                    success: false,
                    error: "Debes proporcionar una referencia de tarea."
                };
            }

            const resolution = await resolveTaskReference(
                userId,
                toolArguments.taskReference
            );

            if (resolution.status === "not_found") {

                return {
                    success: false,
                    status: "not_found",
                    tasks: []
                };
            }

            if (resolution.status === "ambiguous") {

                return {
                    success: false,
                    status: "ambiguous",
                    tasks: resolution.tasks
                };
            }

            await setPendingAction({
                action: "deleteTask",
                taskId: resolution.task.id,
                userId
            });

            return {
                success: false,
                status: "confirmation_required",
                task: resolution.task
            };
        }

        if (toolCall.function.name === "updateTask") {

            if (toolArguments.taskId !== undefined) {

                const task = await updateTask(
                    userId,
                    toolArguments
                );

                return {
                    success: task !== null,
                    task
                };
            }

            if (toolArguments.taskReference !== undefined) {

                const resolution = await resolveTaskReference(
                    userId,
                    toolArguments.taskReference
                );

                if (resolution.status === "not_found") {

                    return {
                        success: false,
                        status: "not_found",
                        tasks: []
                    };
                }

                if (resolution.status === "ambiguous") {

                    await setPendingAction({
                        action: "updateTask",
                        taskReference: toolArguments.taskReference,
                        candidateTaskIds: resolution.tasks.map(
                            task => task.id
                        ),
                        updates: {
                            priority: toolArguments.priority,
                            name: toolArguments.name,
                            category: toolArguments.category,
                            dateText: toolArguments.dateText,
                            description: toolArguments.description,
                            subject: toolArguments.subject,
                            estimatedTime: toolArguments.estimatedTime
                        },
                        userId
                    });

                    return {
                        success: false,
                        status: "ambiguous",
                        tasks: resolution.tasks
                    };
                }

                const task = await updateTask(
                    userId,
                    {
                        ...toolArguments,
                        taskId: resolution.task.id
                    }
                );

                return {
                    success: task !== null,
                    task
                };
            }

            return {
                success: false,
                error: "Debes proporcionar un taskId o una referencia de tarea."
            };
        }

        if (toolCall.function.name === "searchTasks") {

            const tasks = await searchTasks(
                userId,
                toolArguments.query
            );

            return {
                success: true,
                tasks
            };
        }

        throw new Error(
            `Tool no reconocida: ${toolCall.function.name}`
        );

    } catch (error) {

        console.error(
            "Ocurrió un error al ejecutar la operación:",
            error
        );

        return {
            success: false,
            error: "Ocurrió un error al ejecutar la operación."
        };
    }
}