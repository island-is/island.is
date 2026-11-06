import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseFileCategory,
  isCourtOfAppealsUser,
} from '@island.is/judicial-system/types'

const allowedCaseFileCategories = [CaseFileCategory.CIVIL_CLAIM]

// The court of appeals files a civil claimant's verdict appeal statement on
// the claimant's behalf when it arrives outside the system. The claimant's
// statement goes in the DEFENDANT_ categories, as every civil claimant appeal
// file does; the file's civilClaimantId says whose it is.
const courtOfAppealsCaseFileCategories = [
  CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
]

@Injectable()
export class CreateCivilClaimantCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User | undefined = request.user?.currentUser
    const caseFileCategory: CaseFileCategory = request.body?.category

    if (allowedCaseFileCategories.includes(caseFileCategory)) {
      return true
    }

    if (
      isCourtOfAppealsUser(user) &&
      courtOfAppealsCaseFileCategories.includes(caseFileCategory)
    ) {
      return true
    }

    throw new ForbiddenException(
      `Forbidden for case file category ${caseFileCategory}`,
    )
  }
}
