import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { CaseFileCategory } from '@island.is/judicial-system/types'

@Injectable()
export class CreateCivilClaimantCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const caseFileCategory: CaseFileCategory = request.body?.category

    if (caseFileCategory !== CaseFileCategory.CIVIL_CLAIM) {
      throw new ForbiddenException(
        `Forbidden for case file category ${caseFileCategory}`,
      )
    }

    return true
  }
}
