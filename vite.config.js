import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

/**
 * Small dev-only plugin that mounts the Vercel serverless function in api/
 * on the Vite dev server so /api/generate-trip behaves the same locally.
 */
function localApiPlugin() {
  return {
    name: 'yatraai-local-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-trip', async (req, res) => {
        try {
          const file = path.resolve(__dirname, 'api/generate-trip.js');
          const mod = await import(`${pathToFileURL(file).href}?t=${Date.now()}`);
          res.status = (code) => { res.statusCode = code; return res; };
          res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
          await mod.default(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, code: 'SERVER_ERROR', error: 'Local API error: ' + err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
  test: { environment: 'node' },
});
