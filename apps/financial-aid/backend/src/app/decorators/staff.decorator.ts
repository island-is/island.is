import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

import { Staff } from '@island.is/financial-aid/shared/lib'
import { logger } from '@island.is/logging'

export const CurrentStaff = createParamDecorator(
  (_: unknown, context: ExecutionContext): Staff => {
    const req = context.switchToHttp().getRequest()

    const staff = req.staff

    if (!staff) {
      logger.warn(
        'No user staff found. Did you forget to add IdsUserGuard or EmployeeGuard?',
      )
      throw new UnauthorizedException()
    }

    return staff
  },
)
