
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, PencilSimple, Check, Smiley, Clock, CaretRight } from "@phosphor-icons/react";
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

    if (todos.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground pl-4 uppercase tracking-wider">Log</h3>
            <div className="space-y-1">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className={cn(
                            "group flex items-start px-4 py-3 gap-3 rounded-xl transition-all duration-200",
                            "hover:bg-muted/30",
                            editingTodoId === todo.id && "bg-muted/40",
                            editingTodoId !== todo.id && "cursor-pointer"
                        )}
                        onClick={(e: React.MouseEvent) => {
                            // Logs generally aren't "toggled" like todos, but we might want some click action?
                            // For now, maybe just edit on click or nothing.
                            if (editingTodoId !== todo.id && e.target === e.currentTarget) {
                                // onEdit(todo.id, todo.text, todo.emoji); 
                                // Let's not auto-edit on click, keeps it stable.
                            }
                        }}
                    >
                        {editingTodoId === todo.id ? (
                            <>
                                <div className="flex-1 flex items-center gap-2 py-0.5">
                                    <div className="flex items-center gap-2 rounded-xl bg-background p-1.5 flex-1 ring-1 ring-border shadow-sm">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 rounded-lg hover:bg-muted"
                                                >
                                                    {editEmoji ? (
                                                        <span className="text-base">{editEmoji}</span>
                                                    ) : (
                                                        <Smiley
                                                            className="w-4 h-4 text-muted-foreground"
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
                                            className="flex-1 h-8 py-0 text-base bg-transparent border-0 shadow-none focus-visible:ring-0 px-2 rounded-none placeholder:text-muted-foreground/50"
                                            placeholder="Edit log..."
                                        />

                                        <TimePicker time={editTime} onChange={setEditTime} />
                                    </div>

                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted"
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                cancelEditing();
                                            }}
                                        >
                                            <X className="w-4 h-4" weight="bold" />
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="icon"
                                            className="h-9 w-9 shrink-0 rounded-full shadow-none"
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
                                            <Check className="w-4 h-4" weight="bold" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mt-1.5">
                                    {/* Visual indicator for log, maybe a small dot or time */}
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                </div>
                                <div
                                    className="flex-1 flex items-start min-w-0 cursor-default pt-0.5"
                                >
                                    {todo.emoji && (
                                        <span className="mr-3 text-base flex-shrink-0 leading-normal">
                                            {todo.emoji}
                                        </span>
                                    )}
                                    <div className="flex flex-col min-w-0 gap-0.5">
                                        <span
                                            className={cn(
                                                "text-base leading-normal transition-all duration-200 text-muted-foreground",
                                                todo.text.length > 50 && "text-[15px]"
                                            )}
                                        >
                                            {todo.text}
                                        </span>
                                        {todo.time && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground/70 font-medium">
                                                <Clock className="w-3 h-3" weight="fill" />
                                                <span>{formatTimeDisplay(todo.time)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            onEdit(todo.id, todo.text, todo.emoji);
                                        }}
                                    >
                                        <PencilSimple className="w-4 h-4" weight="bold" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            onDelete(todo.id);
                                        }}
                                    >
                                        <X className="w-4 h-4" weight="bold" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
