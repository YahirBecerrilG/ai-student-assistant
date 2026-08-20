export type PendingAction = {
    action: "deleteTask";
    taskId: number;
    userId: number;
};

let pendingAction: PendingAction | null = null;

export function setPendingAction(action: PendingAction) {
    pendingAction = action;
}

export function getPendingAction(): PendingAction | null {
    return pendingAction;
}

export function clearPendingAction() {
    pendingAction = null;
}