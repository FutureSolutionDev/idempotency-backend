import { UniversalMiddleware } from "./UniversalMiddleware";
import { FastifyRequest, FastifyReply } from "fastify";
/**
 * Express middleware for handling idempotency.
 *
 * This middleware checks for an idempotency key in the request headers and
 * uses it to retrieve a cached response if available. If a cached response
 * is found, it is returned with a 200 status code. Otherwise, a new session
 * is created, and the request is allowed to proceed to the next middleware.
 *
 * @param req - The incoming HTTP request object.
 * @param res - The HTTP response object.
 * @param next - A callback to pass control to the next middleware function.
 * @returns A Promise that resolves when the middleware is complete.
 * @example
 * // commonjs
 * const {IdempotencyFastify} = require("idempotency")
 * //EcmaScript
 * import {IdempotencyFastify} from 'idempotency';
 *
 * import Fastify from "fastify";
 * 
 * const fastify = Fastify({logger: true });
 * import { UniversalMiddleware } from "./UniversalMiddleware";
 * import { FastifyRequest, FastifyReply } from "fastify";
 * 
 * fastify.addHook("onRequest", IdempotencyFastify);
 */
const IdempotencyFastify = async (
  req: FastifyRequest,
  reply: FastifyReply,
  done = () => {}
) => {
  await UniversalMiddleware(req, reply, done, "fastify");
};
export default IdempotencyFastify;
