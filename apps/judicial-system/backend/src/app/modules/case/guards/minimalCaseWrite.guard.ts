import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { canUserAccessMinimalCase } from '../filters/case.filter'

// The write sibling of MinimalCaseAccessGuard, as CaseWriteGuard is of
// CaseReadGuard: it decides with forUpdate, so a prosecutor at the office a
// case is shared with - who may read the case - is refused here as they are
// on the full-case routes. Every route that mutates through a minimal case
// read takes this guard rather than the access guard.
@Injectable()
export class MinimalCaseWriteGuard implements CanActivate {
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

    if (!canUserAccessMinimalCase(theCase, user, true)) {
      throw new ForbiddenException(
        `User ${user.id} does not have write access to minimal case ${theCase.id}`,
      )
    }

    return true
  }
}
