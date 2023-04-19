import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'

import { isPerson } from 'kennitala'

export const NationalId = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const headers = context.switchToHttp().getRequest().headers

    const nationalId = headers['x-param-nationalid']
    if (!nationalId) {
      throw new BadRequestException('No national id provided')
    }

    if (isPerson(nationalId) && nationalId.length === 10) {
      return nationalId
    }

    throw new BadRequestException(
      'Provided national id is invalid. Correct format is 10 numbers, no dashes',
    )
  },
)
