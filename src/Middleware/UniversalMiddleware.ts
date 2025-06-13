import IdempotencySession from "../Idempotency/Session";
import { Response } from "express";
import { FastifyReply } from "fastify";
type Adapters = "express" | "fastify" | "node" | "nest";
function isFastify(req: any, res: any): res is FastifyReply {
  return (
    typeof res.send === "function" &&
    typeof res.status === "function" &&
    typeof req.raw === "object"
  );
}
export async function UniversalMiddleware(
  req: any,
  res: any,
  next: any | (() => void),
  adapter: Adapters
) {
  switch (adapter) {
    case "express":
      break;
    case "fastify":
      break;
    case "node":
      break;
    case "nest":
      break;
  }
  const idempotencyKey = req.headers["idempotency-key"];
  const requestId =
    typeof idempotencyKey === "string"
      ? idempotencyKey
      : `${req.method}::${req.url}`;
  const session = new IdempotencySession(requestId);
  const cached = await session.GetResponse();
  if (cached) {
    const responseBody = { cached: true, data: cached };
    switch (adapter) {
      case "express":
        return (res as Response).status(200).json(responseBody);
      case "fastify":
        return (res as FastifyReply).status(200).send(responseBody);
      case "node": {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ cached: true, data: cached }));
        return;
      }
      case "nest": {
        if (isFastify(req, res)) {
          res.status(200).send(responseBody);
        } else {
          (res as Response).status(200).json(responseBody);
        }
        return;
      }
      default:
        break;
    }
  }
  (req as any).idempotencySession = session;
  if (typeof next === "function") {
    next();
  }
}
