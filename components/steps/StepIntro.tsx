"use client";

import type { Dilemma } from "@/lib/types";

const STAKE_COLORS = {
  low: "text-slate-400 border-slate-600",
  medium: "text-yellow-400 border-yellow-800",
  high: "text-orange-400 border-orange-900",
  critical: "text-red-400 border-red-900",
};

interface Props {
  dilemma: Dilemma;
  onContinue: () => void;
}

export function StepIntro({ dilemma, onContinue }: Props) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono px-2 py-0.5 border rounded ${STAKE_COLORS[dilemma.stakes]}`}>
            {dilemma.stakes} stakes
          </span>
          <span className="text-xs font-mono text-muted/50">{dilemma.category}</span>
        </div>
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          {dilemma.title}
        </h2>
      </div>

      <div className="bg-panel border border-border rounded-xl p-6 relative overflow-hidden">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <p className="text-slate-300 leading-relaxed text-base">
          {dilemma.scenario}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-mono text-muted">the two options:</p>
        <div className="grid grid-cols-1 gap-3">
          {dilemma.options.map((opt, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-lg p-4 flex gap-3"
            >
              <span className="text-xs font-mono text-accent/70 mt-0.5 shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-slate-300">{opt}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-accent hover:bg-accent-dim text-white py-3 rounded-lg font-medium transition-colors glow-accent"
      >
        I've read it — make my choice
      </button>
    </div>
  );
}
