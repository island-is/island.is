import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case, CaseFile } from '../../repository'
import { canLimitedAccessUserViewCaseFile } from './caseFileCategory'

@Injectable()
export class LimitedAccessViewCaseFileGuard implements CanActivate {
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

    const caseFile: CaseFile = request.caseFile

    if (!caseFile) {
      throw new InternalServerErrorException('Missing case file')
    }

    // If the user is accessing a case file from a merged case,
    // then the parent case is used for access control
    const accessControlCase: Case = request.mergedCaseParent ?? theCase

    if (
      canLimitedAccessUserViewCaseFile({
        user,
        caseType: accessControlCase.type,
        caseState: accessControlCase.state,
        submittedBy: caseFile.submittedBy,
        fileRepresentative: caseFile.fileRepresentative,
        caseFileCategory: caseFile.category,
        defendants: accessControlCase.defendants,
        civilClaimants: accessControlCase.civilClaimants,
        defendantId: caseFile.defendantId,
      })
    ) {
      return true
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
