import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { AppealCase } from '../../repository'

// Resolves the session named in the URL on the appeal AppealCaseExistsGuard
// has already matched to the case, so a session of another appeal is not
// found through this one's route.
@Injectable()
export class AppealCourtSessionExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const appealCase: AppealCase = request.appealCase

    if (!appealCase) {
      throw new InternalServerErrorException('Missing appeal case')
    }

    const appealCourtSessionId = request.params.appealCourtSessionId

    if (!appealCourtSessionId) {
      throw new BadRequestException('Missing appeal court session id')
    }

    const appealCourtSession = appealCase.courtSessions?.find(
      (session) => session.id === appealCourtSessionId,
    )

    if (!appealCourtSession) {
      throw new NotFoundException(
        `Appeal court session ${appealCourtSessionId} not found for appeal case ${appealCase.id}`,
      )
    }

    request.appealCourtSession = appealCourtSession

    return true
  }
}
