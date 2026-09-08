import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { CaseFileCategory } from '@island.is/judicial-system/types'

const allowedCaseFileCategories = [
  CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
  CaseFileCategory.CRIMINAL_RECORD,
  // The public prosecution office files the appeal declaration on behalf of a
  // defender who appealed a verdict by letter or email, outside the system.
  CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
  CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
]

@Injectable()
export class CreateDefendantCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const caseFileCategory: CaseFileCategory = request.body?.category

    if (!allowedCaseFileCategories.includes(caseFileCategory)) {
      throw new ForbiddenException(
        `Forbidden for case file category ${caseFileCategory}`,
      )
    }

    return true
  }
}
