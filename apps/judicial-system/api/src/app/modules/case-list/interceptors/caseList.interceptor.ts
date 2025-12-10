import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { isRequestCase } from '@island.is/judicial-system/types'

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
          if (isRequestCase(theCase.type)) {
            return {
              ...theCase,
              isValidToDateInThePast: theCase.validToDate
                ? Date.now() > new Date(theCase.validToDate).getTime()
                : theCase.isValidToDateInThePast,
            }
          }

          return theCase
        })
      }),
    )
  }
}
