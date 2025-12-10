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
} from '@island.is/judicial-system/types'

import { Case, DateLog } from '../../repository'

@Injectable()
export class RequestSharedWithDefenderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    // Defender can always see the request if it's in a completed state
    if (isCompletedCase(theCase.state)) {
      return true
    }

    if (
      theCase.requestSharedWithDefender ===
        RequestSharedWithDefender.COURT_DATE &&
      Boolean(DateLog.arraignmentDate(theCase.dateLogs))
    ) {
      return true
    }

    if (
      theCase.requestSharedWithDefender ===
      RequestSharedWithDefender.READY_FOR_COURT
    ) {
      return true
    }

    throw new ForbiddenException(
      'Forbidden when request is not shared with defender',
    )
  }
}
