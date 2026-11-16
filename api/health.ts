import type { ServerResponse } from 'http';
import { sendJson, type RequestWithBody } from './_lib/gemini.js';

export default function handler(req: RequestWithBody, res: ServerResponse) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Método no permitido.' });
    return;
  }
  sendJson(res, 200, { ok: true, public: true });
}
