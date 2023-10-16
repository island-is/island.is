import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

@Injectable()
export class LimitedAccessWriteCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    // The case file category is either in the request body (creating case file)
    // or in the case file (deleting case file)
    const caseFileCategory: CaseFileCategory =
      request.body?.category ?? request.caseFile?.category

    if (!caseFileCategory) {
      throw new InternalServerErrorException('Missing case file category')
    }

    if (
      user.role === UserRole.DEFENDER &&
      [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
      ].includes(caseFileCategory)
    ) {
      return true
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
