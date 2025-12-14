"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
    // onProfileClick removed in favor of Link
}

export function Sidebar({ className, onComposeClick }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className={cn("fixed left-0 top-0 h-full w-[88px] flex flex-col items-center py-4 z-50 bg-background hidden md:flex", className)}>
            {/* Logo */}
            <div className="mb-8">
                <Link href="/" className="w-16 h-16 flex items-center justify-center text-foreground">
                    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30C23.732 30 30 23.732 30 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2.5" />
                    </svg>
                </Link>
            </div>

            {/* Nav Items */}
            <div className="flex-1 flex flex-col justify-center items-center gap-2 w-full px-2">
                <SidebarItem icon={House} label="Home" active={isActive("/")} href="/" />
                <SidebarItem icon={MagnifyingGlass} label="Search" active={isActive("/search")} href="/search" />

                <Button
                    variant="ghost"
                    className="w-16 h-16 rounded-2xl group px-0 flex items-center justify-center"
                    onClick={onComposeClick}
                >
                    <Plus weight="bold" className="text-muted-foreground group-hover:text-foreground transition-colors" style={{ width: '20px', height: '20px' }} />
                </Button>

                <SidebarItem icon={Heart} label="Activity" active={isActive("/activity")} href="/activity" />
                <SidebarItem icon={User} label="Profile" active={isActive("/profile")} href="/profile" />
            </div>

            {/* Bottom Menu */}
            <div className="mt-auto pb-4 flex justify-center w-full">
                <Button variant="ghost" size="icon" className="w-16 h-16 rounded-2xl hover:bg-muted/50 flex items-center justify-center">
                    <List weight="bold" style={{ width: '20px', height: '20px' }} />
                </Button>
            </div>
        </aside>
    );
}

function SidebarItem({ icon: Icon, active, href }: { icon: any, label: string, active?: boolean, href: string }) {
    return (
        <Link href={href}>
            <Button
                variant="ghost"
                className={cn(
                    "w-16 h-16 rounded-2xl group transition-all px-0 flex items-center justify-center",
                    active ? "bg-muted/30" : "bg-transparent"
                )}
            >
                <Icon
                    weight={active ? "fill" : "bold"}
                    className={cn(
                        "transition-colors",
                        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                    style={{ width: '20px', height: '20px' }}
                />
            </Button>
        </Link>
    )
}
