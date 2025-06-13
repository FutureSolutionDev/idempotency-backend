import { IncomingMessage, ServerResponse } from "http";
import { UniversalMiddleware } from "./UniversalMiddleware";

/**
 * Middleware function for handling idempotency in Node.js applications.
 *
 * This function checks for an idempotency key in the request headers and
 * uses it to retrieve a cached response if available. If a cached response
 * is found, it is returned with a 200 status code. Otherwise, a new session
 * is created, and the request is allowed to proceed to the next middleware.
 *
 * @param req - The incoming HTTP request object.
 * @param res - The HTTP response object.
 * @param next - A callback to pass control to the next middleware function.
 * @returns A Promise that resolves when the middleware is complete.
 *
 * @example
 * import http from 'http';
 * // commonjs
 * const {IdempotencyNode} = require("idempotency")
 * //EcmaScript
 * import {IdempotencyNode} from 'idempotency';
 *
 * const server = http.createServer((req, res) => {
 *   IdempotencyNode(req, res, () => {
 *     // simulate async work
 *     setTimeout(async () => {
 *       const session = (req as any).idempotencySession;
 *       const result = { ok: true, anotherData : false  };
 *       await session.SaveResponse(result);
 *       res.writeHead(200, { 'Content-Type': 'application/json' });
 *       res.end(JSON.stringify(result));
 *     }, 100);
 *   });
 * });
 *
 * server.listen(3000);
 */
const IdempotencyNode = async (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
) => {
  await UniversalMiddleware(req, res, next, "node");
};
export default IdempotencyNode;
