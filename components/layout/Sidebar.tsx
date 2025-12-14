"use client";

import {
    House,
    MagnifyingGlass,
    Plus,
    Heart,
    User,
    List
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
    className?: string;
    onComposeClick?: () => void;
}

export function Sidebar({ className, onComposeClick }: SidebarProps) {
    return (
        <aside className={cn("fixed left-0 top-0 h-full w-[72px] md:w-[244px] flex flex-col items-center md:items-start py-4 px-2 md:px-6 z-50 bg-background border-r border-border/40 hidden md:flex", className)}>
            {/* Logo */}
            <div className="mb-8 p-2 md:p-0">
                <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-xl">
                    a
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 flex flex-col gap-2 w-full">
                <SidebarItem icon={House} label="Home" active />
                <SidebarItem icon={MagnifyingGlass} label="Search" />

                {/* Mobile/Tablet style Create Button in nav for consistency if needed, 
                    but usually this is a special button or just in the flow. 
                    The reference has it as a distinct block often, but let's keep it simple first. */}
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 px-2 hover:bg-muted/50 h-12 rounded-xl group"
                    onClick={onComposeClick}
                >
                    <div className="w-6 h-6 border-2 border-muted-foreground/30 rounded-lg flex items-center justify-center group-hover:border-foreground transition-colors">
                        <Plus weight="bold" className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground" />
                    </div>
                    <span className="hidden md:inline text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">Create</span>
                </Button>

                <SidebarItem icon={Heart} label="Activity" />
                <SidebarItem icon={User} label="Profile" />
            </div>

            {/* Bottom Menu */}
            <div className="mt-auto">
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full md:w-auto md:h-auto md:px-4 md:py-2 md:justify-start md:rounded-xl hover:bg-muted/50">
                    <List className="w-6 h-6" />
                    <span className="hidden md:inline ml-4 text-base font-medium">More</span>
                </Button>
            </div>
        </aside>
    );
}

function SidebarItem({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-center md:justify-start gap-4 px-2 hover:bg-muted/50 h-12 rounded-xl group transition-all",
                active ? "bg-muted/30" : "bg-transparent"
            )}
        >
            <Icon
                weight={active ? "fill" : "regular"}
                className={cn(
                    "w-7 h-7 transition-colors",
                    active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
            />
            <span className={cn(
                "hidden md:inline text-base font-medium transition-colors",
                active ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"
            )}>
                {label}
            </span>
        </Button>
    )
}
