import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { CaseListEntry } from '../models/caseList.model'

function getAppealedDate(
  prosecutorPostponedAppealDate?: string,
  accusedPostponedAppealDate?: string,
): string | undefined {
  return prosecutorPostponedAppealDate ?? accusedPostponedAppealDate
}

@Injectable()
export class CaseListInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<CaseListEntry[]> {
    return next.handle().pipe(
      map((cases: CaseListEntry[]) => {
        return cases.map((theCase) => {
          return {
            ...theCase,
            isValidToDateInThePast: theCase.validToDate
              ? Date.now() > new Date(theCase.validToDate).getTime()
              : theCase.isValidToDateInThePast,
            appealedDate: getAppealedDate(
              theCase.prosecutorPostponedAppealDate,
              theCase.accusedPostponedAppealDate,
            ),
          }
        })
      }),
    )
  }
}
