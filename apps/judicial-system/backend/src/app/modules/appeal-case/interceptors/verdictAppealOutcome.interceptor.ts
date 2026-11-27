import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { AppealCaseType, User } from '@island.is/judicial-system/types'

import { AppealCase } from '../../repository'
import { getVerdictAppealOutcomeOverride } from '../appealCase.helpers'

const presentAppealCase = (appealCase: AppealCase | undefined, user?: User) =>
  appealCase?.appealType === AppealCaseType.VERDICT
    ? {
        ...appealCase.toJSON<Record<string, unknown>>(),
        ...getVerdictAppealOutcomeOverride(appealCase, user),
      }
    : appealCase

// The appeal case routes return the stored appeal case row, or a list of them,
// which never passes through the case interceptor, so the court of appeals'
// conclusion of a verdict appeal is withheld from every other user here as
// well.
@Injectable()
export class VerdictAppealOutcomeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest()
    const user: User | undefined = request.user?.currentUser

    return next
      .handle()
      .pipe(
        map((result?: AppealCase | AppealCase[]) =>
          Array.isArray(result)
            ? result.map((appealCase) => presentAppealCase(appealCase, user))
            : presentAppealCase(result, user),
        ),
      )
  }
}
