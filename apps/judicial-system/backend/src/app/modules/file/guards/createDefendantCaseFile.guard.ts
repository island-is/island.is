import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseFileCategory,
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

    throw new ForbiddenException(
      `Forbidden for case file category ${caseFileCategory}`,
    )
  }
}
