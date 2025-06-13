import { Injectable, NestMiddleware } from "@nestjs/common";
import { UniversalMiddleware } from "./UniversalMiddleware";
import { HttpAdapterHost } from "@nestjs/core";

/**
 * NestJS middleware for handling idempotency.
 *
 * This middleware checks for the presence of an idempotency key in the
 * request headers and attempts to retrieve a cached response. If a cached
 * response is found, it is returned immediately. Otherwise, a new session
 * is attached to the request object and control is passed to the next handler.
 *
 * @example
 * // AppModule setup
 * import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
 * import { IdempotencyNest } from 'idempotency';
 *
 * @Module({})
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(IdempotencyNest).forRoutes('*');
 *   }
 * }
 *
 * @example
 * // Controller usage
 * @Get()
 * async getData(@Req() req: Request, @Res() res: Response) {
 *   const session = (req as any).idempotencySession;
 *   const result = {ok: true, anotherData : false };
 *   await session.SaveResponse(result);
 *   res.json(result);
 * }
 */
@Injectable()
export default class IdempotencyNest implements NestMiddleware {
  constructor(private readonly adapterHost: HttpAdapterHost) {}
  async use(req: any, res: any, next: () => void) {
    const Adapter = this.adapterHost.httpAdapter.getType();
    await UniversalMiddleware(req, res, next, Adapter as any);
  }
}
