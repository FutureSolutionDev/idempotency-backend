# دليل استخدام موسوعة الاطرداد (Idempotency Middleware)

يشرح هذا الدليل كيفية استخدام مكتبة Idempotency Middleware في بيئات Node.js المختلفة (مثل Express و Fastify والسيرفر النوعي).

---

## التثبيت

```bash
npm install idempotency-middleware
```

يجب أيضًا تثبيت الحزم المخصصة للنظام:

```bash
npm install express
# أو
npm install fastify
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

### 3. Node.js النوعي

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

## الاختبار

يمكنك استخدام `supertest` لـ Express و `inject()` لـ Fastify:

```ts
await request(app).post('/submit').set('idempotency-key', 'key1').expect(200);
const res = await request(app).post('/submit').set('idempotency-key', 'key1');
expect(res.body.cached).toBe(true);
```

---

## التهيئة المتقدمة

يمكنك تعديل `JsonIdempotencySession` لاستخدام Redis أو قاعدة بيانات.

---

## الخلاصة

يوفر هذا المكتب المزايا التالية:

* واجهة مشتركة لإدارة الاطرداد في كافة البيئات
* تحمي من الطلبات المكررة الغير قابلة للعودة
* تخزين وعرض نتيجة الرد

يستحسن استخدامه في نقاط API الحساسة مثل عمليات الدفع والنماذج القابلة للإعادة.

---
