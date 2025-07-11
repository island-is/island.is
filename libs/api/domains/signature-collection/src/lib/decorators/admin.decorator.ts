import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { logger } from '@island.is/logging'

import { getRequest } from '@island.is/auth-nest-tools'
import { SignatureCollectionAdmin } from '../models/admin.model'
import { AdminPortalScope } from '@island.is/auth/scopes'

type SignatureCollectionAdminScope =
  | AdminPortalScope.signatureCollectionManage
  | AdminPortalScope.signatureCollectionProcess
  | AdminPortalScope.signatureCollectionMunicipality

export const getCurrentAdmin = (
  context: ExecutionContext,
): SignatureCollectionAdmin => {
  const request = getRequest(context)
  const user = request.user
  if (!user) {
    logger.warn(
      'No user authentication found. Did you forget to add IdsUserGuard?',
    )
    throw new UnauthorizedException()
  }
  const adminScope = user.scope?.find((scope) =>
    [
      AdminPortalScope.signatureCollectionManage,
      AdminPortalScope.signatureCollectionProcess,
      AdminPortalScope.signatureCollectionMunicipality,
    ].includes(scope as SignatureCollectionAdminScope),
  )

  if (!adminScope) {
    logger.warn('User does not have the required admin scope.')
    throw new UnauthorizedException()
  }

  return {
    ...user,
    adminScope: adminScope as SignatureCollectionAdminScope,
  }
}

export const CurrentAdmin = createParamDecorator(
  (options: unknown, context: ExecutionContext): SignatureCollectionAdmin => {
    return getCurrentAdmin(context)
  },
)
