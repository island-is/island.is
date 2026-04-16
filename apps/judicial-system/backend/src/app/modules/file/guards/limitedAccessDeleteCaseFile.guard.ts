import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  isIndictmentCase,
  isRequestCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case, CaseFile } from '../../repository'

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

    if (user.role !== UserRole.DEFENDER) {
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
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
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
        theCase.defendants?.find(
          (d) =>
            d.id === caseFile.defendantId &&
            d.isDefenderChoiceConfirmed &&
            d.defenderNationalId === user.nationalId,
        )) ||
      (civilClaimantId &&
        theCase.civilClaimants?.find(
          (c) =>
            c.id === caseFile.civilClaimantId &&
            c.isSpokespersonConfirmed &&
            c.spokespersonNationalId === user.nationalId,
        ))
    ) {
      // The user controls this case file
      return [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
      ].includes(category)
    }

    return false
  }
}
