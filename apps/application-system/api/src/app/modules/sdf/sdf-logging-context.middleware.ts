import { Injectable, NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

import { withLoggingContext } from '@island.is/logging'

// Only the shape is checked. The route's own pipe validates the id properly
// later; this just keeps arbitrary text out of the logs.
const UUID_SHAPE = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

/**
 * Attaches the application id of the route to everything logged while the rest
 * of the request is handled, including by guards, pipes and the framework's own
 * error handling. The id is only used when it looks like a UUID, because the
 * route parameter has not been validated yet at this point.
 */
@Injectable()
export class SdfLoggingContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const { applicationId } = req.params

    if (typeof applicationId !== 'string' || !UUID_SHAPE.test(applicationId)) {
      next()
      return
    }

    // Lowercased, as ids are stored, so every line of a request spells it alike.
    withLoggingContext({ applicationId: applicationId.toLowerCase() }, () =>
      next(),
    )
  }
}
