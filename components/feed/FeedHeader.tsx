"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DotsThreeCircle } from "@phosphor-icons/react";

interface FeedHeaderProps {
    className?: string;
    activeTab: "logs" | "todos";
    onTabChange: (tab: "logs" | "todos") => void;
}

export function FeedHeader({ className, activeTab, onTabChange }: FeedHeaderProps) {
    return (
        <div className={cn("sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-2", className)}>
            <div className="flex items-center justify-between h-14">
                <div className="flex-1 flex justify-center gap-8">
                    <button
                        onClick={() => onTabChange("logs")}
                        className={cn(
                            "h-full relative px-2 text-sm transition-colors",
                            activeTab === "logs" ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Logs
                        {activeTab === "logs" && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => onTabChange("todos")}
                        className={cn(
                            "h-full relative px-2 text-sm transition-colors",
                            activeTab === "todos" ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                        )}
                    >
                        To-Do
                        {activeTab === "todos" && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground rounded-full" />
                        )}
                    </button>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                        <DotsThreeCircle className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
