
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, PencilSimple, Check, Smiley, Clock, CaretRight, CaretDown } from "@phosphor-icons/react";
import { TodoListProps } from "@/types";
import { useRef, useCallback, useState, useEffect } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    EmojiPicker,
    EmojiPickerContent,
    EmojiPickerFooter,
    EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { TimePicker, formatTimeDisplay } from "./TimePicker";

export function LogSection({
    todos,
    onToggle, // Not used for logs but keeping interface consistent for now
    onDelete,
    onEdit,
    editingTodoId,
    editText,
    editEmoji,
    setEditText,
    setEditEmoji,
    handleEditTodo,
    cancelEditing,
}: TodoListProps) {
    const editInputRef = useRef<HTMLInputElement>(null);
    const [editTime, setEditTime] = useState<string>("");

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

    const [isCollapsed, setIsCollapsed] = useState(false);

    if (todos.length === 0) return null;

    return (
        <div className="space-y-1 pt-4">
            <div
                className="flex items-center gap-2 px-4 py-1 cursor-pointer group select-none opacity-50 hover:opacity-100 transition-opacity"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className={cn("text-muted-foreground transition-transform duration-200", isCollapsed ? "-rotate-90" : "rotate-0")}>
                    <CaretDown weight="bold" className="w-3 h-3" />
                </div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Log</h3>
                <span className="text-[10px] text-muted-foreground/60 font-medium ml-auto">{todos.length}</span>
            </div>

            {!isCollapsed && (
                <div className="space-y-0.5 animate-in slide-in-from-top-1 fade-in duration-200">
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            className={cn(
                                "group flex items-center px-4 py-1 gap-2 rounded-lg transition-all duration-200",
                                "hover:bg-muted/40",
                                editingTodoId === todo.id && "bg-muted/40",
                                editingTodoId !== todo.id && "cursor-pointer"
                            )}
                            onClick={(e: React.MouseEvent) => {
                                if (editingTodoId !== todo.id && e.target === e.currentTarget) {
                                    // optional: edit on click
                                }
                            }}
                        >
                            {editingTodoId === todo.id ? (
                                <>
                                    <div className="flex-1 flex items-center gap-2 py-0.5">
                                        <div className="flex items-center gap-1.5 rounded-lg bg-background p-1 flex-1 ring-1 ring-border shadow-sm h-8">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 shrink-0 rounded hover:bg-muted"
                                                    >
                                                        {editEmoji ? (
                                                            <span className="text-sm">{editEmoji}</span>
                                                        ) : (
                                                            <Smiley
                                                                className="w-3.5 h-3.5 text-muted-foreground"
                                                                weight="fill"
                                                            />
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-[280px] p-0 rounded-xl"
                                                    side="top"
                                                    align="start"
                                                    sideOffset={12}
                                                >
                                                    <div className="flex h-[300px] w-full items-center justify-center p-0">
                                                        <EmojiPicker
                                                            onEmojiSelect={(emoji: any) => {
                                                                setEditEmoji(emoji.emoji);
                                                            }}
                                                            className="h-full"
                                                        >
                                                            <EmojiPickerSearch placeholder="Search emoji..." />
                                                            <EmojiPickerContent className="h-[220px]" />
                                                            <EmojiPickerFooter className="border-t-0 p-1.5" />
                                                        </EmojiPicker>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>

                                            <Input
                                                ref={editInputRef}
                                                value={editText}
                                                onChange={handleEditInputChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleEditTodo({
                                                            ...todo,
                                                            text: editText,
                                                            emoji: editEmoji,
                                                            time: editTime,
                                                        });
                                                    } else if (e.key === "Escape") {
                                                        cancelEditing();
                                                    }
                                                }}
                                                autoFocus
                                                className="flex-1 h-6 py-0 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-1.5 rounded-none placeholder:text-muted-foreground/50"
                                                placeholder="Edit log..."
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
                                                        emoji: editEmoji,
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
                                    <div
                                        className="flex-1 flex items-center min-w-0 cursor-default"
                                    >
                                        {todo.emoji && (
                                            <span className="mr-2 text-sm flex-shrink-0 leading-none text-muted-foreground/80 opacity-70 group-hover:opacity-100 transition-opacity">
                                                {todo.emoji}
                                            </span>
                                        )}
                                        <div className="flex items-center min-w-0 gap-2 flex-1">
                                            <span
                                                className={cn(
                                                    "text-sm leading-normal transition-colors duration-200 text-muted-foreground/60 group-hover:text-muted-foreground",
                                                    todo.text.length > 50 && "truncate"
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
                                                onEdit(todo.id, todo.text, todo.emoji);
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
                </div>
            )}
        </div>
    );
}
