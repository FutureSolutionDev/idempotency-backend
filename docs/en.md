# Idempotency Middleware Usage Guide

This guide explains how to use the Idempotency Middleware library across different Node.js server environments (Express, Fastify, and native Node.js) to ensure safe and efficient HTTP request handling.

---

## 📦 Installation

```bash
npm install idempotency-middleware
```

You must also install any framework-specific dependencies as needed:

```bash
npm install express
# or
npm install fastify
```

---

## 🧠 Concept

Idempotency ensures that making the same HTTP request multiple times produces the same result. This middleware allows you to cache and reuse responses based on a unique request identifier.

The request is uniquely identified by the `idempotency-key` header or a fallback using the HTTP method and URL.

---

## 🚀 Usage in Different Environments

### 1. Express

```ts
import express from 'express';
import IdempotencyExpress from 'idempotency-middleware/dist/IdempotencyExpress';

const app = express();
app.use(IdempotencyExpress);

app.post('/submit', async (req, res) => {
  const session = (req as any).idempotencySession;
  const result = { success: true };
  session.setResponseData(result);
  await session.saveResponse();
  res.status(200).json(result);
});
```

### 2. Fastify

```ts
import Fastify from 'fastify';
import { IdempotencyFastify } from 'idempotency-middleware';

const app = Fastify();
app.addHook('onRequest', IdempotencyFastify);

app.post('/submit', async (request, reply) => {
  const session = (request as any).idempotencySession;
  const result = { success: true };
  session.setResponseData(result);
  await session.saveResponse();
  reply.send(result);
});
```

### 3. Node.js Native

```ts
import http from 'http';
import { nodeIdempotencyMiddleware } from 'idempotency-middleware';

const server = http.createServer((req, res) => {
  nodeIdempotencyMiddleware(req, res, async () => {
    const session = (req as any).idempotencySession;
    const result = { success: true };
    session.setResponseData(result);
    await session.saveResponse();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  });
});

server.listen(3000);
```

---

## 🧪 Testing

You can test the middleware using `supertest` for Express and `inject()` for Fastify:

```ts
// First request returns normal response
await request(app).post('/submit').set('idempotency-key', 'key1').expect(200);

// Second request with same key returns cached result
const res = await request(app).post('/submit').set('idempotency-key', 'key1');
expect(res.body.cached).toBe(true);
```

---

## 📁 Advanced Configuration

You can extend or replace `JsonIdempotencySession` to implement database or Redis-based persistence.

---

## 📬 Support

Open an issue or reach out for help on the GitHub repository.

---

## ✅ Summary

This library allows you to:

* Use the same logic across Express, Fastify, and native HTTP
* Handle repeated requests idempotently
* Cache and replay responses using a consistent interface

Use it in APIs where retrying requests is common and safety is essential (e.g., payment endpoints).

---
