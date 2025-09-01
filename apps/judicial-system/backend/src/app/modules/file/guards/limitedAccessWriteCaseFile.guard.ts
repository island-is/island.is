import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  isIndictmentCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../../repository'

@Injectable()
export class LimitedAccessWriteCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user?.currentUser

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    // The case file category is either in the request body (creating case file)
    // or in the case file (deleting case file)
    const caseFileCategory: CaseFileCategory =
      request.body?.category ?? request.caseFile?.category

    if (!caseFileCategory) {
      throw new InternalServerErrorException('Missing case file category')
    }

    if (user.role === UserRole.DEFENDER) {
      if (isIndictmentCase(theCase.type)) {
        if (
          [
            CaseFileCategory.DEFENDANT_CASE_FILE,
            CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
            CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
          ].includes(caseFileCategory)
        ) {
          return true
        }
      } else if (
        [
          CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
          CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        ].includes(caseFileCategory)
      ) {
        return true
      }
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
