import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import {
  completedCaseStates,
  User,
  UserRole,
  CaseFileCategory,
  restrictionCases,
  investigationCases,
  indictmentCases,
} from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { CaseFile } from '../models/file.model'

@Injectable()
export class LimitedAccessViewCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const caseFile: CaseFile = request.caseFile

    if (!caseFile) {
      throw new InternalServerErrorException('Missing case file')
    }

    if (
      user.role === UserRole.DEFENDER &&
      completedCaseStates.includes(theCase.state) &&
      caseFile.category
    ) {
      if (
        [...restrictionCases, ...investigationCases].includes(theCase.type) &&
        [
          CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
          CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
          CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
          CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        ].includes(caseFile.category)
      ) {
        return true
      }

      if (
        indictmentCases.includes(theCase.type) &&
        caseFile.category === CaseFileCategory.RULING
      ) {
        return true
      }
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
