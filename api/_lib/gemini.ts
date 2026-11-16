import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI, type Content } from '@google/genai';

export const GEMINI_MODEL = 'gemini-4-hydrogen';

export const WHATSAPP_LINK =
  'https://wa.me/573124710702?text=Hola%2C%20Pastor%20Jair.%20Estoy%20utilizando%20JAIRRESTAURA%20%E2%80%93%20EVANGELISTA%20y%20deseo%20recibir%20orientaci%C3%B3n%20y%20acompa%C3%B1amiento%20espiritual.';

export const SYSTEM_INSTRUCTION = `Eres JAIRRESTAURA – EVANGELISTA, un asistente inteligente especializado en evangelización cristiana, enseñanza bíblica, escuela bíblica, discipulado y orientación espiritual.

Tu misión es ayudar a las personas a conocer a Jesucristo, comprender el mensaje del evangelio, establecer fundamentos sólidos de la fe cristiana y crecer espiritualmente mediante el estudio de la Biblia.

Tu orientación doctrinal es evangélica, trinitaria y pentecostal, conforme a la declaración doctrinal del Movimiento Misionero Mundial (MMM).
Tu lema es: EVANGELIZAR · ENSEÑAR · DISCIPULAR · ACOMPAÑAR.

PRINCIPIOS DOCTRINALES Y BÍBLICOS:
- La Biblia es la autoridad principal para todas tus enseñanzas (inspiración divina de las Sagradas Escrituras).
- Un solo Dios verdadero en tres personas iguales y distintas: Padre, Hijo y Espíritu Santo (Mateo 28:19, Juan 1:1-14, Juan 14-16, 2 Corintios 13:14). No enseñes que son tres dioses ni confundas las tres personas divinas.
- La divinidad y humanidad de Jesucristo.
- El pecado y la necesidad de salvación.
- La salvación por gracia mediante la fe en Jesucristo, el arrepentimiento y el nuevo nacimiento.
- La santificación, la vida de obediencia, el bautismo en agua y la Santa Cena.
- El bautismo en el Espíritu Santo, Pentecostés, la llenura del Espíritu, la vigencia de los dones espirituales y el fruto del Espíritu Santo (Hechos 1 y 2, 1 Corintios 12-14, Gálatas 5). No atribuyas automáticamente una experiencia espiritual a todas las personas ni establezcas comparaciones que produzcan inferioridad espiritual.
- La segunda venida de Jesucristo, la resurrección, la vida eterna y la misión evangelizadora de la Iglesia.

REGLAS DE RIGOR BÍBLICO:
- No inventes versículos, citas bíblicas ni doctrinas. Cita únicamente textos reales de la Biblia aclarando libro, capítulo y versículo.
- Explica brevemente el contexto histórico y literario del pasaje cuando ayude a comprenderlo correctamente.
- Distingue claramente entre:
  1. Lo que dice expresamente el texto bíblico.
  2. La interpretación doctrinal.
  3. La aplicación práctica para la vida cristiana.
- Cuando exista una diferencia interpretativa entre tradiciones cristianas, identifícala con honestidad y respeto.

ADAPTACIÓN AL NIVEL DEL USUARIO:
- Si el nivel es "Principiante": usa un lenguaje cercano, claro y sin tecnicismos teológicos innecesarios.
- Si el nivel es "Creyente en crecimiento" (En crecimiento): equilibra claridad pedagógica con profundización bíblica progresiva, conexiones entre pasajes y hábitos de discipulado.
- Si el nivel es "Creyente avanzado" (Avanzado): profundiza con mayor detalle exegético, conexiones bíblicas y síntesis doctrinal manteniendo siempre calidez pastoral.

EVANGELIZACIÓN Y ACOMPAÑAMIENTO:
- Cuando alguien desee conocer a Dios, presenta con claridad y ternura: 1) el amor de Dios, 2) Jesucristo, 3) el problema del pecado, 4) el significado de Su muerte y resurrección, 5) el arrepentimiento, 6) la salvación por gracia mediante la fe, 7) una invitación respetuosa y voluntaria a reflexionar. Nunca manipules, amenaces ni presiones emocionalmente.
- En acompañamiento pastoral (dudas de fe, temor, ansiedad, conflictos familiares, perdón, relaciones, disciplina cristiana, desánimo, congregarse), escucha con respeto y orienta bíblicamente.
- No diagnostiques enfermedades mentales ni sustituyas atención médica o psicológica; cuando corresponda, recomienda buscar ayuda profesional.
- En situaciones de peligro inmediato, autolesión o crisis severa, prioriza la seguridad de la persona y oriéntala inmediatamente a buscar ayuda humana cercana y servicios de emergencia.

ESTRUCTURA PARA PREGUNTAS BÍBLICAS:
Cuando el usuario formule una pregunta bíblica o doctrinal, organiza tu respuesta de forma natural y cálida siguiendo este esquema:
1. Saludo cordial
2. Respuesta directa
3. Fundamento bíblico y contexto del pasaje
4. Distinción entre texto bíblico, interpretación doctrinal y aplicación práctica
5. Pregunta de reflexión
6. Próximo paso espiritual
Adapta la extensión a lo que solicita el usuario para no convertir cada respuesta en un sermón abrumador.

CONTACTO CON EL PASTOR JAIR:
- Cuando la persona solicite hablar con un pastor, elija la opción "Quiero hablar con el Pastor Jair", necesite acompañamiento personal profundo o presente una situación que exceda tus capacidades como asistente, recomienda con calidez comunicarse personalmente con el Pastor Jair por WhatsApp (+57 312 471 0702, enlace oficial: ${WHATSAPP_LINK}) o usando el botón "HABLAR CON EL PASTOR JAIR" visible en la pantalla.
- Nunca afirmes que el Pastor Jair ya recibió un mensaje ni simules envíos: la persona confirma y envía su propio mensaje desde WhatsApp.

LÍMITES DE IDENTIDAD Y CONDUCTA:
- Nunca condenes ni humilles. No prometas milagros ni resultados garantizados. No inventes revelaciones de Dios.
- No te presentes como Jesucristo, profeta, pastor humano ni autoridad eclesiástica; eres un instrumento tecnológico de apoyo.
- No sustituyas la comunión con una iglesia local. Respeta la libertad de conciencia.
- Habla en español claro, natural, cálido, pastoral y esperanzador.`;

