"use client";

import Link from "next/link";
import type { GameSession, VoteTarget } from "@/lib/types";

const MODEL_DISPLAY: Record<"claude" | "gpt", { name: string; color: string; bg: string; border: string }> = {
  claude: {
    name: "Claude (Anthropic)",
    color: "text-orange-400",
    bg: "bg-orange-950/30",
    border: "border-orange-800/40",
  },
  gpt: {
    name: "GPT (OpenAI)",
    color: "text-green-400",
    bg: "bg-green-950/30",
    border: "border-green-800/40",
  },
};

interface Props {
  session: GameSession;
  vote: VoteTarget;
  onPlayAgain: () => void;
}

export function StepReveal({ session, vote, onPlayAgain }: Props) {
  const { modelA, modelB, modelAId, modelBId } = session;

  const winnerModel =
    vote === "A" ? modelAId : vote === "B" ? modelBId : null;
  const winnerLabel = vote === "tie" ? "Tie" : `Model ${vote}`;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Vote result banner */}
      <div className="bg-panel border border-border rounded-xl p-5 space-y-2 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <p className="text-xs font-mono text-muted uppercase tracking-widest">
          You voted
        </p>
        <p className="text-xl font-semibold text-white">
          {winnerLabel}{" "}
          {winnerModel && (
            <span className={MODEL_DISPLAY[winnerModel].color}>
              → {MODEL_DISPLAY[winnerModel].name}
            </span>
          )}
          {vote === "tie" && <span className="text-slate-400"> — it's a draw</span>}
        </p>
      </div>

      {/* Model reveal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "A", modelId: modelAId, response: modelA },
          { label: "B", modelId: modelBId, response: modelB },
        ].map(({ label, modelId, response }) => {
          const display = MODEL_DISPLAY[modelId];
          const isWinner = vote === label;
          return (
            <div
              key={label}
              className={`rounded-xl border p-5 space-y-3 ${display.bg} ${display.border} ${
                isWinner ? "ring-1 ring-accent/30" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-mono text-muted">Model {label} was</p>
                  <p className={`text-base font-semibold ${display.color}`}>
                    {display.name}
                  </p>
                </div>
                {isWinner && (
                  <span className="text-xs font-mono text-accent border border-accent/30 px-2 py-0.5 rounded">
                    your pick
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                {response.chosenOption}
              </p>
            </div>
          );
        })}
      </div>

      {/* Your choice */}
      <div className="bg-surface border border-border/50 rounded-lg p-4 flex gap-3">
        <span className="text-xs font-mono text-muted/50 shrink-0 mt-0.5">you chose</span>
        <p className="text-xs text-slate-400 leading-relaxed">{session.userChoice}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 bg-accent hover:bg-accent-dim text-white py-3 rounded-lg font-medium transition-colors"
        >
          Next dilemma
        </button>
        <Link
          href="/leaderboard"
          className="flex-1 text-center border border-border hover:border-subtle text-slate-300 hover:text-white py-3 rounded-lg font-medium transition-colors"
        >
          View leaderboard
        </Link>
      </div>
    </div>
  );
}
