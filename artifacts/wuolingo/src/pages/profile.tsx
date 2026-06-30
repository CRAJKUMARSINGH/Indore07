import { useState } from "react";
import { useLocation } from "wouter";
import {
  useGetMe,
  useUpdateMe,
  useListLanguages,
  getGetMeQueryKey,
  getListLessonsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { StreakBadge } from "@/components/streak-badge";
import { XPDisplay } from "@/components/xp-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, CheckCircle, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe();
  const { data: languages } = useListLanguages();
  const updateMe = useUpdateMe();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const handleSaveName = async () => {
    if (!name.trim()) return;
    await updateMe.mutateAsync({ data: { name: name.trim() } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    setEditing(false);
    toast({ title: "Name updated!" });
  };

  const handleLanguageSwitch = async (langId: string) => {
    await updateMe.mutateAsync({ data: { currentLanguageId: langId } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListLessonsQueryKey({ languageId: langId }) });
    toast({ title: "Language switched!" });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            aria-label="Go back"
            onClick={() => setLocation("/")}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            data-testid="button-back"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <h1 className="text-lg font-black text-foreground">Profile</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {isLoading ? (
          <>
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </>
        ) : (
          <>
            {/* User card */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4" data-testid="profile-card">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black">
                  {user?.name?.[0]?.toUpperCase() ?? "L"}
                </div>
                <div className="flex-1">
                  {editing ? (
                    <div className="flex gap-2">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="h-9 text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                        autoFocus
                        data-testid="input-name"
                      />
                      <Button size="sm" onClick={handleSaveName} disabled={updateMe.isPending} data-testid="button-save-name">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-foreground">{user?.name}</span>
                      <button
                        aria-label="Edit name"
                        data-testid="button-edit-name"
                        onClick={() => { setName(user?.name ?? ""); setEditing(true); }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                      >
                        <Edit2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2 mt-1.5">
                    <StreakBadge streak={user?.streak ?? 0} size="sm" />
                    <XPDisplay xp={user?.xp ?? 0} size="sm" />
                  </div>
                </div>
              </div>

              {/* Level */}
              <div className="bg-muted rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-semibold">Level</span>
                <span className="text-lg font-black text-foreground">{user?.level ?? 1}</span>
              </div>
            </div>

            {/* Language picker */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h2 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Active Language</h2>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {languages?.map((lang) => {
                  const isActive = lang.id === user?.currentLanguageId;
                  return (
                    <button
                      key={lang.id}
                      data-testid={`language-option-${lang.id}`}
                      onClick={() => !isActive && handleLanguageSwitch(lang.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                        isActive
                          ? "border-primary bg-primary/5 cursor-default"
                          : "border-border hover:border-primary/50 cursor-pointer"
                      )}
                    >
                      <span className="text-xl" aria-hidden="true">{lang.flag}</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-foreground">{lang.name}</div>
                        <div className="text-xs text-muted-foreground">{lang.nativeName}</div>
                      </div>
                      {isActive && <CheckCircle size={18} className="text-primary shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats summary */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3">Achievements</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Lessons Done", user?.lessonsCompleted ?? 0],
                  ["Longest Streak", `${user?.longestStreak ?? 0} days`],
                  ["Total XP", (user?.xp ?? 0).toLocaleString()],
                  ["Weekly XP", (user?.weeklyXp ?? 0).toLocaleString()],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-muted rounded-xl p-3" data-testid={`achievement-${String(label).toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-base font-black text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
