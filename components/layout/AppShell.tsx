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

            <main className="flex-1 w-full md:pl-[88px]">
                <div className="max-w-[620px] mx-auto w-full min-h-screen">
                    {children}
                </div>
            </main>

            {/* Right spacer removed for centering */}
            {/* <div className="hidden xl:block w-[350px] p-4">
            </div> */}
        </div>
    );
}
