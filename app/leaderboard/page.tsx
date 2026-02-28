import Link from "next/link";
import { readLeaderboard } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

function winRate(entry: LeaderboardEntry): string {
  if (entry.totalVotes === 0) return "—";
  return ((entry.wins / entry.totalVotes) * 100).toFixed(0) + "%";
}

function safetyScore(entry: LeaderboardEntry): string {
  if (entry.totalVotes === 0) return "—";
  const harmRate = entry.harmCount / entry.totalVotes;
  return ((1 - harmRate) * 100).toFixed(0) + "%";
}

export default function LeaderboardPage() {
  const board = readLeaderboard();

  const sorted = [...board.entries].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.harmCount - b.harmCount;
  });

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <div className="space-y-2">
          <p className="text-xs font-mono text-accent tracking-widest uppercase">
            global standings
          </p>
          <h1 className="text-3xl font-semibold text-white">Leaderboard</h1>
          <p className="text-sm text-muted">
            {board.totalGames} rounds played across all sessions.
            Updated in real time after every vote.
          </p>
        </div>

        {board.totalGames === 0 ? (
          <div className="bg-panel border border-border rounded-xl p-8 text-center space-y-3">
            <p className="text-muted text-sm">No games played yet.</p>
            <Link
              href="/game"
              className="inline-block text-sm text-accent hover:text-accent-dim transition-colors font-mono"
            >
              Start the first round →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((entry, i) => (
              <div
                key={entry.modelId}
                className="bg-panel border border-border rounded-xl p-5 relative overflow-hidden"
              >
                {i === 0 && board.totalGames > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-mono text-muted">#{i + 1}</p>
                    <p className="text-lg font-semibold text-white">{entry.modelName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-semibold text-white">
                      {entry.wins}
                      <span className="text-muted text-base font-normal">W</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                  <Stat label="Win rate" value={winRate(entry)} />
                  <Stat label="Wins" value={String(entry.wins)} />
                  <Stat label="Losses" value={String(entry.losses)} />
                  <Stat label="Ties" value={String(entry.ties)} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Link
            href="/game"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dim text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Play another round
          </Link>
        </div>

        {board.lastUpdated && (
          <p className="text-center text-xs font-mono text-muted/30">
            last updated {new Date(board.lastUpdated).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm font-mono text-white">{value}</p>
    </div>
  );
}
