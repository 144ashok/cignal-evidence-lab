import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFindingStore } from './finding-store.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = resolve(projectRoot, 'dist');
const optionsFile = new URL('./fixtures/fact-options.json', import.meta.url);
const scenariosFile = new URL('./fixtures/scenarios.json', import.meta.url);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) {
    throw Object.assign(new Error('Send application/json.'), { status: 415 });
  }
  let body = '';
  for await (const chunk of request) {
    body += chunk.toString();
    if (Buffer.byteLength(body) > 128 * 1024) throw Object.assign(new Error('Input exceeds 128 KB.'), { status: 413 });
  }
  try {
    const value = JSON.parse(body);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value;
  } catch {
    throw Object.assign(new Error('Expected a JSON object.'), { status: 400 });
  }
}

export async function createApp({ development = false, stateFile = resolve(projectRoot, 'state/findings.json') } = {}) {
  const store = createFindingStore(stateFile);
  const scenarioStores = new Map();
  async function evaluationContext(url) {
    const id = url.searchParams.get('scenario');
    if (!id) return { store, setupInputs: [] };
    const scenarios = JSON.parse(await readFile(scenariosFile, 'utf8'));
    const scenario = scenarios.find(item => item.id === id && item.showInSelector);
    if (!scenario) throw Object.assign(new Error('Unknown brief scenario.'), { status: 400 });
    // Every selectable case has its own experiment history. Required prior facts
    // are supplied explicitly by fixtures, without reusing another case's edits.
    if (!scenarioStores.has(id)) scenarioStores.set(id, createFindingStore(resolve(dirname(stateFile), 'scenarios', `${id}.json`)));
    return {
      store: scenarioStores.get(id),
      setupInputs: scenario.setupFixtureIds.map(setupId => {
        const prerequisite = scenarios.find(item => item.id === setupId);
        if (!prerequisite) throw new Error(`Missing setup fixture: ${setupId}`);
        return prerequisite.input;
      }),
    };
  }
  const server = createServer();
  // Vite is development middleware only; Node owns both the API and HTTP port.
  const vite = development
    ? await (await import('vite')).createServer({
        root: projectRoot,
        server: { middlewareMode: true, hmr: { server } },
        appType: 'spa',
      })
    : null;

  server.on('request', async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const pathname = url.pathname;
      if (pathname === '/api/evaluate' && request.method === 'POST') {
        const context = await evaluationContext(url);
        sendJson(response, 200, await context.store.evaluate(await readJsonBody(request), context.setupInputs));
        return;
      }
      if (pathname === '/api/reset' && request.method === 'POST') {
        await readJsonBody(request);
        await (await evaluationContext(url)).store.reset();
        sendJson(response, 200, { reset: true });
        return;
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.setHeader('Allow', 'GET, HEAD');
        sendJson(response, 405, { error: 'Method not allowed.' });
        return;
      }

      if (pathname === '/api/fact-options') {
        const options = JSON.parse(await readFile(optionsFile, 'utf8'));
        sendJson(response, 200, options);
        return;
      }
      if (pathname === '/api/scenarios') {
        sendJson(response, 200, JSON.parse(await readFile(scenariosFile, 'utf8')));
        return;
      }
      if (pathname === '/api/findings') {
        sendJson(response, 200, await (await evaluationContext(url)).store.list());
        return;
      }
      if (pathname === '/api' || pathname.startsWith('/api/')) {
        sendJson(response, 404, { error: 'API endpoint not found.' });
        return;
      }

      if (vite) {
        vite.middlewares(request, response);
        return;
      }

      let decodedPath;
      try {
        decodedPath = decodeURIComponent(pathname);
      } catch {
        sendJson(response, 400, { error: 'Invalid path.' });
        return;
      }
      const filePath = resolve(distRoot, `.${decodedPath === '/' ? '/index.html' : decodedPath}`);
      const relativePath = relative(distRoot, filePath);
      if (relativePath.startsWith('..') || isAbsolute(relativePath) || decodedPath.includes('\0')) {
        sendJson(response, 404, { error: 'File not found.' });
        return;
      }

      try {
        const body = await readFile(filePath);
        response.writeHead(200, {
          'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
          'X-Content-Type-Options': 'nosniff',
        });
        response.end(request.method === 'HEAD' ? undefined : body);
      } catch (error) {
        if (['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code)) {
          sendJson(response, 404, { error: 'File not found. Run npm run build to create the frontend.' });
          return;
        }
        throw error;
      }
    } catch (error) {
      if (error.status) {
        sendJson(response, error.status, { error: error.message });
        return;
      }
      console.error('Request failed:', error);
      sendJson(response, 500, { error: 'Unable to load local application data.' });
    }
  });

  return { server, close: async () => {
    await vite?.close();
    if (server.listening) await new Promise((resolveClose, reject) => {
      server.close(error => error ? reject(error) : resolveClose());
      server.closeIdleConnections();
    });
  } };
}
