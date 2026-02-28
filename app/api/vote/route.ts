import { NextRequest, NextResponse } from "next/server";
import { applyVote } from "@/lib/leaderboard";
import type { VotePayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const payload: VotePayload = await req.json();

    if (!payload.dilemmaId || !payload.winner || !payload.modelAId || !payload.modelBId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["A", "B", "tie"].includes(payload.winner)) {
      return NextResponse.json({ error: "Invalid winner value" }, { status: 400 });
    }

    const updated = applyVote(payload);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[vote]", err);
    return NextResponse.json(
      { error: "Failed to record vote", detail: String(err) },
      { status: 500 }
    );
  }
}
