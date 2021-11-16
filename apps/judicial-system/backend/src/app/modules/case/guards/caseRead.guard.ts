import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'

import { isCaseBlockedFromUser } from '../filters'

@Injectable()
export class CaseReadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    if (isCaseBlockedFromUser(theCase, user, false)) {
      throw new ForbiddenException(
        `User ${user.id} does not have read access to case ${theCase.id}`,
      )
    }

    return true
  }
}
