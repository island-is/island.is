import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { Case, Defendant, Subpoena } from '../../repository'

/**
 * Replaces the subpoena on the request, and the defendant it summons, with
 * the copies of them the case on the request carries, matched by id.
 *
 * For a route that names the subpoena rather than the case - the police
 * service update, `PATCH subpoena/:policeSubpoenaId` - the subpoena has to be
 * looked up before the case can be, because the lookup is what supplies the
 * case id. That read happens before `CaseExistsForUpdateGuard` takes its lock,
 * so the subpoena's fields may be stale by the time the handler decides from
 * them; only the ids it was looked up by are immutable. The locked case loads
 * every subpoena of every defendant, and of the defendants that left with a
 * split case the subpoenas issued before the split - a subpoena stays with the
 * case it was issued in - so the same subpoena is on it with the fields as they
 * are under the lock, and that is the copy the handler should see. Runs after
 * the case guard, which is the order it depends on.
 */
@Injectable()
export class SubpoenaOnCaseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const subpoena: Subpoena = request.subpoena

    if (!subpoena) {
      throw new InternalServerErrorException('Missing subpoena')
    }

    const defendants: Defendant[] = [
      ...(theCase.defendants ?? []),
      ...(theCase.splitCases ?? []).flatMap(
        (splitCase) => splitCase.defendants ?? [],
      ),
    ]

    for (const defendant of defendants) {
      const subpoenaOnCase = defendant.subpoenas?.find(
        (candidate) => candidate.id === subpoena.id,
      )

      if (subpoenaOnCase) {
        request.defendant = defendant
        request.subpoena = subpoenaOnCase

        return true
      }
    }

    throw new NotFoundException(
      `Subpoena ${subpoena.id} is not on case ${theCase.id}`,
    )
  }
}
