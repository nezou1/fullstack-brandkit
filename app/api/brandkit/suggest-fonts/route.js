import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { SHOPIFY_FONTS } from "../../../lib/fonts";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
});

const FONT_NAMES = Object.keys(SHOPIFY_FONTS);

/**
 * Génère 3 duos de polices via l'IA.
 * Les polices proposées sont OBLIGATOIREMENT dans la liste des polices Shopify disponibles.
 */
export async function POST(req) {
  const { style, usage } = await req.json();

  if (!style || !usage) {
    return Response.json({ error: "style et usage requis" }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash-lite"),
      schema: z.object({
        duos: z
          .array(
            z.object({
              heading: z
                .string()
                .describe(
                  `Police pour les titres — OBLIGATOIREMENT l'un de : ${FONT_NAMES.join(", ")}`
                ),
              body: z
                .string()
                .describe(
                  `Police pour le corps du texte — OBLIGATOIREMENT l'un de : ${FONT_NAMES.join(", ")}`
                ),
              tag: z
                .string()
                .describe("3 mots max résumant l'ambiance (ex: Luxe raffiné)"),
              rationale: z
                .string()
                .describe("1 phrase expliquant pourquoi ce duo convient"),
            })
          )
          .length(3),
      }),
      prompt: `Tu es un expert en typographie pour boutiques e-commerce Shopify.

Style typographique souhaité : "${style}"
Utilisation principale : "${usage}"

Propose exactement 3 duos de polices harmonieux et professionnels pour ce type de boutique.

LISTE STRICTE — tu ne peux utiliser QUE ces polices, sans exception :
${FONT_NAMES.join(", ")}

Règles :
- La police "heading" sert pour les titres, accroches, noms de produits
- La police "body" sert pour les descriptions, textes courants
- Les deux polices doivent former un contraste harmonieux (ex : serif + sans-serif)
- Chaque duo doit avoir une personnalité distincte
- Ne jamais répéter la même combinaison

Réponds uniquement avec l'objet JSON demandé.`,
    });

    const validated = {
      duos: object.duos.map((d) => ({
        ...d,
        heading: FONT_NAMES.includes(d.heading) ? d.heading : "Playfair Display",
        body: FONT_NAMES.includes(d.body) ? d.body : "Montserrat",
        rationale:
          d.rationale.length > 140 ? d.rationale.slice(0, 137) + "…" : d.rationale,
      })),
    };
    return Response.json(validated);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[suggest-fonts]", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
