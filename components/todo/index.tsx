"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { format } from "date-fns";
import { useMicrophonePermission } from "@/hooks/use-microphone-permission";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { determineAction } from "@/app/actions";
import { TodoItem, SortOption } from "@/types";
import {
  filterTodosByDate,
  sortTodos,
  calculateProgress,
  formatDate,
  serializeTodo,
} from "@/lib/utils/todo";
import { Model } from "@/lib/models";

// custom components
import { TodoSkeleton } from "./TodoSkeleton";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";

// New UI Components
import { AppShell } from "@/components/layout/AppShell";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { ComposeInput } from "@/components/feed/ComposeInput";
import { StatementCard } from "@/components/feed/StatementCard";

import { TodoList } from "./TodoList";

export default function Todo() {
  const [activeTab, setActiveTab] = useState<"logs" | "todos">("logs");
  const [isLoading, setIsLoading] = useState(false);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("todos", []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedModel, setSelectedModel] = useLocalStorage<Model>(
    "selectedModel",
    "statements-default"
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const micPermission = useMicrophonePermission();
  const { isRecording, isProcessingSpeech, startRecording, stopRecording } =
    useSpeechRecognition();

  // Add effect to indicate client-side hydration is complete
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  // Filter and sort todos
  const filteredTodos = isClientLoaded
    ? filterTodosByDate(todos, selectedDate)
    : [];

  const sortedTodos = isClientLoaded ? sortTodos(filteredTodos, "newest") : [];

  const displayTodos = sortedTodos.filter(todo => {
    if (activeTab === "logs") {
      return todo.category === "statement" || todo.timeline === "past" || (!todo.category && !todo.timeline);
    } else {
      return ["task", "reminder", "goal"].includes(todo.category || "") || todo.timeline === "future";
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
            // Auto-switch tab based on category
            if (["task", "reminder", "goal"].includes(action.category || "") || action.timeline === "future") {
              setActiveTab("todos");
            } else {
              setActiveTab("logs");
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
    <AppShell>
      <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pb-24">
        <ComposeInput
          onPost={handleAction}
          isLoading={isLoading}
        />

        <Suspense fallback={<TodoSkeleton />}>
          {!isClientLoaded ? (
            <TodoSkeleton />
          ) : (
            <>
              {activeTab === "logs" ? (
                <div className="">
                  {displayTodos.map((item) => (
                    <StatementCard
                      key={item.id}
                      item={item}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={startEditing}
                    />
                  ))}

                  {displayTodos.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No logs yet.
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-2">
                  <TodoList
                    todos={displayTodos}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={startEditing}
                    editingTodoId={editingTodoId}
                    editText={editText}
                    setEditText={setEditText}
                    handleEditTodo={handleEditTodo}
                    cancelEditing={cancelEditing}
                  />
                  {displayTodos.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No tasks found.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Suspense>
      </div>
    </AppShell>
  );
}

