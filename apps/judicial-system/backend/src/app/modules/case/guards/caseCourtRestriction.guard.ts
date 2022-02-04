import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import { isInvestigationCase, UserRole } from '@island.is/judicial-system/types'

@Injectable()
export class CaseCourtRestrictionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (
      isInvestigationCase(theCase.type) &&
      ((user.role === UserRole.JUDGE && user.id !== theCase.judge?.id) ||
        (user.role === UserRole.REGISTRAR && user.id !== theCase.registrar?.id))
    ) {
      throw new ForbiddenException(
        'Court access to investigation cases is restricted to the assigned judge and registrar',
      )
    }

    return true
  }
}
