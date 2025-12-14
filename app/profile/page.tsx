"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, CaretLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/types";
import { AppShell } from "@/components/layout/AppShell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { NewThreadDialog } from "@/components/feed/NewThreadDialog";
import { determineAction } from "@/app/actions";

export default function ProfilePage() {
    const [isClientLoaded, setIsClientLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useLocalStorage<UserProfile>("user", {
        name: "Yeshhh",
        username: "soul.stoneee",
        bio: "I am the love I give,\nnot the love I receive.",
        avatar: "/pfp2.JPG",
        followers: 0
    });
    const [editForm, setEditForm] = useState<UserProfile>(user);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsClientLoaded(true);
        if (user) {
            setEditForm(user);
        }
    }, [user]);

    const handleSave = () => {
        setUser(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(user);
        setIsEditing(false);
    };

    const handleAction = async (text: string) => {
        // We only keep this to make the Compose button in AppShell work if clicked,
        // though strictly the user is focused on profile. logic placeholder.
        if (!text.trim()) return;
        setIsComposeOpen(false);
        // Core Todo component handles the actual data in localStorage, this is just a dummy handler 
        // essentially since we are on the profile page. Ideally AppShell might not even show compose here
        // but for consistency we keep the shell.
    };

    if (!isClientLoaded) return null;

    return (
        <AppShell onComposeClick={() => setIsComposeOpen(true)}>
            <div className="bg-zinc-900/40 rounded-t-[32px] border-x border-t border-white/5 min-h-screen mt-2 pb-24 overflow-hidden">
                {/* Page Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0 sticky top-0 bg-background/80 backdrop-blur-md z-10">
                    <div className="w-8" />
                    <span className="text-base font-bold">Profile</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full border border-current">
                            <div className="text-[10px]">...</div>
                        </div>
                    </Button>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex-1 mr-4">
                            {isEditing ? (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground font-medium ml-1">Name</label>
                                        <Input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="bg-muted/30 border-muted-foreground/20 h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground font-medium ml-1">Username</label>
                                        <Input
                                            value={editForm.username}
                                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                            className="bg-muted/30 border-muted-foreground/20 h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground font-medium ml-1">Bio</label>
                                        <Textarea
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            className="bg-muted/30 border-muted-foreground/20 resize-none min-h-[100px] text-base"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-2">
                                    <h2 className="text-3xl font-bold leading-tight tracking-tight">{user.name}</h2>
                                    <p className="text-[16px] text-muted-foreground mt-1 font-medium">{user.username}</p>

                                    <div className="mt-6 text-[16px] whitespace-pre-wrap leading-relaxed text-foreground/90">
                                        {user.bio}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted shrink-0 border border-border/50 shadow-sm">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Edit Actions */}
                    {isEditing ? (
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl h-11 border-border/60 text-[15px]"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 rounded-xl h-11 font-semibold text-[15px]"
                                onClick={handleSave}
                            >
                                Save profile
                            </Button>
                        </div>
                    ) : (
                        <div className="pt-4">
                            <Button
                                variant="outline"
                                className="w-full rounded-xl h-11 border-border/60 font-semibold text-[15px] hover:bg-muted/30 transition-colors"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit profile
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <NewThreadDialog
                open={isComposeOpen}
                onOpenChange={setIsComposeOpen}
                onPost={handleAction}
                isLoading={isLoading}
            />
        </AppShell>
    );
}
