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
  isCompletedCase,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../repository'

@Injectable()
export class ViewCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user?.currentUser

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (isProsecutionUser(user)) {
      return true
    }

    if (isPublicProsecutionOfficeUser(user) && isCompletedCase(theCase.state)) {
      return true
    }

    if (
      isDistrictCourtUser(user) &&
      ([CaseState.SUBMITTED, CaseState.RECEIVED].includes(theCase.state) ||
        isCompletedCase(theCase.state))
    ) {
      return true
    }

    if (
      isCourtOfAppealsUser(user) &&
      isCompletedCase(theCase.state) &&
      theCase.appealState &&
      [
        CaseAppealState.RECEIVED,
        CaseAppealState.COMPLETED,
        CaseAppealState.WITHDRAWN,
      ].includes(theCase.appealState)
    ) {
      return true
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
