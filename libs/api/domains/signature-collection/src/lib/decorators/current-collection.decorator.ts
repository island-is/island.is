import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { getRequest } from '@island.is/auth-nest-tools'
import { SignatureCollectionInfo } from '../models/collection.model'

export const getCurrentCollection = (
  context: ExecutionContext,
): SignatureCollectionInfo => {
  const request = getRequest(context)
  return request.body.collection
}

export const CurrentCollection = createParamDecorator(
  (options: unknown, context: ExecutionContext): SignatureCollectionInfo => {
    return getCurrentCollection(context)
  },
)
