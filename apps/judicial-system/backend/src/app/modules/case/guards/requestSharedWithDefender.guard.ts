import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { type User } from '@island.is/judicial-system/types'

import { isRequestSharedWithDefender } from '../../defendant'
import { Case, DateLog } from '../../repository'

@Injectable()
export class RequestSharedWithDefenderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case
    const user: User | undefined = request.user?.currentUser

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (
      isRequestSharedWithDefender({
        state: theCase.state,
        defendants: theCase.defendants,
        nationalId: user?.nationalId,
        hasArraignmentDate: Boolean(DateLog.arraignmentDate(theCase.dateLogs)),
      })
    ) {
      return true
    }

    throw new ForbiddenException(
      'Forbidden when request is not shared with defender',
    )
  }
}
