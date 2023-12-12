import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  completedCaseStates,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

@Injectable()
export class RequestSharedWithDefenderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    // Defender can always see the request if it's in a completed state
    if (completedCaseStates.includes(theCase.state)) {
      return true
    }

    if (
      theCase.requestSharedWithDefender ===
        RequestSharedWithDefender.COURT_DATE &&
      Boolean(theCase.courtDate)
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
