
import { Button } from "@/components/ui/button";
import { TodoListProps } from "@/types";
import { useState } from "react";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { TodoList } from "./TodoList";
import { cn } from "@/lib/utils";

export function TodoSection(props: TodoListProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const count = props.todos.filter(t => !t.completed).length;
    const completedCount = props.todos.filter(t => t.completed).length;
    const total = props.todos.length;

    // Logic to determine if we should auto-collapse? Maybe not for now.

    if (total === 0) return null;

    return (
        <div className="space-y-2">
            <div
                className="flex items-center justify-between px-4 py-2 hover:bg-muted/30 rounded-lg cursor-pointer group select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center gap-2">
                    <div className={cn("text-muted-foreground/50 transition-transform duration-200", isCollapsed ? "-rotate-90" : "rotate-0")}>
                        <CaretDown weight="bold" className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">To-Do</h3>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                    {count} / {total}
                </div>
            </div>

            {!isCollapsed && (
                <div className="animate-in slide-in-from-top-1 fade-in duration-200">
                    <TodoList {...props} />
                </div>
            )}
        </div>
    );
}
