const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

function log(status, method, url) {
  const time = new Date().toLocaleTimeString('pt-BR');
  const color = status < 400 ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}[${time}] ${status}\x1b[0m ${method} ${url}`);
}

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Rota raiz → index.html
  if (urlPath === '/' || urlPath === '/index') {
    urlPath = '/AP-63-index.html';
  }

  const filePath = path.join(PUBLIC_DIR, urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Impede acesso fora do diretório público (path traversal)
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Acesso negado');
    log(403, req.method, req.url);
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        const notFound = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>404 — Página não encontrada</title>
<style>body{font-family:Arial,sans-serif;text-align:center;padding:60px;background:#f0f4f8}
h1{color:#1e3a8a}a{color:#1d4ed8}</style></head>
<body><h1>404</h1><p>Página não encontrada.</p>
<a href="/">← Voltar ao início</a></body></html>`;
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(notFound);
        log(404, req.method, req.url);
      } else {
        res.writeHead(500);
        res.end('Erro interno do servidor');
        log(500, req.method, req.url);
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
    log(200, req.method, req.url);
  });
});

server.listen(PORT, () => {
  console.log('\x1b[36m╔══════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║   Clube de Desbravadores Thiago White    ║\x1b[0m');
  console.log('\x1b[36m╚══════════════════════════════════════════╝\x1b[0m');
  console.log(`\n  Servidor rodando em \x1b[4mhttp://localhost:${PORT}\x1b[0m`);
  console.log('  Pressione Ctrl+C para parar.\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\x1b[31mPorta ${PORT} já está em uso. Tente outra porta.\x1b[0m`);
  } else {
    console.error('Erro no servidor:', err.message);
  }
  process.exit(1);
});
