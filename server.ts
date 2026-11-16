import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import chatHandler from './api/chat.ts';
import healthHandler from './api/health.ts';
import prayerEncouragementHandler from './api/prayer-encouragement.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function createAiRateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const current = rateBuckets.get(ip);
    if (!current || now > current.resetAt) {
      rateBuckets.set(ip, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    if (current.count >= maxRequests) {
      res.status(429).json({
        error:
          'Has realizado varias consultas seguidas. Por favor espera un momento antes de intentar nuevamente.',
      });
      return;
    }
    current.count += 1;
    next();
  };
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '512kb' }));

  const aiLimiter = createAiRateLimiter(25, 60_000);

  app.all('/api/health', (req, res) => {
    void healthHandler(req, res);
  });

  app.all('/api/chat', aiLimiter, (req, res) => {
    void chatHandler(req, res);
  });

  app.all('/api/prayer-encouragement', aiLimiter, (req, res) => {
    void prayerEncouragementHandler(req, res);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JAIRRESTAURA – EVANGELISTA listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
