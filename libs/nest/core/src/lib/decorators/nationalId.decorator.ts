import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'

import { isPerson } from 'kennitala'

export const NationalId = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest()
    const nationalId = request.headers['x-param-nationalid']

    if (!nationalId) {
      throw new BadRequestException('No national id provided')
    }

    if (!isPerson(nationalId) && nationalId.length !== 10) {
      throw new BadRequestException(
        'Provided national id is invalid. It must be a valid Icelandic national ID.',
      )
    }

    return nationalId
  },
)
