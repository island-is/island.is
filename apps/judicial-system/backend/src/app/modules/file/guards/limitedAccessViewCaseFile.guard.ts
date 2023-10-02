import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import {
  User,
  UserRole,
  availableCaseFileCategoriesForIndictmentCases,
  availableCaseFileCategoriesForRestrictionAndInvestigationCases,
  completedCaseStates,
  indictmentCases,
  investigationCases,
  restrictionCases,
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
        availableCaseFileCategoriesForRestrictionAndInvestigationCases.includes(
          caseFile.category,
        )
      ) {
        return true
      }

      if (
        indictmentCases.includes(theCase.type) &&
        availableCaseFileCategoriesForIndictmentCases.includes(
          caseFile.category,
        )
      ) {
        return true
      }
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
