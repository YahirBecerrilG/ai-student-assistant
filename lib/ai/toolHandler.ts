import type { ChatCompletionMessageToolCall } from "openai/resources/chat/completions";

import { createTask } from "../tasks/createTask";
import { getTasks } from "../tasks/getTasks";
import { getTask } from "../tasks/getTask";
import { updateTask } from "../tasks/updateTask";
import { deleteTask } from "../tasks/deleteTask";

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

            const task = await deleteTask(
                userId,
                toolArguments.taskId
            );

            toolResult = {
                success: task !== null,
                task
            };

        } else if (toolCall.function.name === "updateTask") {

            const task = await updateTask(
                userId,
                toolArguments
            );

            toolResult = {
                success: task !== null,
                task
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