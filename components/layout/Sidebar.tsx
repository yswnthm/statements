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
        <aside className={cn("fixed left-0 top-0 h-full w-[72px] flex flex-col items-center py-4 z-50 bg-background border-r border-border/40 hidden md:flex", className)}>
            {/* Logo */}
            <div className="mb-8">
                <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-xl">
                    a
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 flex flex-col justify-center gap-2 w-full px-2">
                <SidebarItem icon={House} label="Home" active />
                <SidebarItem icon={MagnifyingGlass} label="Search" />

                <Button
                    variant="ghost"
                    className="w-full justify-center h-12 rounded-xl group px-0"
                    onClick={onComposeClick}
                >
                    <div className="w-7 h-7 border-2 border-muted-foreground/30 rounded-lg flex items-center justify-center group-hover:border-foreground transition-colors">
                        <Plus weight="bold" className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground" />
                    </div>
                </Button>

                <SidebarItem icon={Heart} label="Activity" />
                <SidebarItem icon={User} label="Profile" />
            </div>

            {/* Bottom Menu */}
            <div className="mt-auto pb-4">
                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-muted/50">
                    <List className="w-7 h-7" />
                </Button>
            </div>
        </aside>
    );
}

function SidebarItem({ icon: Icon, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-center h-12 rounded-xl group transition-all px-0",
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
        </Button>
    )
}
