"use client";

import { useState, useEffect, Suspense } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { determineAction } from "@/app/actions";
import { TodoItem, SortOption } from "@/types";
import {
    filterTodosByDate,
    sortTodos,
    serializeTodo,
} from "@/lib/utils/todo";
import { Model } from "@/lib/models";

// custom components
import { TodoSkeleton } from "@/components/todo/TodoSkeleton";
import { AppShell } from "@/components/layout/AppShell";
import { ComposeInput } from "@/components/feed/ComposeInput";
import { TodoList } from "@/components/todo/TodoList";
import { NewThreadDialog } from "@/components/feed/NewThreadDialog";

export default function ActivityPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isClientLoaded, setIsClientLoaded] = useState(false);
    const [todos, setTodos] = useLocalStorage<TodoItem[]>("todos", []);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedModel, setSelectedModel] = useLocalStorage<Model>(
        "selectedModel",
        "statements-default"
    );
    // const [sortBy, setSortBy] = useState<SortOption>("newest"); // Unused
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [isComposeOpen, setIsComposeOpen] = useState(false);

    // Add effect to indicate client-side hydration is complete
    useEffect(() => {
        setIsClientLoaded(true);
    }, []);

    // Filter and sort todos
    const filteredTodos = isClientLoaded
        ? filterTodosByDate(todos, selectedDate)
        : [];

    const sortedTodos = isClientLoaded ? sortTodos(filteredTodos, "newest") : [];

    // Filter for Activity (Tasks, Reminders, Goals, Future)
    const displayActivity = sortedTodos.filter(todo => {
        return ["task", "reminder", "goal"].includes(todo.category || "") || todo.timeline === "future";
    });

    const handleAction = async (text: string) => {
        if (!text.trim()) return;

        setIsLoading(true);

        let newTodos = [...todos];

        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const actions = (
                await determineAction(
                    text,
                    filteredTodos,
                    selectedModel,
                    timezone
                )
            ).actions;

            actions.forEach((action) => {
                switch (action.action) {
                    case "add":
                        let todoDate = selectedDate;
                        if (action.targetDate) {
                            todoDate = new Date(action.targetDate);
                        }

                        newTodos.push(
                            serializeTodo({
                                id: Math.random().toString(36).substring(7),
                                text: action.text || text,
                                completed: false,
                                date: todoDate,
                                time: action.time,
                                category: action.category,
                                timeline: action.timeline,
                                createdAt: Date.now(),
                            })
                        );
                        break;

                    case "delete":
                        if (action.todoId) {
                            newTodos = newTodos.filter((todo) => todo.id !== action.todoId);
                        }
                        break;

                    case "mark":
                        if (action.todoId) {
                            newTodos = newTodos.map((todo) => {
                                if (todo.id === action.todoId) {
                                    // If status is provided, set to that specific status
                                    if (action.status === "complete") {
                                        return { ...todo, completed: true };
                                    } else if (action.status === "incomplete") {
                                        return { ...todo, completed: false };
                                    } else {
                                        // If no status provided, toggle the current status
                                        return { ...todo, completed: !todo.completed };
                                    }
                                }
                                return todo;
                            });
                        }
                        break;

                    case "edit":
                        if (action.todoId && action.text) {
                            newTodos = newTodos.map((todo) => {
                                if (todo.id === action.todoId) {
                                    return serializeTodo({
                                        ...todo,
                                        text: action.text || todo.text,
                                        date: action.targetDate
                                            ? new Date(action.targetDate)
                                            : todo.date,
                                        time: action.time || todo.time,
                                        category: action.category || todo.category,
                                        timeline: action.timeline || todo.timeline,
                                    });
                                }
                                return todo;
                            });
                        }
                        break;
                }
            });

            setTodos(newTodos);
        } catch (error) {
            console.error("AI Action failed:", error);
            // Fallback add
            setTodos([
                ...todos,
                serializeTodo({
                    id: Math.random().toString(36).substring(7),
                    text,
                    completed: false,
                    date: selectedDate,
                    createdAt: Date.now(),
                }),
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTodo = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const startEditing = (id: string, text: string) => {
        setEditingTodoId(id);
        setEditText(text);
    };

    const handleEditTodo = (updatedTodo: TodoItem) => {
        setTodos(todos.map(t => t.id === updatedTodo.id ? updatedTodo : t));
        setEditingTodoId(null);
        setEditText("");
    };

    const cancelEditing = () => {
        setEditingTodoId(null);
        setEditText("");
    };

    return (
        <AppShell onComposeClick={() => setIsComposeOpen(true)}>
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-2 border-b border-border mb-4">
                <div className="flex items-center h-14">
                    <h1 className="text-lg font-semibold text-foreground">Activity</h1>
                </div>
            </div>

            <div className="bg-zinc-900/40 rounded-t-[32px] border-x border-t border-white/5 min-h-[calc(100vh-100px)] pb-24 overflow-hidden">
                <div>
                    <ComposeInput
                        onPost={handleAction}
                        isLoading={isLoading}
                        placeholder="Add a new activity..."
                    />
                </div>

                <div>
                    <Suspense fallback={<TodoSkeleton />}>
                        {!isClientLoaded ? (
                            <TodoSkeleton />
                        ) : (
                            <div className="pt-2 px-4">
                                <TodoList
                                    todos={displayActivity}
                                    onToggle={toggleTodo}
                                    onDelete={deleteTodo}
                                    onEdit={startEditing}
                                    editingTodoId={editingTodoId}
                                    editText={editText}
                                    setEditText={setEditText}
                                    handleEditTodo={handleEditTodo}
                                    cancelEditing={cancelEditing}
                                />
                                {displayActivity.length === 0 && (
                                    <div className="p-8 text-center text-muted-foreground">
                                        No activity found.
                                    </div>
                                )}
                            </div>
                        )}
                    </Suspense>
                </div>
            </div>

            <NewThreadDialog
                open={isComposeOpen}
                onOpenChange={setIsComposeOpen}
                onPost={handleAction}
                isLoading={isLoading}
            />
        </AppShell>
    );
}
