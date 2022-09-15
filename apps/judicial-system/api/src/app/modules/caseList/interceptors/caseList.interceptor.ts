import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

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
            isValidToDateInThePast: theCase.validToDate
              ? Date.now() > new Date(theCase.validToDate).getTime()
              : theCase.isValidToDateInThePast,
          }
        })
      }),
    )
  }
}
