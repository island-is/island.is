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
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'

const allowedCaseFileCategories = [
  CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
  CaseFileCategory.CRIMINAL_RECORD,
]

// The public prosecution office files the appeal declaration on behalf of a
// defender who appealed a verdict by letter or email, outside the system. Only
// the office: the route also admits prosecutors, who have no part in a
// defendant's appeal.
const publicProsecutionOfficeCaseFileCategories = [
  CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
  CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
]

// The court of appeals files a defendant's verdict appeal statement on the
// defendant's behalf when it arrives outside the system. Only the statement:
// the court has no part in the declaration, and nothing else of a defendant's
// is the court's to file.
const courtOfAppealsCaseFileCategories = [
  CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
]

@Injectable()
export class CreateDefendantCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User | undefined = request.user?.currentUser
    const caseFileCategory: CaseFileCategory = request.body?.category

    if (allowedCaseFileCategories.includes(caseFileCategory)) {
      return true
    }

    if (
      isPublicProsecutionOfficeUser(user) &&
      publicProsecutionOfficeCaseFileCategories.includes(caseFileCategory)
    ) {
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
