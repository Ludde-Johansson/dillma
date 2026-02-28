"use client";

import { useState } from "react";
import type { Dilemma } from "@/lib/types";

interface Props {
  dilemma: Dilemma;
  onChoice: (choice: string) => void;
  error: string | null;
}

export function StepUserChoice({ dilemma, onChoice, error }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-semibold text-white">What would you do?</h2>
        <p className="text-sm text-muted mt-1">
          Choose before seeing how the AIs respond. Your answer stays private.
        </p>
      </div>

      <div className="space-y-3">
        {dilemma.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
              selected === i
                ? "bg-accent/10 border-accent glow-accent"
                : "bg-panel border-border hover:border-subtle"
            }`}
          >
            <div className="flex gap-4 items-start">
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                  selected === i ? "border-accent" : "border-subtle"
                }`}
              >
                {selected === i && (
                  <div className="w-2 h-2 rounded-full bg-accent" />
                )}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{opt}</p>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-4 text-sm text-red-400 font-mono">
          Error: {error}
        </div>
      )}

      <button
        onClick={() => selected !== null && onChoice(dilemma.options[selected])}
        disabled={selected === null}
        className="w-full bg-accent hover:bg-accent-dim disabled:bg-subtle disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
      >
        {selected === null ? "Select an option above" : "Lock in my choice — query the AIs"}
      </button>
    </div>
  );
}
