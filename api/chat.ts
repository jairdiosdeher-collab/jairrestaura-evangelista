import type { ServerResponse } from 'http';
import {
  SYSTEM_INSTRUCTION,
  buildChatContents,
  getGeminiClient,
  mapGeminiError,
  readJsonBody,
  sanitizeText,
  sendJson,
  setSecurityHeaders,
  type RequestWithBody,
} from './_lib/gemini.js';

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  setSecurityHeaders(res);

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Método no permitido.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const messages = body.messages as Array<{ role?: string; text?: string }> | undefined;
    const context = body.context as
      | { profile?: string; level?: string; lessonTitle?: string; module?: string }
      | undefined;

    if (!Array.isArray(messages) || messages.length === 0) {
      sendJson(res, 400, { error: 'Se requiere al menos un mensaje para conversar.' });
      return;
    }

    const contents = buildChatContents(messages);
    if (contents.length === 0) {
      sendJson(res, 400, { error: 'El mensaje no puede estar vacío.' });
      return;
    }

    const ai = getGeminiClient();

    const contextNotes: string[] = [];
    if (context?.profile) {
      contextNotes.push(
        `Perfil espiritual indicado por la persona: ${sanitizeText(context.profile, 120)}.`
      );
    }
    if (context?.level) {
      contextNotes.push(
        `Nivel bíblico seleccionado: ${sanitizeText(context.level, 60)}. Adapta la profundidad y vocabulario a este nivel.`
      );
    }
    if (context?.module) {
      contextNotes.push(
        `Módulo actual desde el que consulta: ${sanitizeText(context.module, 120)}.`
      );
    }
    if (context?.lessonTitle) {
      contextNotes.push(
        `Lección o curso en estudio: "${sanitizeText(context.lessonTitle, 160)}".`
      );
    }

    const fullSystemInstruction =
      contextNotes.length > 0
        ? `${SYSTEM_INSTRUCTION}\n\nCONTEXTO ACTUAL DE LA SESIÓN:\n${contextNotes.join('\n')}`
        : SYSTEM_INSTRUCTION;

    const stream = await ai.models.generateContentStream({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction: fullSystemInstruction,
      },
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    const mapped = mapGeminiError(error);
    if (!res.headersSent) {
      sendJson(res, mapped.status, { error: mapped.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: mapped.message })}\n\n`);
      res.end();
    }
  }
}
