import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseState,
  isCompletedCase,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  User,
} from '@island.is/judicial-system/types'

import { Case, CaseFile } from '../../repository'
import { canUserAccessCaseFileCategory } from './caseFileCategory'

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

    const caseFile: CaseFile | undefined = request.caseFile

    if (!canUserAccessCaseFileCategory(user, caseFile?.category)) {
      throw new ForbiddenException(`Forbidden for ${user.role}`)
    }

    if (isProsecutionUser(user)) {
      return true
    }

    if (isPublicProsecutionOfficeUser(user) && isCompletedCase(theCase.state)) {
      return true
    }

    if (
      (isDistrictCourtUser(user) || isCourtOfAppealsUser(user)) &&
      ([CaseState.SUBMITTED, CaseState.RECEIVED].includes(theCase.state) ||
        isCompletedCase(theCase.state))
    ) {
      return true
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
