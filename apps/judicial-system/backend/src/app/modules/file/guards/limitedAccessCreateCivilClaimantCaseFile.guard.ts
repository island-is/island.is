import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseFileCategory, User } from '@island.is/judicial-system/types'

import { CivilClaimant } from '../../repository'

const districtConfirmedCaseFileCategories = [
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
]

// Same DEFENDANT_ verdict-appeal categories as for defendants; the file's
// civilClaimantId says whose statement it is. Landsréttur confirmation of the
// appeal spokesperson is required — distinct from the district spokesperson.
const appealConfirmedCaseFileCategories = [
  CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
]

@Injectable()
export class LimitedAccessCreateCivilClaimantCaseFileGuard
  implements CanActivate
{
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user?.currentUser

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const civilClaimant: CivilClaimant = request.civilClaimant

    if (!civilClaimant) {
      throw new InternalServerErrorException('Missing civil claimant')
    }

    const caseFileCategory: CaseFileCategory | undefined =
      request.body?.category

    if (!caseFileCategory) {
      throw new BadRequestException('Missing case file category')
    }

    const isDistrictConfirmed =
      CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(user.nationalId, [
        civilClaimant,
      ])
    const isAppealConfirmed =
      CivilClaimant.isConfirmedAppealSpokespersonOfCivilClaimant(
        user.nationalId,
        [civilClaimant],
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
