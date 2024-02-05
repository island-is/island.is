import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { getRequest } from '@island.is/auth-nest-tools'
import { SignatureCollection } from '../models/collection.model'

export const getCurrentCollection = (
  context: ExecutionContext,
): SignatureCollection => {
  const request = getRequest(context)
  return request.body.collection
}

export const CurrentCollection = createParamDecorator(
  (options: unknown, context: ExecutionContext): SignatureCollection => {
    return getCurrentCollection(context)
  },
)
