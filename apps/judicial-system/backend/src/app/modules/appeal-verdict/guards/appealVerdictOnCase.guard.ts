import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

// After CaseExistsForUpdateGuard locks the case, swap the appeal verdict for
// the copy carried on that locked include when present so later status writes
// do not decide from a pre-lock read.
@Injectable()
export class AppealVerdictOnCaseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const theCase = request.case as Case | undefined
    const appealVerdict = request.appealVerdict

    if (!appealVerdict) {
      throw new BadRequestException('Missing appeal verdict on request')
    }

    if (!theCase) {
      throw new BadRequestException('Missing case on request')
    }

    const locked =
      theCase.defendants
        ?.flatMap((defendant) => defendant.appealVerdicts ?? [])
        .find((row) => row.id === appealVerdict.id) ?? undefined

    if (locked) {
      request.appealVerdict = locked
      return true
    }

    // Case include may not yet load appealVerdicts; keep the earlier read.
    if (appealVerdict.caseId !== theCase.id) {
      throw new NotFoundException(
        `Appeal verdict ${appealVerdict.id} was not found on case ${theCase.id}`,
      )
    }

    return true
  }
}
