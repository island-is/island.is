import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

import { Application } from '@island.is/financial-aid/shared/lib'
import { logger } from '@island.is/logging'

export const CurrentApplication = createParamDecorator(
  (_: unknown, context: ExecutionContext): Application => {
    const req = context.switchToHttp().getRequest()

    const application = req.application

    if (!application) {
      logger.warn(
        'No user staff found. Did you forget to add IdsUserGuard or ApplicationGuard?',
      )
      throw new UnauthorizedException()
    }

    return application
  },
)
