import { NextResponse } from "next/server";
import { readLeaderboard } from "@/lib/leaderboard";

export async function GET() {
  try {
    const board = readLeaderboard();
    return NextResponse.json(board);
  } catch (err) {
    console.error("[leaderboard]", err);
    return NextResponse.json(
      { error: "Failed to read leaderboard" },
      { status: 500 }
    );
  }
}
