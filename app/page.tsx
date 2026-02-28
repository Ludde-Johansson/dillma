import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="space-y-3">
          <p className="text-xs font-mono text-accent tracking-widest uppercase">
            an AI ethics experiment
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white">
            dillma
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-md mx-auto">
            Two AI models. One impossible choice. <br />
            Watch them reason — then decide who did it better.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            {
              step: "01",
              title: "Face the dilemma",
              desc: "Read a moral scenario. Pick your own answer first.",
            },
            {
              step: "02",
              title: "Watch them reason",
              desc: "Two anonymous AI models respond simultaneously. No labels.",
            },
            {
              step: "03",
              title: "Judge & reveal",
              desc: "Vote on better reasoning. See which model is which.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-panel border border-border rounded-lg p-4 space-y-2"
            >
              <span className="text-xs font-mono text-accent">{item.step}</span>
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/game"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dim text-white px-8 py-3 rounded-lg font-medium transition-colors glow-accent"
        >
          Start a round
          <span className="text-accent-dim">→</span>
        </Link>

        <p className="text-xs text-muted/50 font-mono">
          each session is fresh · no tracking · models judge themselves
        </p>
      </div>
    </div>
  );
}
