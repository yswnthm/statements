"use client";

import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
    children: React.ReactNode;
    className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
    return (
        <div className={cn("min-h-screen bg-background text-foreground flex", className)}>
            <Sidebar />

            <main className="flex-1 w-full md:pl-[72px] lg:pl-[244px]">
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
