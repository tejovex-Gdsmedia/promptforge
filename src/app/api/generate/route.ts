import { NextResponse } from "next/server";
import { buildStructuredPrompt } from "@/lib/promptBuilder";

export async function POST(req: Request) {
  const { profession, input } = await req.json();

  if (!input || !String(input).trim()) {
    return NextResponse.json({ result: "Please provide an idea to generate a prompt." }, { status: 400 });
  }

  try {
    const { category, raw_idea, generated_prompt, word_count, model_compatibility } = await buildStructuredPrompt(
      profession,
      input
    );

    return NextResponse.json({
      result: generated_prompt,
      category,
      raw_idea,
      generated_prompt,
      word_count,
      model_compatibility,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ result: "AI generation failed: " + message }, { status: 502 });
  }
}
