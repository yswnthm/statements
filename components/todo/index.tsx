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
import { TodoSkeleton } from "./TodoSkeleton";
import { AppShell } from "@/components/layout/AppShell";
import { ComposeInput } from "@/components/feed/ComposeInput";
import { StatementCard } from "@/components/feed/StatementCard";
import { NewThreadDialog } from "@/components/feed/NewThreadDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DotsThreeCircle } from "@phosphor-icons/react";

type TimelineView = "past" | "current" | "future";

export default function Todo() {
  const [isLoading, setIsLoading] = useState(false);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("todos", []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedModel, setSelectedModel] = useLocalStorage<Model>(
    "selectedModel",
    "statements-default"
  );

  // Active Timeline View state
  const [activeTimeline, setActiveTimeline] = useState<TimelineView>("current");

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

  // Filter based on active timeline
  const displayTodos = sortedTodos.filter(todo => {
    if (activeTimeline === "past") {
      return todo.timeline === "past";
    } else if (activeTimeline === "future") {
      return todo.timeline === "future";
    } else {
      // current (logs)
      return todo.timeline === "current" || !todo.timeline;
    }
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
                  // status logic...
                  if (action.status === "complete") {
                    return { ...todo, completed: true };
                  } else if (action.status === "incomplete") {
                    return { ...todo, completed: false };
                  } else {
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
                    date: action.targetDate ? new Date(action.targetDate) : todo.date,
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
    setTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingTodoId(id);
    setEditText(text);
  };

  return (
    <AppShell onComposeClick={() => setIsComposeOpen(true)}>
      <div className="h-screen max-h-screen flex flex-col overflow-hidden">
        {/* Header with Centered Text Tabs */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-2 border-b border-border">
          <div className="flex items-center justify-between h-14">
            <div className="flex-1 flex justify-center gap-8">
              <button
                onClick={() => setActiveTimeline("past")}
                className={cn(
                  "h-full relative px-2 text-sm transition-colors",
                  activeTimeline === "past" ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                Past
              </button>
              <button
                onClick={() => setActiveTimeline("current")}
                className={cn(
                  "h-full relative px-2 text-sm transition-colors",
                  activeTimeline === "current" ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                Current
              </button>
              <button
                onClick={() => setActiveTimeline("future")}
                className={cn(
                  "h-full relative px-2 text-sm transition-colors",
                  activeTimeline === "future" ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                Future
              </button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                <DotsThreeCircle className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="p-4 border-b border-white/5">
            <ComposeInput
              onPost={handleAction}
              isLoading={isLoading}
              placeholder={
                activeTimeline === "past"
                  ? "What happened?"
                  : activeTimeline === "future"
                    ? "What's planned?"
                    : "What's happening?"
              }
            // Pass active timeline to help with context if needed (not strictly used yet by ComposeInput but logic handles it via determineAction)
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col divide-y divide-border/50">
              {displayTodos.map((item, index) => (
                <StatementCard
                  key={item.id}
                  item={item}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={startEditing}
                  isLast={index === displayTodos.length - 1}
                />
              ))}
              {displayTodos.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  {activeTimeline === "past" && "No past activity recorded."}
                  {activeTimeline === "future" && "No future plans yet."}
                  {activeTimeline === "current" && "No current activity."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewThreadDialog
        open={isComposeOpen}
        onOpenChange={setIsComposeOpen}
        onPost={handleAction}
        isLoading={isLoading}
      />
    </AppShell >
  );
}
