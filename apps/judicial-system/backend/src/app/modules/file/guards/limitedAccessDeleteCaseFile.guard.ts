import {
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

import { Case, CaseFile, CivilClaimant, Defendant } from '../../repository'

@Injectable()
export class LimitedAccessDeleteCaseFileGuard implements CanActivate {
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

    const caseFile: CaseFile = request.caseFile

    if (!caseFile) {
      throw new InternalServerErrorException('Missing case file')
    }

    if (!isDefenceUser(user)) {
      // Only defence users can delete limited access case files
      return false
    }

    const { category, defendantId, civilClaimantId } = caseFile

    if (!category) {
      return false
    }

    if (isRequestCase(theCase.type)) {
      // Uploaded appeal defendant case files can be deleted by the defender
      // Only one defender and no civil claimants in request cases
      return [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
      ].includes(category)
    }

    if (!isIndictmentCase(theCase.type)) {
      // Other case types not allowed
      return false
    }

    if (
      (defendantId &&
        Defendant.isConfirmedDefenderOfDefendant(
          user.nationalId,
          theCase.defendants?.filter((d) => d.id === caseFile.defendantId),
        )) ||
      (civilClaimantId &&
        CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(
          user.nationalId,
          theCase.civilClaimants?.filter(
            (c) => c.id === caseFile.civilClaimantId,
          ),
        ))
    ) {
      // The user controls this case file
      return [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
      ].includes(category)
    }

    return false
  }
}
