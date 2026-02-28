"use client";

import { useState, useCallback } from "react";
import type { Dilemma, GameSession, GameStep, VoteTarget } from "@/lib/types";
import { StepIntro } from "./steps/StepIntro";
import { StepUserChoice } from "./steps/StepUserChoice";
import { StepLoading } from "./steps/StepLoading";
import { StepResponses } from "./steps/StepResponses";
import { StepVoting } from "./steps/StepVoting";
import { StepReveal } from "./steps/StepReveal";

interface Props {
  initialDilemma: Dilemma;
}

export function GameShell({ initialDilemma }: Props) {
  const [step, setStep] = useState<GameStep>("intro");
  const [dilemma, setDilemma] = useState<Dilemma>(initialDilemma);
  const [userChoice, setUserChoice] = useState<string>("");
  const [session, setSession] = useState<GameSession | null>(null);
  const [vote, setVote] = useState<VoteTarget | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleUserChoice = useCallback(
    async (choice: string) => {
      setUserChoice(choice);
      setStep("loading");
      setLoadError(null);

      try {
        const res = await fetch("/api/query-models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dilemmaId: dilemma.id }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail ?? err.error ?? "Query failed");
        }

        const data = await res.json();
        setSession({
          dilemma,
          userChoice: choice,
          modelA: data.modelA,
          modelB: data.modelB,
          modelAId: data.modelAId,
          modelBId: data.modelBId,
        });
        setStep("responses");
      } catch (err) {
        setLoadError(String(err));
        setStep("user-choice"); // go back so they can retry
      }
    },
    [dilemma]
  );

  const handleVote = useCallback(
    async (winner: VoteTarget) => {
      if (!session) return;
      setVote(winner);

      try {
        await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dilemmaId: dilemma.id,
            winner,
            modelAId: session.modelAId,
            modelBId: session.modelBId,
          }),
        });
      } catch {
        // non-critical — vote still shown locally
      }

      setStep("reveal");
    },
    [session, dilemma.id]
  );

  const handlePlayAgain = useCallback(async () => {
    try {
      const res = await fetch(`/api/dilemma?exclude=${dilemma.id}`);
      const next: Dilemma = await res.json();
      setDilemma(next);
    } catch {
      // keep same dilemma if fetch fails
    }

    setStep("intro");
    setUserChoice("");
    setSession(null);
    setVote(null);
    setLoadError(null);
  }, [dilemma.id]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-3xl space-y-6">
        {/* Progress indicator */}
        <StepIndicator step={step} />

        {step === "intro" && (
          <StepIntro dilemma={dilemma} onContinue={() => setStep("user-choice")} />
        )}
        {step === "user-choice" && (
          <StepUserChoice
            dilemma={dilemma}
            onChoice={handleUserChoice}
            error={loadError}
          />
        )}
        {step === "loading" && <StepLoading />}
        {step === "responses" && session && (
          <StepResponses session={session} onContinue={() => setStep("voting")} />
        )}
        {step === "voting" && session && (
          <StepVoting session={session} onVote={handleVote} />
        )}
        {step === "reveal" && session && vote && (
          <StepReveal session={session} vote={vote} onPlayAgain={handlePlayAgain} />
        )}
      </div>
    </div>
  );
}

const STEPS: GameStep[] = [
  "intro",
  "user-choice",
  "loading",
  "responses",
  "voting",
  "reveal",
];

const STEP_LABELS: Record<GameStep, string> = {
  intro: "scenario",
  "user-choice": "your choice",
  loading: "querying",
  responses: "responses",
  voting: "vote",
  reveal: "reveal",
};

function StepIndicator({ step }: { step: GameStep }) {
  const visibleSteps = STEPS.filter((s) => s !== "loading");
  const currentIndex = visibleSteps.indexOf(step === "loading" ? "responses" : step);

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted">
      {visibleSteps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span
            className={
              i <= currentIndex ? "text-accent" : "text-muted/30"
            }
          >
            {STEP_LABELS[s]}
          </span>
          {i < visibleSteps.length - 1 && (
            <span className="text-muted/20">·</span>
          )}
        </div>
      ))}
    </div>
  );
}
