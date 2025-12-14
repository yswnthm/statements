import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, PencilSimple, Check, Clock } from "@phosphor-icons/react";
import { CircleCheckbox } from "./CircleCheckbox";
import { TodoListProps } from "@/types";
import { useRef, useCallback, useState, useEffect } from "react";
import { TimePicker, formatTimeDisplay } from "./TimePicker";

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  editingTodoId,
  editText,
  setEditText,
  handleEditTodo,
  cancelEditing,
}: TodoListProps) {
  // Create a reference for the edit input
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [editTime, setEditTime] = useState<string>("");

  // Effect to detect mobile screens
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Create a memoized handler for input changes
  const handleEditInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const newValue = input.value;
      const newPosition = input.selectionStart;

      setEditText(newValue);
      // Schedule cursor position update after state change
      requestAnimationFrame(() => {
        if (input && newPosition !== null) {
          input.setSelectionRange(newPosition, newPosition);
        }
      });
    },
    [setEditText]
  );

  // Initialize edit time when starting to edit
  useEffect(() => {
    if (editingTodoId) {
      const todo = todos.find((t) => t.id === editingTodoId);
      setEditTime(todo?.time || "");
    }
  }, [editingTodoId, todos]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <>
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={cn(
            "group flex items-start px-4 py-1 gap-2 rounded-lg transition-all duration-200",
            todo.completed ? "opacity-50" : "hover:bg-muted/40",
            editingTodoId === todo.id && "bg-muted/40",
            editingTodoId !== todo.id && "cursor-pointer"
          )}
          onClick={(e: React.MouseEvent) => {
            if (editingTodoId !== todo.id && e.target === e.currentTarget) {
              onToggle(todo.id);
            }
          }}
        >
          {editingTodoId === todo.id ? (
            <>
              <div className="flex-1 flex items-center gap-2 py-0.5">
                <div className="flex items-center gap-2 rounded-lg bg-background p-1 flex-1 ring-1 ring-border shadow-sm h-8">

                  <Input
                    ref={editInputRef}
                    value={editText}
                    onChange={handleEditInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditTodo({
                          ...todo,
                          text: editText,
                          time: editTime,
                        });
                      } else if (e.key === "Escape") {
                        cancelEditing();
                      }
                    }}
                    autoFocus
                    className="flex-1 h-6 py-0 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-1.5 rounded-none placeholder:text-muted-foreground/50"
                    placeholder="Edit todo..."
                  />

                  <TimePicker time={editTime} onChange={setEditTime} />
                </div>

                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      cancelEditing();
                    }}
                  >
                    <X className="w-3.5 h-3.5" weight="bold" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-7 w-7 shrink-0 rounded-full shadow-none"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      const updatedTodo = {
                        ...todo,
                        text: editText,
                        time: editTime,
                      };
                      handleEditTodo(updatedTodo);
                    }}
                  >
                    <Check className="w-3.5 h-3.5" weight="bold" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div onClick={(e: React.MouseEvent) => e.stopPropagation()} className="mt-1">
                <CircleCheckbox
                  checked={todo.completed}
                  onCheckedChange={() => onToggle(todo.id)}
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    todo.completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 hover:border-muted-foreground/60"
                  )}
                />
              </div>
              <div
                className="flex-1 flex items-center min-w-0 cursor-pointer pt-0.5"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onToggle(todo.id);
                }}
              >
                <div className="flex items-center min-w-0 gap-2 flex-1">
                  <span
                    className={cn(
                      "text-sm leading-normal transition-colors duration-200 text-muted-foreground/80 group-hover:text-muted-foreground",
                      todo.text.length > 50 && "truncate",
                      todo.completed && "line-through text-muted-foreground/60"
                    )}
                  >
                    {todo.text}
                  </span>
                  {todo.time && (
                    <span className="text-[10px] text-muted-foreground/40 font-medium">
                      {formatTimeDisplay(todo.time)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground/50 hover:text-foreground rounded"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onEdit(todo.id, todo.text);
                  }}
                >
                  <PencilSimple className="w-3 h-3" weight="bold" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground/50 hover:text-destructive rounded"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onDelete(todo.id);
                  }}
                >
                  <X className="w-3 h-3" weight="bold" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
}
