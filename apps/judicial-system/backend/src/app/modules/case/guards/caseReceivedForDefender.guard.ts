import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import {
  CaseState,
  completedCaseStates,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

@Injectable()
export class CaseReceivedForDefenderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (
      !(
        theCase.state === CaseState.RECEIVED &&
        (isIndictmentCase(theCase.type) ||
          (theCase.courtDate && theCase.sendRequestToDefender))
      ) &&
      !completedCaseStates.includes(theCase.state)
    ) {
      throw new ForbiddenException(
        'Forbidden for cases not received for defender',
      )
    }

    return true
  }
}
