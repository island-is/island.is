import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { logger } from '@island.is/logging'

import { getRequest } from '@island.is/auth-nest-tools'
import { SignatureCollectionSignee } from '../models/signee.model'

export const getCurrentSignee = (
  context: ExecutionContext,
): SignatureCollectionSignee => {
  const request = getRequest(context)
  const user = request.user
  if (!user) {
    logger.warn(
      'No user authentication found. Did you forget to add IdsUserGuard?',
    )
    throw new UnauthorizedException()
  }
  // TODO: check if exists?

  return request.body.signee
}

export const CurrentSignee = createParamDecorator(
  (options: unknown, context: ExecutionContext): SignatureCollectionSignee => {
    return getCurrentSignee(context)
  },
)
