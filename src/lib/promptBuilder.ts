// Calls a real LLM to generate the structured prompt. There are no
// hardcoded category profiles or phrasing templates here - the model is
// instructed (via SYSTEM_PROMPT) on the required structure and rules, and
// it generates the actual role/task/context/constraints content itself.
import { callLLM } from "./groq";

export interface GeneratedPromptResult {
  category: string;
  raw_idea: string;
  generated_prompt: string;
  word_count: number;
  model_compatibility: string[];
}

const WORD_FLOOR = 150;
const WORD_CEILING = 400;

const SYSTEM_PROMPT = `You are PromptForge's prompt-engineering engine. Given a professional category and a user's raw idea, generate a single, ready-to-use AI prompt.

Use this EXACT structure, with the bolded markdown headers exactly as shown, each section separated by a blank line:

**Role:** Define the AI's expert role based on the category (e.g. "You are an expert healthcare consultant with 15+ years of experience...").

**Task:** Convert the user's raw idea into a clear, specific task instruction.

**Context:** Add relevant professional context based on the category - industry standards, audience, tone expectations.

**Output Format:** Specify what the output should look like (bullet points, paragraphs, tables, etc.), inferred from what the task actually needs.

**Constraints:** Add 2-3 smart constraints relevant to the category.

Apply this category-specific behavior:
- Healthcare: empathetic tone, patient-safe language, include an accuracy disclaimer
- Legal: formal tone, neutral language, include a "this is not legal advice" caveat
- Marketing: persuasive, benefit-focused, include a call-to-action instruction
- Engineering: technical precision, structured output, address edge cases
- Finance: data-driven tone, include a risk disclaimer
- Design: visual and descriptive, reference style and aesthetic
- Creative: imaginative, open-ended, include mood and tone
- Education: clear and simple, structured for learning
- Sales: conversion-focused, objection-handling mindset
- Human Resources: professional, inclusive language, policy-aware
- Consulting: strategic, problem-solution framing
- Data Science: analytical, specify data assumptions
- Product Management: user-story framing, outcome-focused
- Real Estate: location-aware, trust-building tone
- Media: engaging and platform-aware
- Any other or custom category: infer the single best professional approach directly from the raw idea

Strict output rules:
- Output ONLY the prompt itself. No preamble, no meta-commentary, no phrases like "Here is your prompt:", "Sure, here's...", or any explanation before or after it.
- The prompt must be between 150 and 400 words total.
- Use clean markdown with the bolded section headers exactly as specified above.
- The result must be ready to paste directly into ChatGPT, Claude, Gemini, or any other AI model.`;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Safety net only - strips a leading preamble line if the model adds one
// despite the system prompt's instruction not to. Does not alter content.
function stripMetaCommentary(text: string): string {
  const metaPatterns = [
    /^here('?s| is) (your|the)\b/i,
    /^sure[,!]/i,
    /^certainly[,!]/i,
    /^below is\b/i,
    /^of course[,!]/i,
  ];
  const lines = text.trim().split("\n");
  while (lines.length > 0 && !lines[0].trim().startsWith("**") && metaPatterns.some((p) => p.test(lines[0].trim()))) {
    lines.shift();
    while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  }
  return lines.join("\n").trim();
}

// If the model's output falls outside the required word range, ask it to
// rewrite itself (still LLM-generated, not a canned filler/truncation).
async function ensureWordBounds(text: string, category: string, idea: string): Promise<string> {
  const count = wordCount(text);
  if (count >= WORD_FLOOR && count <= WORD_CEILING) return text;

  const direction = count < WORD_FLOOR ? "expand it with more relevant detail" : "shorten it while keeping all required sections";
  const correctionMessage = `Category: ${category}\nRaw idea: ${idea}\n\nYour previous attempt was ${count} words, which is outside the required 150-400 word range. Rewrite it from scratch to ${direction}, so the final result lands between 150 and 400 words, keeping the exact same Role/Task/Context/Output Format/Constraints structure and all the same rules.`;

  try {
    const corrected = await callLLM(SYSTEM_PROMPT, correctionMessage);
    return stripMetaCommentary(corrected);
  } catch {
    return text;
  }
}

export async function buildStructuredPrompt(category: string, rawIdea: string): Promise<GeneratedPromptResult> {
  const idea = (rawIdea || "").trim();
  const safeCategory = (category || "Custom").trim() || "Custom";

  const userMessage = `Category: ${safeCategory}\nRaw idea: ${idea}`;
  const raw = await callLLM(SYSTEM_PROMPT, userMessage);
  const cleaned = stripMetaCommentary(raw);
  const generated = await ensureWordBounds(cleaned, safeCategory, idea);

  return {
    category: safeCategory,
    raw_idea: idea,
    generated_prompt: generated,
    word_count: wordCount(generated),
    model_compatibility: ["ChatGPT", "Claude", "Gemini", "Mistral"],
  };
}
