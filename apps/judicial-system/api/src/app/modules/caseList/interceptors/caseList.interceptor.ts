import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  getAppealedDate,
  useAppealValidToDates,
} from '@island.is/judicial-system/types'

import { CaseListEntry } from '../models/caseList.model'

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
            isValidToDateInThePast:
              useAppealValidToDates(
                theCase.decision,
                theCase.state,
                theCase.appealRulingDecision,
                theCase.appealState,
              ) && theCase.appealValidToDate
                ? Date.now() > new Date(theCase.appealValidToDate).getTime()
                : theCase.validToDate
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
