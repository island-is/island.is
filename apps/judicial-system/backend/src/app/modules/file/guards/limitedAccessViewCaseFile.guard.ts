import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { CaseFile } from '../models/file.model'
import { canLimitedAcccessUserViewCaseFile } from './caseFileCategory'

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
      canLimitedAcccessUserViewCaseFile(
        user,
        theCase.type,
        theCase.state,
        caseFile.category,
      )
    ) {
      return true
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
