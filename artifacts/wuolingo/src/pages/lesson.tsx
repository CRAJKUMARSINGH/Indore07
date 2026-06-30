import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import {
  useGetLesson,
  getGetLessonQueryKey,
  useCheckAnswer,
  useCompleteLesson,
  getGetMeQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSpeech } from "@/hooks/use-speech";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Volume2, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function vibrate(pattern: number | number[]) {
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

type AnswerState = "idle" | "correct" | "incorrect";

export default function Lesson() {
  const params = useParams<{ id: string }>();
  const lessonId = parseInt(params.id, 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { speak } = useSpeech();

  const { data: lesson, isLoading } = useGetLesson(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) },
  });

  const checkAnswer = useCheckAnswer();
  const completeLesson = useCompleteLesson();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  // Word order state
  const [wordBank, setWordBank] = useState<string[]>([]);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);

  const exercises = lesson?.exercises ?? [];
  const current = exercises[currentIdx];
  const progressPct = exercises.length ? ((currentIdx) / exercises.length) * 100 : 0;

  // Reset word bank when exercise changes
  useEffect(() => {
    if (current?.type === "word_order") {
      setWordBank([...current.options].sort(() => Math.random() - 0.5));
      setBuiltSentence([]);
    }
    setAnswerState("idle");
    setSelectedOption("");
    setCorrectAnswer("");
  }, [currentIdx, current?.id]);

  const handleMultipleChoice = async (option: string) => {
    if (answerState !== "idle") return;
    setSelectedOption(option);
    try {
      const result = await checkAnswer.mutateAsync({ id: current.id, data: { answer: option } });
      setCorrectAnswer(result.correctAnswer);
      if (result.correct) {
        setAnswerState("correct");
        setScore((s) => s + 1);
        vibrate(200);
      } else {
        setAnswerState("incorrect");
        setShaking(true);
        vibrate([100, 50, 100]);
        setTimeout(() => setShaking(false), 600);
      }
    } catch {
      setAnswerState("idle");
    }
  };

  const handleWordTap = (word: string, fromBank: boolean) => {
    if (answerState !== "idle") return;
    if (fromBank) {
      setWordBank((b) => b.filter((_, i) => b.indexOf(word) !== i ? true : (b.splice(b.indexOf(word), 1), false)).concat([]));
      setBuiltSentence((s) => [...s, word]);
      setWordBank((b) => { const idx = b.indexOf(word); if (idx >= 0) { const nb = [...b]; nb.splice(idx, 1); return nb; } return b; });
    } else {
      setBuiltSentence((s) => { const idx = s.indexOf(word); const ns = [...s]; ns.splice(idx, 1); return ns; });
      setWordBank((b) => [...b, word]);
    }
  };

  const addWord = (word: string, idx: number) => {
    if (answerState !== "idle") return;
    const newBank = [...wordBank];
    newBank.splice(idx, 1);
    setWordBank(newBank);
    setBuiltSentence((s) => [...s, word]);
  };

  const removeWord = (word: string, idx: number) => {
    if (answerState !== "idle") return;
    const newSentence = [...builtSentence];
    newSentence.splice(idx, 1);
    setBuiltSentence(newSentence);
    setWordBank((b) => [...b, word]);
  };

  const handleWordOrderCheck = async () => {
    const answer = builtSentence.join(" ");
    try {
      const result = await checkAnswer.mutateAsync({ id: current.id, data: { answer } });
      setCorrectAnswer(result.correctAnswer);
      if (result.correct) {
        setAnswerState("correct");
        setScore((s) => s + 1);
        vibrate(200);
      } else {
        setAnswerState("incorrect");
        setShaking(true);
        vibrate([100, 50, 100]);
        setTimeout(() => setShaking(false), 600);
      }
    } catch {
      setAnswerState("idle");
    }
  };

  const handleNext = useCallback(async () => {
    if (currentIdx + 1 >= exercises.length) {
      // Lesson complete
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      try {
        await completeLesson.mutateAsync({
          id: lessonId,
          data: { score, timeSpentSeconds: timeSpent },
        });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
      } catch { /* ignore */ }
      setLocation(`/lesson/${lessonId}/complete`);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }, [currentIdx, exercises.length, lessonId, score, startTime, completeLesson, queryClient, setLocation]);

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!lesson || exercises.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center text-muted-foreground">
        <p>Lesson not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => setLocation("/learn")}>Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            aria-label="Exit lesson"
            data-testid="button-exit-lesson"
            onClick={() => setLocation("/learn")}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={22} aria-hidden="true" />
          </button>
          <Progress value={progressPct} className="flex-1 h-3 [&>div]:bg-primary" />
          <span className="text-sm font-bold text-muted-foreground">
            {currentIdx + 1}/{exercises.length}
          </span>
        </div>
      </div>

      {/* Exercise area */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-4">
        <div className={cn("flex-1 space-y-6", shaking && "animate-shake")}>
          {/* Prompt */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {current?.type === "multiple_choice" ? "Select the correct answer" : "Arrange the words"}
            </p>
            <div className="flex items-start gap-3">
              <p className="text-xl font-bold text-foreground flex-1">{current?.prompt}</p>
              {current?.audioHint && (
                <button
                  aria-label="Play audio"
                  data-testid="button-play-audio"
                  onClick={() => speak(current.audioHint!)}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-primary shrink-0"
                >
                  <Volume2 size={20} aria-hidden="true" />
                </button>
              )}
            </div>
            {current?.transliteration && (
              <p className="text-sm text-muted-foreground italic">{current.transliteration}</p>
            )}
          </div>

          {/* Multiple choice options */}
          {current?.type === "multiple_choice" && (
            <div className="grid grid-cols-1 gap-3">
              {current.options.map((option) => {
                let variant: string = "outline-border";
                if (answerState !== "idle" && option === correctAnswer) variant = "correct";
                else if (answerState === "incorrect" && option === selectedOption) variant = "incorrect";

                return (
                  <button
                    key={option}
                    data-testid={`option-${option.replace(/\s+/g, "-")}`}
                    disabled={answerState !== "idle"}
                    onClick={() => handleMultipleChoice(option)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 font-bold text-left text-base transition-all",
                      variant === "correct" && "border-accent bg-accent/10 text-accent animate-bounce-in",
                      variant === "incorrect" && "border-destructive bg-destructive/10 text-destructive",
                      variant === "outline-border" && "border-border bg-card hover:border-primary/60 hover:bg-primary/5 text-foreground"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Word order exercise */}
          {current?.type === "word_order" && (
            <div className="space-y-4">
              {/* Built sentence area */}
              <div className="min-h-16 bg-card border-2 border-dashed border-border rounded-xl p-3 flex flex-wrap gap-2">
                {builtSentence.length === 0 && (
                  <span className="text-muted-foreground text-sm self-center">Tap words to build the sentence</span>
                )}
                {builtSentence.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    data-testid={`built-word-${idx}`}
                    onClick={() => removeWord(word, idx)}
                    disabled={answerState !== "idle"}
                    className={cn(
                      "px-3 py-2 rounded-lg font-bold text-sm border-2 transition-all",
                      answerState === "correct" ? "border-accent bg-accent/10 text-accent" :
                      answerState === "incorrect" ? "border-destructive bg-destructive/10 text-destructive" :
                      "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Word bank */}
              <div className="flex flex-wrap gap-2 justify-center">
                {wordBank.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    data-testid={`bank-word-${idx}`}
                    onClick={() => addWord(word, idx)}
                    disabled={answerState !== "idle"}
                    className="px-3 py-2 rounded-lg font-bold text-sm border-2 border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all text-foreground"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feedback banner + next button */}
        <div className="space-y-3 pt-4">
          {answerState === "correct" && (
            <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 text-accent animate-bounce-in">
              <CheckCircle size={20} aria-hidden="true" />
              <span className="font-bold">Correct!</span>
            </div>
          )}
          {answerState === "incorrect" && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-destructive animate-bounce-in">
              <p className="font-bold text-sm">Correct answer:</p>
              <p className="font-extrabold">{correctAnswer}</p>
            </div>
          )}

          {/* Word order check button */}
          {current?.type === "word_order" && answerState === "idle" && (
            <Button
              className="w-full py-5 font-bold"
              disabled={builtSentence.length === 0 || checkAnswer.isPending}
              onClick={handleWordOrderCheck}
              data-testid="button-check-answer"
            >
              Check Answer
            </Button>
          )}

          {answerState !== "idle" && (
            <Button
              className="w-full py-5 font-bold"
              onClick={handleNext}
              disabled={completeLesson.isPending}
              data-testid="button-continue"
            >
              {currentIdx + 1 >= exercises.length ? "See Results" : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
