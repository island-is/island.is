import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { Case } from '../models/case.model'
import { CaseListEntry } from '../models/caseListEntry.response'

@Injectable()
export class CaseListInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<CaseListEntry[]> {
    return next.handle().pipe(
      map((cases: Case[]) => {
        return cases.map((theCase) => {
          // WARNING: Be careful when adding to this list. No sensitive information should be returned.
          // If you need to add sensitive information, then you should consider adding a new endpoint
          // for defenders and other user roles that are not allowed to see sensitive information.
          return {
            id: theCase.id,
            created: theCase.created,
            policeCaseNumbers: theCase.policeCaseNumbers,
            state: theCase.state,
            type: theCase.type,
            defendants: theCase.defendants,
            courtCaseNumber: theCase.courtCaseNumber,
            decision: theCase.decision,
            validToDate: theCase.validToDate,
            courtDate: theCase.courtDate,
            initialRulingDate: theCase.initialRulingDate,
            rulingDate: theCase.rulingDate,
            rulingSignatureDate: theCase.rulingSignatureDate,
            courtEndTime: theCase.courtEndTime,
            prosecutorAppealDecision: theCase.prosecutorAppealDecision,
            accusedAppealDecision: theCase.accusedAppealDecision,
            prosecutorPostponedAppealDate:
              theCase.prosecutorPostponedAppealDate,
            accusedPostponedAppealDate: theCase.accusedPostponedAppealDate,
            judge: theCase.judge,
            prosecutor: theCase.prosecutor,
            registrar: theCase.registrar,
            creatingProsecutor: theCase.creatingProsecutor,
            parentCaseId: theCase.parentCaseId,
            appealState: theCase.appealState,
            appealCaseNumber: theCase.appealCaseNumber,
            appealRulingDecision: theCase.appealRulingDecision,
            appealValidToDate: theCase.appealValidToDate,
          }
        })
      }),
    )
  }
}
