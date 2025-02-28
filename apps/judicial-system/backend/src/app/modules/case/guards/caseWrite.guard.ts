import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { canUserAccessCase } from '../filters/case.filter'

@Injectable()
export class CaseWriteGuard implements CanActivate {
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

    if (!canUserAccessCase(theCase, user, true)) {
      throw new ForbiddenException(
        `User ${user.id} does not have write access to case ${theCase.id}`,
      )
    }

    return true
  }
}
