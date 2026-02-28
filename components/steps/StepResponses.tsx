"use client";

import type { GameSession } from "@/lib/types";

interface Props {
  session: GameSession;
  onContinue: () => void;
}

export function StepResponses({ session, onContinue }: Props) {
  const { modelA, modelB, userChoice } = session;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-semibold text-white">Their responses</h2>
        <p className="text-sm text-muted mt-1">
          Read both carefully. The identities are hidden.
        </p>
      </div>

      {/* User's choice reminder */}
      <div className="bg-surface border border-border/60 rounded-lg px-4 py-3 flex gap-3 items-start">
        <span className="text-xs font-mono text-muted/50 mt-0.5 shrink-0">you chose</span>
        <p className="text-xs text-slate-400 leading-relaxed">{userChoice}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[modelA, modelB].map((model) => (
          <ModelCard key={model.modelKey} model={model} />
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-accent hover:bg-accent-dim text-white py-3 rounded-lg font-medium transition-colors"
      >
        I've read both — vote now
      </button>
    </div>
  );
}

function ModelCard({
  model,
}: {
  model: GameSession["modelA"];
}) {
  return (
    <div className="bg-panel border border-border rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <span className="font-mono text-sm font-medium text-white">
          Model {model.modelKey}
        </span>
        <span className="text-xs font-mono text-muted/50">
          {(model.loadingMs / 1000).toFixed(1)}s
        </span>
      </div>

      <div className="p-5 space-y-4 flex-1">
        {/* Decision */}
        <div className="space-y-1">
          <p className="text-xs font-mono text-accent uppercase tracking-wider">
            Decision
          </p>
          <p className="text-sm text-slate-200 font-medium leading-snug">
            {model.chosenOption}
          </p>
        </div>

        {/* Reasoning */}
        <div className="space-y-1">
          <p className="text-xs font-mono text-muted uppercase tracking-wider">
            Reasoning
          </p>
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
            {model.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}
