"use client";

import { TodoItem } from "@/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
    Heart,
    ChatCircle,
    Repeat,
    PaperPlaneTilt,
    Check,
    Trash,
    PencilSimple,
    DotsThree
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface StatementCardProps {
    item: TodoItem;
    onToggle?: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string, text: string) => void;
    isLast?: boolean;
}

export function StatementCard({ item, onToggle, onDelete, onEdit, isLast }: StatementCardProps) {
    const isCompleted = item.completed;
    const isTodo = !item.completed && ["task", "reminder", "goal"].includes(item.category || "") || item.timeline === "future"; // Reuse logic or pass it down

    return (
        <div className={cn(
            "flex gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group animate-in fade-in duration-300 relative",
            isCompleted && "opacity-60"
        )}>
            {/* Avatar Column */}
            <div className="flex-shrink-0 relative flex flex-col items-center">
                {/* Line going UP to previous? If we render per item. */}
                {/* We just need a line going DOWN from this avatar to the next.
                    Or a full height line passing through.
                    Typical thread implementation:
                    Line from top to bottom of the 'left rail'.
                */}
                <div className={cn(
                    "absolute top-0 bottom-0 w-[1.5px] bg-[#222]",
                    isLast ? "bottom-auto h-5" : ""
                )} style={{ left: '50%', transform: 'translateX(-50%)' }}></div>

                <div className="w-9 h-9 bg-muted rounded-full overflow-hidden relative z-10 box-content border-4 border-[#18181b]">
                    {/* border-4 border-[#18181b] helps mask the line behind the avatar, matching the card bg which is approx zinc-900 (18181b is zinc-900) */}
                    <img src="/pfp2.JPG" alt="User" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="font-semibold text-[15px] truncate">yeswanth</span>
                        <span className="text-muted-foreground text-[14px] truncate">
                            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                        </span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground -mr-2">
                                <DotsThree weight="bold" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(item.id, item.text)}>
                                    <PencilSimple className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive focus:text-destructive">
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Body */}
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words text-foreground/90 mb-3">
                    {item.text}
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center gap-6 -ml-2">
                    {/* "Like" / Complete button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "group/btn relative h-9 w-9 rounded-full hover:bg-transparent transition-colors",
                            isCompleted ? "text-green-500" : "text-muted-foreground"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle?.(item.id);
                        }}
                    >
                        {isCompleted ? (
                            <div className="p-1.5 bg-green-500/10 rounded-full">
                                <Check weight="bold" className="w-5 h-5 text-green-600" />
                            </div>
                        ) : (
                            <Heart className="w-5 h-5 group-hover/btn:text-red-500 transition-colors" />
                        )}
                        {/* Count could go here */}
                    </Button>

                    <Button variant="ghost" size="icon" className="group/btn h-9 w-9 rounded-full hover:bg-transparent text-muted-foreground">
                        <ChatCircle className="w-5 h-5 group-hover/btn:text-foreground transition-colors" />
                    </Button>

                    <Button variant="ghost" size="icon" className="group/btn h-9 w-9 rounded-full hover:bg-transparent text-muted-foreground">
                        <Repeat className="w-5 h-5 group-hover/btn:text-foreground transition-colors" />
                    </Button>

                    <Button variant="ghost" size="icon" className="group/btn h-9 w-9 rounded-full hover:bg-transparent text-muted-foreground">
                        <PaperPlaneTilt className="w-5 h-5 group-hover/btn:text-foreground transition-colors" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
