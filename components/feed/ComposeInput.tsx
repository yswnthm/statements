"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComposeInputProps {
    onPost: (text: string) => void;
    isLoading?: boolean;
    defaultValue?: string;
}

export function ComposeInput({ onPost, isLoading, defaultValue = "" }: ComposeInputProps) {
    const [text, setText] = useState(defaultValue);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [text]);

    const handlePost = () => {
        if (!text.trim()) return;
        onPost(text);
        setText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handlePost();
        }
    };

    return (
        <div className="flex gap-3 px-4 py-4 border-b border-white/5">
            <div className="flex-shrink-0">
                <div className="w-9 h-9 bg-muted rounded-full overflow-hidden">
                    {/* Placeholder Avatar - replace with actual user avatar if available */}
                    <img src="/pfp2.JPG" alt="User" className="w-full h-full object-cover opacity-80" />
                </div>
            </div>
            <div className="flex-1 flex gap-3 items-start">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's new?"
                    className="flex-1 bg-transparent border-none resize-none outline-none text-[15px] placeholder:text-muted-foreground/60 min-h-[36px] py-2"
                    rows={1}
                    disabled={isLoading}
                />
                <div className="flex-shrink-0">
                    <Button
                        size="sm"
                        onClick={handlePost}
                        disabled={!text.trim() || isLoading}
                        className={cn("rounded-full px-5 h-8 font-semibold", !text.trim() && "opacity-50")}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
}
