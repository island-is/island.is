import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import {
  CaseState,
  completedCaseStates,
  User,
  UserRole,
  isProsecutionRole,
  isExtendedCourtRole,
  CaseFileCategory,
} from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { CaseFile } from '../models/file.model'

@Injectable()
export class ViewCaseFileGuard implements CanActivate {
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

    // TODO: Limit access based on a combination of
    // case type, case state, appeal case state and case file category
    // to get accurate case file permissions

    // Prosecutors have permission to view all case files
    if (isProsecutionRole(user.role)) {
      return true
    }

    // Judges, registrars and assistants have permission to view files of
    // submitted, received and completed cases
    if (
      isExtendedCourtRole(user.role) &&
      [
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        ...completedCaseStates,
      ].includes(theCase.state)
    ) {
      return true
    }

    const caseFile: CaseFile = request.caseFile

    if (!caseFile) {
      throw new InternalServerErrorException('Missing case file')
    }

    // Defenders have permission to view rulings of completed cases
    if (
      user.role === UserRole.DEFENDER &&
      completedCaseStates.includes(theCase.state) &&
      caseFile.category === CaseFileCategory.RULING
    ) {
      return true
    }

    // Other users do not have permission to view any case files
    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
