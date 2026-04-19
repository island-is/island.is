import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { CaseFileCategory, User } from '@island.is/judicial-system/types'

import { Defendant } from '../../repository'

const allowedCaseFileCategories = [
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
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

    // Verify the logged-in user is the confirmed defender for this defendant
    if (
      !defendant.isDefenderChoiceConfirmed ||
      !defendant.defenderNationalId ||
      !normalizeAndFormatNationalId(user.nationalId).includes(
        defendant.defenderNationalId,
      )
    ) {
      return false
    }

    const caseFileCategory: CaseFileCategory | undefined =
      request.body?.category

    if (!caseFileCategory) {
      throw new BadRequestException('Missing case file category')
    }

    if (allowedCaseFileCategories.includes(caseFileCategory)) {
      return true
    }

    return false
  }
}
