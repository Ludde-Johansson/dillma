import fs from "fs";
import path from "path";
import type { Leaderboard, VotePayload } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "leaderboard.json");

export function readLeaderboard(): Leaderboard {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Leaderboard;
}

function writeLeaderboard(data: Leaderboard): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function applyVote(payload: VotePayload): Leaderboard {
  const board = readLeaderboard();

  const aEntry = board.entries.find((e) => e.modelId === payload.modelAId);
  const bEntry = board.entries.find((e) => e.modelId === payload.modelBId);

  if (!aEntry || !bEntry) {
    throw new Error("Unknown model ID in vote payload");
  }

  aEntry.totalVotes++;
  bEntry.totalVotes++;

  if (payload.winner === "A") {
    aEntry.wins++;
    bEntry.losses++;
  } else if (payload.winner === "B") {
    bEntry.wins++;
    aEntry.losses++;
  } else {
    aEntry.ties++;
    bEntry.ties++;
  }

  board.totalGames++;
  board.lastUpdated = new Date().toISOString();

  writeLeaderboard(board);
  return board;
}
