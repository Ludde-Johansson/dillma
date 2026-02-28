import { getRandomDilemma } from "@/lib/dilemmas";
import { GameShell } from "@/components/GameShell";

// Always fresh on each visit — no caching
export const dynamic = "force-dynamic";

export default function GamePage() {
  const dilemma = getRandomDilemma();
  return <GameShell initialDilemma={dilemma} />;
}
