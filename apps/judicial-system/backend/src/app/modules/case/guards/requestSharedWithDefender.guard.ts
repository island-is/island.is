import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  isCompletedCase,
  RequestSharedWithDefender,
  type User,
} from '@island.is/judicial-system/types'

import { getMostPermissiveRequestSharedWithDefenderForNationalId } from '../../defendant/requestSharedWithDefender.logic'
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

    // Defender can always see the request if it's in a completed state
    if (isCompletedCase(theCase.state)) {
      return true
    }

    const requestSharedWithDefender =
      getMostPermissiveRequestSharedWithDefenderForNationalId(
        theCase.defendants,
        user?.nationalId,
      )

    if (
      requestSharedWithDefender === RequestSharedWithDefender.COURT_DATE &&
      Boolean(DateLog.arraignmentDate(theCase.dateLogs))
    ) {
      return true
    }

    if (
      requestSharedWithDefender === RequestSharedWithDefender.READY_FOR_COURT
    ) {
      return true
    }

    throw new ForbiddenException(
      'Forbidden when request is not shared with defender',
    )
  }
}
