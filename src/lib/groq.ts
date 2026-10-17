import { Groq } from "groq-sdk";
import OpenAI from "openai";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-fallback" });

export async function generatePrompt(profession: string, input: string): Promise<string> {
  const providers = [
    { name: "groq", call: async () => {
      const chat = await groq.chat.completions.create({
        messages: [
          { role: "system", content: `You are an expert prompt engineer specializing in ${profession}. Transform rough ideas into structured professional prompts.` },
          { role: "user", content: input },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024,
      });
      return chat.choices[0]?.message?.content || "";
    }},
    { name: "openai", call: async () => {
      const chat = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `Expert in ${profession}. Transform rough ideas into structured professional prompts.` },
          { role: "user", content: input },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });
      return chat.choices[0]?.message?.content || "";
    }},
    { name: "anthropic", call: async () => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": process.env.ANTHROPIC_API_KEY || "sk-ant-fallback", "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-3-haiku-20240307", max_tokens: 1024, messages: [{ role: "user", content: `As a ${profession} expert, transform: ${input}` }] }),
      });
      const data = await res.json();
      return data.content?.[0]?.text || "";
    }},
    { name: "stub", call: async () => `Role: Expert ${profession} engineer.\nTask: Refine "${input}".\nOutput: Structured prompt.` },
  ];

  for (const p of providers) {
    try {
      const result = await p.call();
      if (result && result.trim().length > 10) return result;
    } catch (e) {
      console.log(p.name + " failed:", (e as Error).message);
    }
  }
  return "AI generation failed on all providers. Please try again.";
}

/**
 * Generic chat completion against the configured providers (Groq, then
 * OpenAI, then Anthropic). Unlike `generatePrompt`, this has no canned
 * fallback string - the caller decides how to surface a total failure.
 */
export async function callLLM(systemPrompt: string, userMessage: string, maxTokens = 900): Promise<string> {
  const providers = [
    { name: "groq", call: async () => {
      const chat = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.85,
        max_tokens: maxTokens,
      });
      return chat.choices[0]?.message?.content || "";
    }},
    { name: "openai", call: async () => {
      const chat = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.85,
        max_tokens: maxTokens,
      });
      return chat.choices[0]?.message?.content || "";
    }},
    { name: "anthropic", call: async () => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": process.env.ANTHROPIC_API_KEY || "", "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-3-haiku-20240307", max_tokens: maxTokens, system: systemPrompt, messages: [{ role: "user", content: userMessage }] }),
      });
      const data = await res.json();
      return data.content?.[0]?.text || "";
    }},
  ];

  for (const p of providers) {
    try {
      const result = await p.call();
      if (result && result.trim().length > 20) return result.trim();
    } catch (e) {
      console.log(p.name + " failed:", (e as Error).message);
    }
  }
  throw new Error("All LLM providers failed to generate a response.");
}
