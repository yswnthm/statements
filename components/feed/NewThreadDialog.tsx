"use client";

import * as React from "react";
import {
    Image as ImageIcon,
    Gif,
    ChartBar,
    Hash,
    MapPin,
    GlobeHemisphereWest,
    DotsThreeCircle,
    Copy
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserProfile } from "@/types";

interface NewThreadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPost: (text: string) => void;
    isLoading?: boolean;
}

export function NewThreadDialog({
    open,
    onOpenChange,
    onPost,
    isLoading
}: NewThreadDialogProps) {
    const [text, setText] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [user] = useLocalStorage<UserProfile>("user", {
        name: "Yeshhh",
        username: "soul.stoneee",
        bio: "I am the love I give,\nnot the love I receive.",
        avatar: "/pfp2.JPG",
        followers: 0
    });

    // Reset text when dialog opens
    React.useEffect(() => {
        if (open) {
            setText("");
            // Focus textarea after a short delay to allow animation to start
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [open]);

    // Auto-resize textarea
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [text]);

    const handlePost = () => {
        if (!text.trim()) return;
        onPost(text);
        onOpenChange(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handlePost();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[600px] p-0 gap-0 bg-background border border-border/50 shadow-2xl"
                showCloseButton={false}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground -ml-2 h-8"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <DialogTitle className="text-base font-bold">New thread</DialogTitle>
                    <div className="flex gap-1 -mr-2">
                        {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Copy className="w-5 h-5" />
                        </Button> */}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <DotsThreeCircle className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 flex gap-3 min-h-[200px]">
                    {/* Avatar Column */}
                    <div className="pt-1 flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted relative">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Thread line connector (visual only for now) */}
                        <div className="w-[2px] flex-1 bg-border/40 my-1 rounded-full min-h-[50px] opacity-50" />
                        <div className="w-4 h-4 rounded-full overflow-hidden bg-muted opacity-50">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover grayscale" />
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-[15px]">{user.username}</span>
                            <span className="text-muted-foreground/60 text-[15px]">&gt;</span>
                            <button className="text-muted-foreground/60 hover:text-muted-foreground text-[15px] transition-colors">Add a topic</button>
                        </div>

                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="What's new?"
                            className="w-full bg-transparent border-none resize-none outline-none text-[15px] placeholder:text-muted-foreground/60 min-h-[60px] max-h-[400px] py-1"
                            disabled={isLoading}
                        />

                        {/* Attachment Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/70 hover:text-foreground -ml-2">
                                <ImageIcon className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/70 hover:text-foreground">
                                <Gif className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/70 hover:text-foreground">
                                <Hash className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/70 hover:text-foreground">
                                <ChartBar className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/70 hover:text-foreground">
                                <MapPin className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2 h-8 gap-2 px-2">
                        <span className="text-muted-foreground/50">Anyote can reply</span>
                    </Button>

                    <Button
                        onClick={handlePost}
                        disabled={!text.trim() || isLoading}
                        className="rounded-full px-6 font-semibold"
                    >
                        Post
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
