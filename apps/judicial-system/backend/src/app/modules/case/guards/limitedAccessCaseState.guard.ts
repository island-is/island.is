import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import {
  CaseState,
  RequestSharedWithDefender,
  completedCaseStates,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

@Injectable()
export class LimitedAccessCaseStateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const isCaseStateCompleted = completedCaseStates.includes(theCase.state)

    const canDefenderSeeSubmittedCase =
      theCase.requestSharedWithDefender ===
      RequestSharedWithDefender.READY_FOR_COURT

    const canDefenderSeeReceivedCase = Boolean(
      canDefenderSeeSubmittedCase ||
        isIndictmentCase(theCase.type) ||
        theCase.courtDate,
    )

    if (
      isCaseStateCompleted ||
      (theCase.state === CaseState.SUBMITTED && canDefenderSeeSubmittedCase) ||
      (theCase.state === CaseState.RECEIVED && canDefenderSeeReceivedCase)
    ) {
      return true
    }

    throw new ForbiddenException(
      'Forbidden for current status of limited access case',
    )
  }
}