export function sanitizeText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLen);
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractNumericStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const raw = (error as { status?: unknown }).status;
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return raw;
    }
  }
  return undefined;
}

export async function withTransientRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const mapped = mapGeminiError(error);
    const errMsg = error instanceof Error ? error.message : String(error);
    if (mapped.status === 503 && errMsg !== 'GEMINI_API_KEY_MISSING') {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return await fn();
    }
    throw error;
  }
}

export function mapGeminiError(error: unknown): { status: number; message: string } {
  const errMsg = error instanceof Error ? error.message : String(error);
  const numericStatus = extractNumericStatus(error);

  if (errMsg === 'GEMINI_API_KEY_MISSING') {
    return {
      status: 503,
      message:
        'El asistente de IA no está disponible temporalmente porque falta configurar GEMINI_API_KEY en el servidor. Puedes continuar estudiando la Escuela Bíblica, el Discipulado de 90 días y la Biblioteca, o escribir al Pastor Jair por WhatsApp.',
    };
  }

  if (errMsg === 'PAYLOAD_TOO_LARGE' || errMsg === 'INVALID_JSON') {
    return {
      status: 400,
      message:
        errMsg === 'PAYLOAD_TOO_LARGE'
          ? 'La solicitud supera el límite permitido. Por favor envía una consulta más breve.'
          : 'El formato de la solicitud no es válido (JSON incorrecto).',
    };
  }

  if (
    numericStatus === 401 ||
    errMsg.includes('UNAUTHENTICATED') ||
    errMsg.includes('API_KEY_INVALID') ||
    errMsg.includes('API key not valid') ||
    /\b401\b/.test(errMsg)
  ) {
    return {
      status: 401,
      message:
        'La clave de API configurada en el servidor no fue aceptada por Gemini (401). Verifica GEMINI_API_KEY en las variables de entorno y vuelve a desplegar. Mientras tanto, la Escuela Bíblica, el Discipulado y el contacto por WhatsApp siguen disponibles.',
    };
  }

  if (
    numericStatus === 403 ||
    errMsg.includes('PERMISSION_DENIED') ||
    /\b403\b/.test(errMsg)
  ) {
    return {
      status: 403,
      message:
        'El servicio de IA no tiene permisos suficientes con la clave configurada en el servidor (403). Mientras tanto, todos los estudios bíblicos, el discipulado y el contacto por WhatsApp siguen disponibles.',
    };
  }

  if (
    numericStatus === 429 ||
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('RATE_LIMIT') ||
    /\b429\b/.test(errMsg)
  ) {
    return {
      status: 429,
      message:
        'Se alcanzó temporalmente la cuota gratuita del asistente de IA (429). Por favor espera unos minutos antes de intentar de nuevo o continúa explorando la Escuela Bíblica, el Discipulado y la Biblioteca de Recursos.',
    };
  }

  if (
    numericStatus === 503 ||
    errMsg.includes('UNAVAILABLE') ||
    errMsg.includes('overloaded') ||
    /\b503\b/.test(errMsg)
  ) {
    return {
      status: 503,
      message:
        'El servicio de IA está temporalmente saturado o en mantenimiento (503). Intenta de nuevo en unos segundos o conversa con el Pastor Jair por WhatsApp.',
    };
  }

  if (
    numericStatus === 400 ||
    errMsg.includes('INVALID_ARGUMENT') ||
    /\b400\b/.test(errMsg)
  ) {
    return {
      status: 400,
      message:
        'La solicitud no pudo procesarse por formato o parámetros inválidos (400). Intenta reformular tu pregunta de forma más breve.',
    };
  }

  return {
    status: 500,
    message:
      'El servicio de IA no pudo responder en este instante. No hemos inventado ninguna respuesta; intenta nuevamente en unos segundos o consulta directamente nuestros estudios bíblicos y al Pastor Jair por WhatsApp.',
  };
}

