import { prisma } from "../prisma";
import { Prisma } from "../../generated/prisma/client";


export type PendingAction =
    | {
        action: "deleteTask";
        taskId: number;
        userId: number;
    }
    | {
        action: "updateTask";
        taskReference: string;
        candidateTaskIds: number[];
        updates: {
            priority?: "high" | "medium" | "low" | "unknown";
            name?: string;
            category?: "exam" | "assignment" | "project" | "study" | "other";
            dateText?: string | null;
            description?: string | null;
            subject?: string | null;
            estimatedTime?: string | null;
        };
        userId: number;
    };

export async function setPendingAction(
    action: PendingAction
): Promise<void> {

    const taskId =
        action.action === "deleteTask"
            ? action.taskId
            : null;

    const taskReference =
        action.action === "updateTask"
            ? action.taskReference
            : null;
    
    const candidateTaskIds =
    action.action === "updateTask"
        ? action.candidateTaskIds
        : undefined;

    const updates =
        action.action === "updateTask"
            ? action.updates
            : undefined;

    await prisma.pendingAction.upsert({
        where: {
            userId: action.userId,
        },

        update: {
            action: action.action,
            taskId,
            taskReference,
            candidateTaskIds:
                candidateTaskIds !== undefined
                    ? candidateTaskIds
                    : Prisma.JsonNull,
            ...(updates !== undefined
                ? { updates }
                : { updates: Prisma.JsonNull }),
        },

        create: {
            userId: action.userId,
            action: action.action,
            taskId,
            taskReference,
            candidateTaskIds:
                candidateTaskIds !== undefined
                    ? candidateTaskIds
                    : Prisma.JsonNull,
            ...(updates !== undefined
                ? { updates }
                : { updates: Prisma.JsonNull }),
        },
        
    });
}

export async function getPendingAction(
    userId: number
): Promise<PendingAction | null> {

    const pending = await prisma.pendingAction.findUnique({
        where: {
            userId,
        },
    });

    if (!pending) {
        return null;
    }

    if (pending.action === "deleteTask") {

        if (pending.taskId === null) {
            return null;
        }

        return {
            action: "deleteTask",
            taskId: pending.taskId,
            userId: pending.userId,
        };
    }

    if (pending.action === "updateTask") {

        if (
            pending.taskReference === null ||
            pending.updates === null ||
            pending.candidateTaskIds === null ||
            !Array.isArray(pending.candidateTaskIds)
        ) {
            return null;
        }

        return {
            action: "updateTask",
            taskReference: pending.taskReference,
            candidateTaskIds: pending.candidateTaskIds as number[],
            updates: pending.updates as {
                priority?: "high" | "medium" | "low" | "unknown";
                name?: string;
                category?: "exam" | "assignment" | "project" | "study" | "other";
                dateText?: string | null;
                description?: string | null;
                subject?: string | null;
                estimatedTime?: string | null;
            },
            userId: pending.userId,
        };
    }

    return null;
}

export async function clearPendingAction(
    userId: number
): Promise<void> {

    await prisma.pendingAction.deleteMany({
        where: {
            userId,
        },
    });
}