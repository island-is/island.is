import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseAppealDecision,
  isRequestCase,
} from '@island.is/judicial-system/types'

import { getIndictmentInfo } from '../../case/interceptors/case.transformer'
import { CaseListEntry } from '../models/caseList.model'

const getAppealedDate = (
  prosecutorPostponedAppealDate?: string,
  accusedPostponedAppealDate?: string,
): string | undefined => {
  return prosecutorPostponedAppealDate ?? accusedPostponedAppealDate
}

const wasAcceptedInCourt = (
  prosecutorAppealDecision?: CaseAppealDecision,
  accusedAppealDecision?: CaseAppealDecision,
): boolean => {
  return (
    prosecutorAppealDecision === CaseAppealDecision.ACCEPT &&
    accusedAppealDecision === CaseAppealDecision.ACCEPT
  )
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
          if (isRequestCase(theCase.type)) {
            return {
              ...theCase,
              isValidToDateInThePast: theCase.validToDate
                ? Date.now() > new Date(theCase.validToDate).getTime()
                : theCase.isValidToDateInThePast,
              appealedDate: getAppealedDate(
                theCase.prosecutorPostponedAppealDate,
                theCase.accusedPostponedAppealDate,
              ),
              // This state overwrite is added in at least temporarily to handle strange
              // behaviour when a case is reopened after being appealed and then closed
              // again with everyone having accepted the ruling in court
              appealState: !wasAcceptedInCourt(
                theCase.prosecutorAppealDecision,
                theCase.accusedAppealDecision,
              )
                ? theCase.appealState
                : undefined,
            }
          }

          const { indictmentRulingDecision, rulingDate, defendants } = theCase

          const indictmentInfo = getIndictmentInfo({
            indictmentRulingDecision,
            rulingDate,
            defendants,
          })

          return {
            ...theCase,
            ...indictmentInfo,
          }
        })
      }),
    )
  }
}
