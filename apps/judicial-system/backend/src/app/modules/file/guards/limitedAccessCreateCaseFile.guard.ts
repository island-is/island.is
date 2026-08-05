import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  isDefenceUser,
  isIndictmentCase,
  isRequestCase,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../repository'

@Injectable()
export class LimitedAccessCreateCaseFileGuard implements CanActivate {
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

    const caseFileCategory: CaseFileCategory | undefined =
      request.body?.category

    if (!caseFileCategory) {
      throw new BadRequestException('Missing case file category')
    }

    if (!isDefenceUser(user)) {
      // Only defence users can create limited access case files
      return false
    }

    if (isRequestCase(theCase.type)) {
      // Uploaded appeal defendant case files can be created by the defender
      // Only one defender and no civil claimants in request cases
      return [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
      ].includes(caseFileCategory)
    }

    if (!isIndictmentCase(theCase.type)) {
      // Other case types not allowed
      return false
    }

    // Defendant or civil claimant can create these case files
    return [
      CaseFileCategory.DEFENDANT_CASE_FILE,
      CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
      CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
    ].includes(caseFileCategory)
  }
}
