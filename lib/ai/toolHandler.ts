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
    
    
    let toolResult;

    try {

    

        if (toolCall.function.name === "createTask") {

            const task = await createTask(
                userId,
                toolArguments
            );

            toolResult = {
                success: true,
                task
            };

        } else if (toolCall.function.name === "getTasks") {

            const tasks = await getTasks(userId);

            toolResult = {
                success: true,
                tasks
            };

        } else if (toolCall.function.name === "getTask") {

            const task = await getTask(
                userId,
                toolArguments.taskId
            );

            toolResult = {
                success: task !== null,
                task
            };

        } else if (toolCall.function.name === "deleteTask") {

            if (toolArguments.taskId !== undefined) {

                const task = await deleteTask(
                    userId,
                    toolArguments.taskId
                );

                toolResult = {
                    success: task !== null,
                    task
                };

            } else if (toolArguments.taskReference !== undefined) {

                const resolution = await resolveTaskReference(
                    userId,
                    toolArguments.taskReference
                );

                if (resolution.status === "not_found") {

                    toolResult = {
                        success: false,
                        status: "not_found",
                        tasks: []
                    };

                } else if (resolution.status === "ambiguous") {

                    toolResult = {
                        success: false,
                        status: "ambiguous",
                        tasks: resolution.tasks
                    };

                } else {

                    setPendingAction({
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

            } else {

                toolResult = {
                    success: false,
                    error: "Debes proporcionar un taskId o una referencia de tarea."
                };
            }
        } else if (toolCall.function.name === "updateTask") {

            const task = await updateTask(
                userId,
                toolArguments
            );

            toolResult = {
                success: task !== null,
                task
            };

        } else if (toolCall.function.name === "searchTasks") {

            const tasks = await searchTasks(
                userId,
                toolArguments.query
            );

            toolResult = {
                success: true,
                tasks
            };
    
        } else {

            throw new Error(
                `Tool no reconocida: ${toolCall.function.name}`
            );
        }
    } catch (error) {
        console.error("okoeyOcurrió un error al ejecutar la operación.:", error);

        return {
            success: false,
            error: "Ocurrió un error al ejecutar la operacion."
        };
    }

    
    return toolResult;
}