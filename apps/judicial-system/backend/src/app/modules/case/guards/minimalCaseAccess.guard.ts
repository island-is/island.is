import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { canUserAccessMinimalCase } from '../filters/case.filter'

@Injectable()
export class MinimalCaseAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user = request.user?.currentUser

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (!canUserAccessMinimalCase(theCase, user)) {
      throw new ForbiddenException(
        `User ${user.id} does not have access to minimal case ${theCase.id}`,
      )
    }

    return true
  }
}
