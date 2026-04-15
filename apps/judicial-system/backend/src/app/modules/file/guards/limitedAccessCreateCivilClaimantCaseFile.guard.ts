import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { CaseFileCategory, User } from '@island.is/judicial-system/types'

import { CivilClaimant } from '../../repository'

const allowedCaseFileCategories = [
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
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

    // Verify the logged-in user is the confirmed spokesperson for this civil claimant
    if (
      !civilClaimant.hasSpokesperson ||
      !civilClaimant.isSpokespersonConfirmed ||
      !civilClaimant.spokespersonNationalId ||
      !normalizeAndFormatNationalId(user.nationalId).includes(
        civilClaimant.spokespersonNationalId,
      )
    ) {
      throw new ForbiddenException(
        `User ${user.nationalId} is not the confirmed spokesperson of civil claimant ${civilClaimant.id}`,
      )
    }

    const caseFileCategory: CaseFileCategory = request.body?.category

    if (!allowedCaseFileCategories.includes(caseFileCategory)) {
      throw new ForbiddenException(
        `Forbidden for case file category ${caseFileCategory}`,
      )
    }

    return true
  }
}
