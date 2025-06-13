import request from "supertest";
import express from "express";
import fastify from "fastify";
import http from "http";
import {
  IdempotencyExpress,
  IdempotencyFastify,
  IdempotencyNode,
} from "../index";
describe("Idempotency Middleware", () => {
  it("should return cached response with Express", async () => {
    const app = express();
    app.use(IdempotencyExpress);
    app.get("/", async (req, res) => {
      const session = (req as any).idempotencySession;
      await session.SaveResponse({ ok: true });
      res.status(200).json({ ok: true });
    });

    await request(app)
      .get("/")
      .set("idempotency-key", "express-test")
      .expect(200);

    const res2 = await request(app)
      .get("/")
      .set("idempotency-key", "express-test")
      .expect(200);
    expect(res2.body.cached).toBe(true);
    expect(res2.body.data.ok).toBe(true);
  });

  it("should return cached response with Fastify", async () => {
    const app = fastify();
    app.addHook("onRequest", IdempotencyFastify);
    app.get("/", async (req, reply) => {
      const session = (req as any).idempotencySession;
      await session.SaveResponse({ ok: true });
      return { ok: true };
    });

    await app.ready();
    await app.inject({
      method: "GET",
      url: "/",
      headers: { "idempotency-key": "fastify-test" },
    });

    const res2 = await app.inject({
      method: "GET",
      url: "/",
      headers: { "idempotency-key": "fastify-test" },
    });

    const body = JSON.parse(res2.body);
    expect(res2.statusCode).toBe(200);
    expect(body.cached).toBe(true);
    expect(body.data.ok).toBe(true);
  });

  it("should return cached response with Node", async () => {
    const server = http.createServer((req, res) => {
      IdempotencyNode(req as any, res, async () => {
        const session = (req as any).idempotencySession;
        await session.SaveResponse({ ok: true });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      });
    });

    await request(server)
      .get("/")
      .set("idempotency-key", "node-test")
      .expect(200);

    const res2 = await request(server)
      .get("/")
      .set("idempotency-key", "node-test")
      .expect(200);

    expect(res2.body.cached).toBe(true);
    expect(res2.body.data.ok).toBe(true);
  });
});
