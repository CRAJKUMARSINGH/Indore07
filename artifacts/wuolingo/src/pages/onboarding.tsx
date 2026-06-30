import { useState } from "react";
import { useLocation } from "wouter";
import { useListLanguages, useUpdateMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, BookOpen, Clock, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const GOALS = [
  { id: "casual", label: "Casual — 5 min/day", icon: <Clock size={20} />, xp: 10 },
  { id: "regular", label: "Regular — 10 min/day", icon: <BookOpen size={20} />, xp: 20 },
  { id: "serious", label: "Serious — 15 min/day", icon: <Target size={20} />, xp: 30 },
  { id: "intense", label: "Intense — 30 min/day", icon: <Zap size={20} />, xp: 50 },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: languages, isLoading } = useListLanguages();
  const updateMe = useUpdateMe();

  const handleFinish = async () => {
    const goal = GOALS.find((g) => g.id === selectedGoal);
    await updateMe.mutateAsync({
      data: { currentLanguageId: selectedLang, goals: [selectedGoal] },
    });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    setLocation("/learn");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col items-center justify-center px-4 py-8">
      {/* Progress dots */}
      <div className="flex gap-2 mb-8" aria-label="Onboarding progress">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/40" : "w-2 bg-muted"
            )}
          />
        ))}
      </div>

      <div className="w-full max-w-sm">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center space-y-6 animate-bounce-in">
            <div className="text-6xl font-black text-primary">W</div>
            <h1 className="text-3xl font-black text-foreground">Welcome to Wuolingo</h1>
            <p className="text-muted-foreground text-lg">
              Learn Indian languages through fun, bite-sized lessons. Build habits. Earn XP. Stay on your streak.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["10+", "Languages"],
                ["5 min", "Per lesson"],
                ["Free", "Forever"],
              ].map(([val, lbl]) => (
                <div key={lbl} className="bg-card rounded-xl p-3 border border-border">
                  <div className="text-lg font-black text-primary">{val}</div>
                  <div className="text-xs text-muted-foreground">{lbl}</div>
                </div>
              ))}
            </div>
            <Button
              className="w-full py-6 text-lg font-bold"
              onClick={() => setStep(1)}
              data-testid="button-get-started"
            >
              Get Started <ArrowRight size={20} className="ml-2" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* Step 1: Choose language */}
        {step === 1 && (
          <div className="space-y-5 animate-bounce-in">
            <div>
              <h2 className="text-2xl font-black text-foreground">What do you want to learn?</h2>
              <p className="text-muted-foreground mt-1">Choose your language to begin.</p>
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {languages?.map((lang) => (
                  <button
                    key={lang.id}
                    data-testid={`lang-option-${lang.id}`}
                    onClick={() => setSelectedLang(lang.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                      selectedLang === lang.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl" aria-hidden="true">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{lang.name}</div>
                      <div className="text-sm text-muted-foreground">{lang.nativeName}</div>
                    </div>
                    {selectedLang === lang.id && (
                      <CheckCircle size={20} className="text-primary shrink-0" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
            <Button
              className="w-full py-5 font-bold"
              disabled={!selectedLang}
              onClick={() => setStep(2)}
              data-testid="button-next-step"
            >
              Continue <ArrowRight size={18} className="ml-2" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="space-y-5 animate-bounce-in">
            <div>
              <h2 className="text-2xl font-black text-foreground">Set your daily goal</h2>
              <p className="text-muted-foreground mt-1">Consistency builds fluency.</p>
            </div>
            <div className="space-y-2">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  data-testid={`goal-option-${goal.id}`}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    selectedGoal === goal.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className={cn("p-2 rounded-lg", selectedGoal === goal.id ? "bg-primary text-white" : "bg-muted text-foreground")}>
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-foreground">{goal.label}</div>
                    <div className="text-sm text-muted-foreground">Earn {goal.xp} XP/day goal</div>
                  </div>
                  {selectedGoal === goal.id && (
                    <CheckCircle size={20} className="text-primary shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
            <Button
              className="w-full py-5 font-bold"
              disabled={!selectedGoal || updateMe.isPending}
              onClick={handleFinish}
              data-testid="button-start-learning"
            >
              {updateMe.isPending ? "Saving..." : "Start Learning"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
