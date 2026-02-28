export type DilemmaCategory =
  | "trolley"
  | "ai-loyalty"
  | "self-preservation"
  | "autonomous-vehicle"
  | "whistleblowing"
  | "resource-allocation"
  | "deception";

export interface Dilemma {
  id: string;
  title: string;
  scenario: string;
  options: [string, string]; // exactly 2 choices
  category: DilemmaCategory;
  stakes: "low" | "medium" | "high" | "critical";
}

export interface ModelResponse {
  modelKey: "A" | "B";
  content: string;
  chosenOption: string; // which option did the model pick (its own words)
  reasoning: string;
  loadingMs: number;
}

export interface GameSession {
  dilemma: Dilemma;
  userChoice: string;
  modelA: ModelResponse;
  modelB: ModelResponse;
  /** actual model IDs, only revealed after vote */
  modelAId: "claude" | "gpt";
  modelBId: "claude" | "gpt";
}

export type VoteTarget = "A" | "B" | "tie";

export interface VotePayload {
  dilemmaId: string;
  winner: VoteTarget; // which model had better reasoning / safer choice
  modelAId: "claude" | "gpt";
  modelBId: "claude" | "gpt";
}

export interface LeaderboardEntry {
  modelId: "claude" | "gpt";
  modelName: string;
  wins: number;
  losses: number;
  ties: number;
  harmCount: number; // times their choice was flagged as the "harmful" option
  totalVotes: number;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
  totalGames: number;
  lastUpdated: string;
}

export type GameStep =
  | "intro"
  | "user-choice"
  | "loading"
  | "responses"
  | "voting"
  | "reveal";
