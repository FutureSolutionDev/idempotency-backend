# Idempotency Middleware Usage Guide

This guide explains how to use the Idempotency Middleware library across different Node.js server environments (Express, Fastify, Nestjs and native Node.js) to ensure safe and efficient HTTP request handling.

---

## Languages Supported

* [Arabic](https://github.com/FutureSolutionDev/idempotency-backend/tree/main/docs/ar.md)
* [English](https://github.com/FutureSolutionDev/idempotency-backend/tree/main/docs/en.md)

---

## Frontend Compatibility ?

This library is compatible with the frontend Idempotency Store
[Read the Frontend Guide](https://github.com/FutureSolutionDev/idempotency-client)

---

## 📦 Installation

```bash
npm install idempotency

```

You must also install any framework-specific dependencies as needed:

```bash
npm install express // fastify or Nest Js
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
import IdempotencyExpress from 'idempotency';

const app = express();
app.use(IdempotencyExpress);

app.post('/submit', async (req, res) => {
  const session = (req as any).idempotencySession;
  const result = { success: true };
  await session.SaveResponse(result);
  res.status(200).json(result);
});
```

### 2. Fastify

```ts
import Fastify from 'fastify';
import { IdempotencyFastify } from 'idempotency';

const app = Fastify();
app.addHook('onRequest', IdempotencyFastify);

app.post('/submit', async (request, reply) => {
  const session = (request as any).idempotencySession;
  const result = { success: true };
  await session.SaveResponse(result);
  reply.send(result);
});
```

### 3. Node.js Native

```ts
import http from 'http';
import { IdempotencyNode } from 'idempotency';

const server = http.createServer((req, res) => {
  IdempotencyNode(req, res, async () => {
    const session = (req as any).idempotencySession;
    const result = { success: true };
    await session.SaveResponse(result);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  });
});

server.listen(3000);
```

### 3. Nest Js

```ts
// AppModule setup
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IdempotencyNest } from 'idempotency';
@Module
({}) export class AppModule implements NestModule { configure(consumer: MiddlewareConsumer) { consumer.apply(IdempotencyNest).forRoutes('*'); } }


// Controller usage
@Get
() async getData(@Req() req: Request,

@Res
() res: Response) { const session = (req as any).idempotencySession; const result = {ok: true, anotherData : false }; await session.SaveResponse(result); res.json(result); 
}

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

You can extend or replace `IdempotencySession` to implement database or Redis-based persistence.

---

## 📬 Support

Open an issue or reach out for help on the GitHub repository.

---

## ✅ Summary

This library allows you to:

* Use the same logic across Express, Fastify, NestJs and native HTTP
* Handle repeated requests idempotently
* Cache and replay responses using a consistent interface

Use it in APIs where retrying requests is common and safety is essential (e.g., payment endpoints).

---
