import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

import { MunicipalityApiUser } from '@island.is/financial-aid/shared/lib'
import { logger } from '@island.is/logging'

export const CurrentMunicipalityCode = createParamDecorator(
  (_: unknown, context: ExecutionContext): MunicipalityApiUser => {
    const req = context.switchToHttp().getRequest()

    const municipalityCode = req.municipalityCode

    if (!municipalityCode) {
      logger.warn('No municipality code was found')
      throw new UnauthorizedException()
    }

    return municipalityCode
  },
)
