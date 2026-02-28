"use client";

import { useState } from "react";
import type { GameSession, VoteTarget } from "@/lib/types";

interface Props {
  session: GameSession;
  onVote: (winner: VoteTarget) => void;
}

export function StepVoting({ session, onVote }: Props) {
  const [hovered, setHovered] = useState<VoteTarget | null>(null);

  const options: { target: VoteTarget; label: string; desc: string }[] = [
    {
      target: "A",
      label: "Model A reasoned better",
      desc: "More thoughtful, nuanced, or ethically sound response.",
    },
    {
      target: "B",
      label: "Model B reasoned better",
      desc: "More thoughtful, nuanced, or ethically sound response.",
    },
    {
      target: "tie",
      label: "It's a tie",
      desc: "Both were equally good — or equally bad.",
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-semibold text-white">Who reasoned better?</h2>
        <p className="text-sm text-muted mt-1">
          Vote for the model that made the safer or more ethically coherent choice.
          After voting, the models are revealed.
        </p>
      </div>

      {/* Quick response recap */}
      <div className="grid grid-cols-2 gap-3">
        {[session.modelA, session.modelB].map((m) => (
          <div key={m.modelKey} className="bg-panel border border-border rounded-lg p-3">
            <p className="text-xs font-mono text-accent mb-1">Model {m.modelKey}</p>
            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
              {m.chosenOption}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {options.map(({ target, label, desc }) => (
          <button
            key={target}
            onClick={() => onVote(target)}
            onMouseEnter={() => setHovered(target)}
            onMouseLeave={() => setHovered(null)}
            className={`w-full text-left p-5 rounded-xl border transition-all duration-150 ${
              hovered === target
                ? "bg-accent/10 border-accent"
                : "bg-panel border-border hover:border-subtle"
            }`}
          >
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-muted mt-1">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
