import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { AppealVerdict, Case } from '../../repository'

/**
 * Replaces the appeal verdict on the request with the copy carried by the
 * locked case. The external-police lookup that supplies the case id runs
 * before CaseExistsForUpdateGuard, so its fields may be stale; only the ids
 * are trustworthy until this swap. Case include loads appealVerdicts, so a
 * missing copy means the row is not on the locked case.
 */
@Injectable()
export class AppealVerdictOnCaseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const appealVerdict: AppealVerdict = request.appealVerdict

    if (!appealVerdict) {
      throw new InternalServerErrorException('Missing appeal verdict')
    }

    const appealVerdictOnCase = theCase.defendants
      ?.flatMap((defendant) => defendant.appealVerdicts ?? [])
      .find((candidate) => candidate.id === appealVerdict.id)

    if (!appealVerdictOnCase) {
      throw new NotFoundException(
        `Appeal verdict ${appealVerdict.id} is not on case ${theCase.id}`,
      )
    }

    request.appealVerdict = appealVerdictOnCase

    return true
  }
}
