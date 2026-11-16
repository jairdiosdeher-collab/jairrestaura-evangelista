import type { ServerResponse } from 'http';
import { ThinkingLevel } from '@google/genai';
import {
  GEMINI_MODEL,
  SYSTEM_INSTRUCTION,
  enforceServerlessRateLimit,
  getGeminiClient,
  mapGeminiError,
  readJsonBody,
  sanitizeText,
  sendJson,
  setSecurityHeaders,
  withTransientRetry,
  type RequestWithBody,
} from './_lib/gemini.js';

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  setSecurityHeaders(res);

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Método no permitido.' });
    return;
  }

  if (!enforceServerlessRateLimit(req, res, 'prayer-encouragement', 8, 60_000)) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const category = sanitizeText(body.category, 80);
    const requestText = sanitizeText(body.requestText, 1200);

    if (!requestText) {
      sendJson(res, 400, { error: 'Describe brevemente tu motivo de oración.' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Una persona ha compartido en su diario personal el siguiente motivo de oración (categoría: ${category || 'General'}):
"${requestText}"

Bríndale una breve palabra de aliento pastoral (máximo 180 palabras) que incluya:
1. Un mensaje cálido y esperanzador sin falsas promesas de milagros garantizados.
2. Un versículo bíblico real y exacto con su cita (libro, capítulo y versículo).
3. Una breve oración modelo que la persona pueda hacer delante de Dios.
4. Recordarle con suavidad que, si desea oración personal con el Pastor Jair, puede usar el botón de WhatsApp.`;

    const response = await withTransientRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      })
    );

    const encouragement = response.text?.trim();
    if (!encouragement) {
      sendJson(res, 502, {
        error:
          'No se recibió una respuesta del asistente en este momento. Intenta de nuevo en unos segundos.',
      });
      return;
    }

    sendJson(res, 200, { encouragement });
  } catch (error) {
    const mapped = mapGeminiError(error);
    sendJson(res, mapped.status, { error: mapped.message });
  }
}
