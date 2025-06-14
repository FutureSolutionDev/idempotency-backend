# دليل استخدام موسوعة الاطرداد (Idempotency Middleware)

يشرح هذا الدليل كيفية استخدام مكتبة Idempotency Middleware في بيئات Node.js المختلفة (مثل Express و Fastify NestJs , Nodejs Native ).

---

## االشرح اللغات المدعومة

* [عربي](https://github.com/FutureSolutionDev/idempotency-backend/tree/main/docs/ar.md)
* [English](https://github.com/FutureSolutionDev/idempotency-backend/tree/main/docs/en.md)

---

## التكامل مع الواجهة الامامية ؟

هذه المكتبة متوافقة مع مخزن Idempotency الواجهة الامامية
[اقرأ دليل الواجهة الامامية](https://github.com/FutureSolutionDev/idempotency-client)

---

## التثبيت

```bash
npm install idempotency-backend
```

يجب أيضًا تثبيت الحزم المخصصة للنظام:

```bash
npm install express // fastify او Nest Js
```

---

## مفهوم الاطرداد

الاطرداد يعني أن نفس طلب HTTP يسترجع نفس النتيجة دائمًا. تكفل هذه الوسيطة بالاحتفاظ بالرد واعادته متى ما لزم ذلك.

تم تعريف الطلب بشكل فريد من خلال header مسمى `idempotency-key` أو عن طريق الطريق والمنهج كملاذ افتراضي.

---

## الاستخدام في المنصات المختلفة

### 1. Express

```ts
import express from 'express';
import IdempotencyExpress from 'idempotency-backend/express';
// Or 
const IdempotencyExpress = require("idempotency-backend/express");

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
import IdempotencyFastify from 'idempotency-backend/fastify';
// Or
const IdempotencyFastify = require("idempotency-backend/fastify");

const app = Fastify();
app.addHook('onRequest', IdempotencyFastify);

app.post('/submit', async (request, reply) => {
  const session = (request as any).idempotencySession;
  const result = { success: true };
  await session.SaveResponse(result);
  reply.send(result);
});
```

### 3. Node.js النوعي

```ts
import http from 'http';
import IdempotencyNode from 'idempotency-backend/node';
// Or
const IdempotencyNode = require("idempotency-backend/node");

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

### 4. Nest Js

```ts
// AppModule setup
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import IdempotencyNest  from 'idempotency-backend/nestjs';
// Or 
const IdempotencyNest = require("idempotency-backend/nestjs");
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

## الاختبار

يمكنك استخدام `supertest` لـ Express و `inject()` لـ Fastify:

```ts
await request(app).post('/submit').set('idempotency-key', 'key1').expect(200);
const res = await request(app).post('/submit').set('idempotency-key', 'key1');
expect(res.body.cached).toBe(true);
```

---

## التهيئة المتقدمة

يمكنك تعديل `IdempotencySession` لاستخدام Redis أو قاعدة بيانات.

---

## الخلاصة

يوفر هذا المكتب المزايا التالية:

* واجهة مشتركة لإدارة الاطرداد في كافة البيئات
* تحمي من الطلبات المكررة الغير قابلة للعودة
* تخزين وعرض نتيجة الرد

يستحسن استخدامه في نقاط API الحساسة مثل عمليات الدفع والنماذج القابلة للإعادة.

---
