import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  completedCaseStates,
  indictmentCases,
  investigationCases,
  isDefenceUser,
  isPrisonSystemUser,
  limitedAccessCaseFileCategoriesForIndictmentCases,
  limitedAccessCaseFileCategoriesForRestrictionAndInvestigationCases,
  restrictionCases,
  User,
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

    if (completedCaseStates.includes(theCase.state) && caseFile.category) {
      if (isDefenceUser(user)) {
        if (
          [...restrictionCases, ...investigationCases].includes(theCase.type) &&
          limitedAccessCaseFileCategoriesForRestrictionAndInvestigationCases.includes(
            caseFile.category,
          )
        ) {
          return true
        }

        if (
          indictmentCases.includes(theCase.type) &&
          limitedAccessCaseFileCategoriesForIndictmentCases.includes(
            caseFile.category,
          )
        ) {
          return true
        }
      } else if (isPrisonSystemUser(user)) {
        if (caseFile.category === CaseFileCategory.APPEAL_RULING) {
          return true
        }
      }
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
