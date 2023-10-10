import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseState,
  completedCaseStates,
  isIndictmentCase,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

@Injectable()
export class LimitedAccessAccordingToCaseStateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    // Defender can always see a completed case
    if (completedCaseStates.includes(theCase.state)) {
      return true
    }

    const canDefenderSeeSubmittedCase =
      theCase.requestSharedWithDefender ===
      RequestSharedWithDefender.READY_FOR_COURT

    if (theCase.state === CaseState.SUBMITTED && canDefenderSeeSubmittedCase) {
      return true
    }

    const canDefenderSeeReceivedCase = Boolean(
      canDefenderSeeSubmittedCase ||
        isIndictmentCase(theCase.type) ||
        theCase.courtDate,
    )

    if (theCase.state === CaseState.RECEIVED && canDefenderSeeReceivedCase) {
      return true
    }

    throw new ForbiddenException(
      'Forbidden for current status of limited access case',
    )
  }
}
