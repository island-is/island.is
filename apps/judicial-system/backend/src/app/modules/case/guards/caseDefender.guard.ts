import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { isIndictmentCase } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

@Injectable()
export class CaseDefenderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (
      isIndictmentCase(theCase.type)
        ? !theCase.defendants?.some(
            (defendant) => defendant.defenderNationalId === user.nationalId,
          )
        : theCase.defenderNationalId !== user.nationalId
    ) {
      throw new ForbiddenException(
        `User ${user.id} does not have access to case ${theCase.id}`,
      )
    }

    return true
  }
}
