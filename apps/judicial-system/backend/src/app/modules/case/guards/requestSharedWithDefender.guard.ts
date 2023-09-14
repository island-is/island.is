import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import {
  RequestSharedWithDefender,
  completedCaseStates,
} from '@island.is/judicial-system/types'

@Injectable()
export class RequestSharedWithDefenderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const isCaseStateCompleted = completedCaseStates.includes(theCase.state)
    const canDefenderSeeRequest = Boolean(theCase.requestSharedWithDefender)
    const canDefenderSeeRequestBeforeCourtDate =
      theCase.requestSharedWithDefender ===
      RequestSharedWithDefender.READY_FOR_COURT
    const isCourtDateSet = Boolean(theCase.courtDate)

    if (
      isCaseStateCompleted ||
      (canDefenderSeeRequest &&
        (isCourtDateSet || canDefenderSeeRequestBeforeCourtDate))
    ) {
      return true
    }

    throw new ForbiddenException(
      'Forbidden when request is not shared with defender',
    )
  }
}
