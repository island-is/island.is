import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import { isCaseBlockedFromUser } from '../filters'

@Injectable()
export class CaseWriteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    if (isCaseBlockedFromUser(theCase, user, true)) {
      throw new ForbiddenException(
        `User ${user.id} does not have write access to case ${theCase.id}`,
      )
    }

    return true
  }
}