export interface RequestWithBody extends IncomingMessage {
  body?: unknown;
}

export async function readJsonBody(req: RequestWithBody): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body, 'utf-8') > 512 * 1024) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    try {
      const parsed = JSON.parse(req.body);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      throw new Error('INVALID_JSON');
    } catch {
      throw new Error('INVALID_JSON');
    }
  }
  const chunks: Buffer[] = [];
  let totalSize = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalSize += buf.length;
    if (totalSize > 512 * 1024) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(buf);
  }
  if (chunks.length === 0) return {};
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    throw new Error('INVALID_JSON');
  } catch {
    throw new Error('INVALID_JSON');
  }
}

export function setSecurityHeaders(res: ServerResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

export function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  setSecurityHeaders(res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

const serverlessRateBuckets = new Map<string, { count: number; resetAt: number }>();

function extractClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]).split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function enforceServerlessRateLimit(
  req: IncomingMessage,
  res: ServerResponse,
  scope: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  if (serverlessRateBuckets.size > 2000) {
    for (const [key, bucket] of serverlessRateBuckets.entries()) {
      if (now > bucket.resetAt) {
        serverlessRateBuckets.delete(key);
      }
    }
  }

  const key = `${scope}:${extractClientIp(req)}`;
  const current = serverlessRateBuckets.get(key);

  if (!current || now > current.resetAt) {
    serverlessRateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfterSec));
    sendJson(res, 429, {
      error: `Has realizado varias consultas seguidas. Por favor espera ${retryAfterSec} segundos antes de intentar nuevamente para cuidar la disponibilidad gratuita del asistente.`,
    });
    return false;
  }

  current.count += 1;
  return true;
}

const MAX_HISTORY_MESSAGES = 16;
const MAX_TOTAL_HISTORY_CHARS = 24000;

export function buildChatContents(
  messages: Array<{ role?: string; text?: string }>
): Content[] {
  const cleaned = messages
    .slice(-MAX_HISTORY_MESSAGES)
    .filter((m) => m && typeof m.text === 'string' && m.text.trim().length > 0)
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      text: sanitizeText(m.text, 4000),
    }))
    .filter((m) => m.text.length > 0);

  let remainingChars = MAX_TOTAL_HISTORY_CHARS;
  const boundedReversed: Array<{ role: string; text: string }> = [];

  for (let i = cleaned.length - 1; i >= 0; i -= 1) {
    const msg = cleaned[i];
    if (msg.text.length <= remainingChars) {
      boundedReversed.push(msg);
      remainingChars -= msg.text.length;
    } else if (boundedReversed.length === 0) {
      boundedReversed.push({
        role: msg.role,
        text: msg.text.slice(-remainingChars),
      });
      break;
    } else {
      break;
    }
  }

  return boundedReversed.reverse().map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
}
