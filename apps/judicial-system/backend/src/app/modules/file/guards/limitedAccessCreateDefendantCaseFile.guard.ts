import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseFileCategory, User } from '@island.is/judicial-system/types'

import { Defendant } from '../../repository'

const districtConfirmedCaseFileCategories = [
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
  CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
]

// Verdict-appeal greinargerð (and its attachments) requires Landsréttur's
// confirmation of the appeal advocate — distinct from the district defender.
const appealConfirmedCaseFileCategories = [
  CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
]

@Injectable()
export class LimitedAccessCreateDefendantCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user?.currentUser

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const defendant: Defendant = request.defendant

    if (!defendant) {
      throw new InternalServerErrorException('Missing defendant')
    }

    const caseFileCategory: CaseFileCategory | undefined =
      request.body?.category

    if (!caseFileCategory) {
      throw new BadRequestException('Missing case file category')
    }

    const isDistrictConfirmed = Defendant.isConfirmedDefenderOfDefendant(
      user.nationalId,
      [defendant],
    )
    const isAppealConfirmed = Defendant.isConfirmedAppealDefenderOfDefendant(
      user.nationalId,
      [defendant],
    )

    if (
      appealConfirmedCaseFileCategories.includes(caseFileCategory) &&
      isAppealConfirmed
    ) {
      return true
    }

    if (
      districtConfirmedCaseFileCategories.includes(caseFileCategory) &&
      isDistrictConfirmed
    ) {
      return true
    }

    return false
  }
}
