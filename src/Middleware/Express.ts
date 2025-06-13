import { Request, Response, NextFunction } from "express";
import { UniversalMiddleware } from "./UniversalMiddleware";

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
 * const {IdempotencyExpress} = require("idempotency")
 * //EcmaScript
 * import {IdempotencyExpress} from 'idempotency';
 * 
 * app.use(IdempotencyExpress);
 * app.get('/endpoint', IdempotencyExpress, (req, res) => {
 *   // ...
 *   res.send('Hello, World!');
 * });
 })
 */
const IdempotencyExpress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await UniversalMiddleware(req, res, next, "express");
};

export default IdempotencyExpress;
