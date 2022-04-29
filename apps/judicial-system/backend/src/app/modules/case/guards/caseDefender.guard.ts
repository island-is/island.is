import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

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
      !theCase.defenderNationalId ||
      user.nationalId !== theCase.defenderNationalId
    ) {
      throw new ForbiddenException(
        `User ${user.id} does not have read access to case ${theCase.id}`,
      )
    }

    return true
  }
}
