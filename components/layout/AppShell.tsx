"use client";

import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
    children: React.ReactNode;
    className?: string;
    onComposeClick?: () => void;
}

export function AppShell({ children, className, onComposeClick }: AppShellProps) {
    return (
        <div className={cn("min-h-screen bg-background text-foreground flex", className)}>
            <Sidebar onComposeClick={onComposeClick} />

            <main className="flex-1 w-full md:pl-[72px]">
                <div className="max-w-[620px] mx-auto w-full min-h-screen border-x border-border/40">
                    {children}
                </div>
            </main>

            {/* Right spacer for centering if needed, or right sidebar later */}
            <div className="hidden xl:block w-[350px] p-4">
                {/* Optional Right Sidebar Content */}
            </div>
        </div>
    );
}
