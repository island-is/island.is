import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
export class CourtSessionExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const courtSessionId = request.params.courtSessionId

    if (!courtSessionId) {
      throw new BadRequestException('Missing court session id')
    }

    const courtSession = theCase.courtSessions?.find(
      (courtSession) => courtSession.id === courtSessionId,
    )

    if (!courtSession) {
      throw new NotFoundException(
        `Court session ${courtSessionId} of case ${theCase.id} does not exist`,
      )
    }

    request.courtSession = courtSession

    return true
  }
}
