// request-id.middleware.ts
import type { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

import { Injectable, NestMiddleware } from '@nestjs/common'

import { withLoggingContext } from '@island.is/logging'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(_1: Request, _2: Response, next: NextFunction) {
    return withLoggingContext({ 'context-request': uuid() }, () => next())
  }
}

@Injectable()
export class CaseContextMiddleware implements NestMiddleware {
  use(request: Request, _: Response, next: NextFunction) {
    const { caseId = 'missing' } = request.params ?? {}

    return withLoggingContext({ 'context-case': caseId }, () => next())
  }
}
