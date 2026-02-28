import { NextRequest, NextResponse } from "next/server";
import { getRandomDilemma, getDilemmaById } from "@/lib/dilemmas";

export async function GET(req: NextRequest) {
  const excludeId = req.nextUrl.searchParams.get("exclude") ?? undefined;
  const id = req.nextUrl.searchParams.get("id") ?? undefined;

  if (id) {
    const dilemma = getDilemmaById(id);
    if (!dilemma) {
      return NextResponse.json({ error: "Dilemma not found" }, { status: 404 });
    }
    return NextResponse.json(dilemma);
  }

  return NextResponse.json(getRandomDilemma(excludeId));
}
