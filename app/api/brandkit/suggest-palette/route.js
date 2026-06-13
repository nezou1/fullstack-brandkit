import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
});

/**
 * Génère 3–4 palettes de couleurs via l'IA à partir d'une niche, d'un style
 * et optionnellement de couleurs à éviter.
 */
export async function POST(req) {
  const { niche, style, avoid, inspiration } = await req.json();

  if (!niche || !style) {
    return Response.json({ error: "niche et style requis" }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash-lite"),
      schema: z.object({
        palettes: z
          .array(
            z.object({
              name: z.string().describe("Nom évocateur, 1–3 mots"),
              sub: z.string().describe("Niche ou ambiance en 2–3 mots"),
              colors: z
                .array(z.string())
                .length(5)
                .describe(
                  "5 codes hex dans l'ordre : principale, secondaire, accent, fond clair, fond très clair. Format OBLIGATOIRE : #RRGGBB (ex: #C4849B)"
                ),
              rationale: z
                .string()
                .describe("1 phrase courte expliquant pourquoi cette palette"),
            })
          )
          .min(3)
          .max(4),
      }),
      prompt: `Tu es un expert en identité visuelle pour boutiques e-commerce Shopify.

Niche du marchand : "${niche}"
Style souhaité : "${style}"${avoid?.length ? `\nCouleurs à éviter : ${avoid.join(", ")}` : ""}${inspiration?.trim() ? `\nInspiration / contexte additionnel : "${inspiration.trim()}"` : ""}

Propose 3 palettes de couleurs harmonieuses et professionnelles adaptées à cet univers e-commerce.
Règles :
- Chaque palette contient exactement 5 codes hex : principale, secondaire, accent, fond clair, fond très clair
- Les couleurs doivent être lisibles, contrastées, utilisables sur un site Shopify
- Évite #000000 et #ffffff purs
- Le fond clair doit être très lumineux (L > 90 en HSL)
- Chaque palette doit avoir une personnalité distincte

Réponds uniquement avec l'objet JSON demandé.`,
    });

    const trimmed = {
      palettes: object.palettes.map((p) => ({
        ...p,
        colors: p.colors.map((c) => (c.startsWith("#") ? c : `#${c}`)),
        rationale:
          p.rationale.length > 140
            ? p.rationale.slice(0, 137) + "…"
            : p.rationale,
      })),
    };
    return Response.json(trimmed);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[suggest-palette]", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
