import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { getDilemmaById } from "@/lib/dilemmas";
import type { ModelResponse } from "@/lib/types";

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CLAUDE_MODEL = "claude-opus-4-6";
const GPT_MODEL = "gpt-5.2";

async function queryClaude(prompt: string): Promise<Omit<ModelResponse, "modelKey">> {
  const start = Date.now();
  const msg = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content =
    msg.content[0].type === "text" ? msg.content[0].text : "";
  const loadingMs = Date.now() - start;

  const decision = extractSection(content, "DECISION");
  const reasoning = extractSection(content, "REASONING");

  return { content, chosenOption: decision, reasoning, loadingMs };
}

async function queryGPT(prompt: string): Promise<Omit<ModelResponse, "modelKey">> {
  const start = Date.now();
  const completion = await openai.chat.completions.create({
    model: GPT_MODEL,
    max_completion_tokens: 600,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "";
  const loadingMs = Date.now() - start;

  const decision = extractSection(content, "DECISION");
  const reasoning = extractSection(content, "REASONING");

  return { content, chosenOption: decision, reasoning, loadingMs };
}

function extractSection(text: string, label: string): string {
  const regex = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z]+:|$)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : text.trim();
}

function buildPrompt(scenario: string, options: [string, string]): string {
  return `Here is your dilemma:\n\n${scenario}\n\nYour two options are:\n\nOption 1: ${options[0]}\nOption 2: ${options[1]}\n\nYou must choose one. What do you do?`;
}

export async function POST(req: NextRequest) {
  try {
    const { dilemmaId } = await req.json();

    if (!dilemmaId) {
      return NextResponse.json({ error: "Missing dilemmaId" }, { status: 400 });
    }

    const dilemma = getDilemmaById(dilemmaId);
    if (!dilemma) {
      return NextResponse.json({ error: "Dilemma not found" }, { status: 404 });
    }

    const prompt = buildPrompt(dilemma.scenario, dilemma.options);

    // Randomly assign which model is A and which is B
    const claudeIsA = Math.random() < 0.5;

    // Query both models simultaneously
    const [claudeResult, gptResult] = await Promise.all([
      queryClaude(prompt),
      queryGPT(prompt),
    ]);

    const modelA: ModelResponse = {
      modelKey: "A",
      ...(claudeIsA ? claudeResult : gptResult),
    };
    const modelB: ModelResponse = {
      modelKey: "B",
      ...(claudeIsA ? gptResult : claudeResult),
    };

    return NextResponse.json({
      modelA,
      modelB,
      modelAId: claudeIsA ? "claude" : "gpt",
      modelBId: claudeIsA ? "gpt" : "claude",
    });
  } catch (err) {
    console.error("[query-models]", err);
    return NextResponse.json(
      { error: "Failed to query models", detail: String(err) },
      { status: 500 }
    );
  }
}
