import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { Case, Verdict } from '../../repository'

/**
 * Replaces the verdict on the request with the copy of it the case on the
 * request carries, matched by id.
 *
 * For a route that names the verdict rather than the case - the police
 * delivery update, `PATCH verdict/:policeDocumentId` - the verdict has to be
 * looked up before the case can be, because the lookup is what supplies the
 * case id. That read happens before `CaseExistsForUpdateGuard` takes its lock,
 * so the verdict's fields may be stale by the time the handler decides from
 * them; only the ids it was looked up by are immutable. The locked case loads
 * every verdict of every defendant, so the same verdict is on it with the
 * fields as they are under the lock, and that is the copy the handler should
 * see. Runs after the case guard, which is the order it depends on.
 */
@Injectable()
export class VerdictOnCaseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const verdict: Verdict = request.verdict

    if (!verdict) {
      throw new InternalServerErrorException('Missing verdict')
    }

    const verdictOnCase = theCase.defendants
      ?.flatMap((defendant) => defendant.verdicts ?? [])
      .find((candidate) => candidate.id === verdict.id)

    if (!verdictOnCase) {
      throw new NotFoundException(
        `Verdict ${verdict.id} is not on case ${theCase.id}`,
      )
    }

    request.verdict = verdictOnCase

    return true
  }
}
