import { TodoItem } from ".";
import { Model } from "@/lib/models";

export type DetermineActionResponse = {
    actions: Array<{
        action: "add" | "delete" | "mark" | "sort" | "edit" | "clear";
        text?: string;
        todoId?: string;
        emoji?: string;
        targetDate?: string;
        time?: string; // Optional time in HH:mm format
        sortBy?: "newest" | "oldest" | "alphabetical" | "completed";
        status?: "complete" | "incomplete";
        listToClear?: "all" | "completed" | "incomplete";
        category?: "goal" | "task" | "reminder" | "statement";
        timeline?: "past" | "current" | "future";
    }>;
};

export type DetermineActionFn = (
    text: string,
    emoji?: string,
    todos?: TodoItem[],
    model?: Model,
    timezone?: string
) => Promise<DetermineActionResponse>; 