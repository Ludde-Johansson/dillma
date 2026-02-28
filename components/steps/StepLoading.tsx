"use client";

export function StepLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full bg-accent/5 blur-xl animate-pulse-slow" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm font-mono text-slate-400">
          querying both models simultaneously
          <span className="inline-flex gap-1 ml-1">
            <span className="loader-dot">.</span>
            <span className="loader-dot">.</span>
            <span className="loader-dot">.</span>
          </span>
        </p>
        <p className="text-xs text-muted/50 font-mono">
          they receive the same prompt · no communication between them
        </p>
      </div>

      <div className="flex gap-8 font-mono text-xs text-muted/40">
        <span>model A</span>
        <span>·</span>
        <span>model B</span>
      </div>
    </div>
  );
}
