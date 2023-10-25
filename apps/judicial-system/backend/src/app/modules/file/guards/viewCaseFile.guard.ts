import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseAppealState,
  CaseState,
  completedCaseStates,
  isExtendedCourtRole,
  isPrisonSystemUser,
  isProsecutionRole,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../case'

@Injectable()
export class ViewCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    // TODO: Limit access based on a combination of
    // case type, case state, appeal case state and case file category
    // to get accurate case file permissions

    if (isProsecutionRole(user.role)) {
      return true
    }

    if (
      isExtendedCourtRole(user.role) &&
      [
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        ...completedCaseStates,
      ].includes(theCase.state)
    ) {
      return true
    }

    if (
      isPrisonSystemUser(user) &&
      theCase.appealState &&
      [CaseAppealState.COMPLETED].includes(theCase.appealState)
    ) {
      return true
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
