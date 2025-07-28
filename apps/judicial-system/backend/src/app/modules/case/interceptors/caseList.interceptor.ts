import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { EventType, IndictmentDecision } from '@island.is/judicial-system/types'

import { EventLog } from '../../event-log'
import { Case } from '../models/case.model'
import { CaseString } from '../models/caseString.model'
import { DateLog } from '../models/dateLog.model'
import { transformDefendants } from './case.interceptor'

@Injectable()
export class CaseListInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((cases: Case[]) =>
        cases.map((theCase) => {
          // WARNING: Be careful when adding to this list. No sensitive information should be returned.
          // If you need to add sensitive information, then you should consider adding a new endpoint
          // for defenders and other user roles that are not allowed to see sensitive information.
          return {
            id: theCase.id,
            type: theCase.type,
            state: theCase.state,
            courtDate: theCase.indictmentDecision
              ? theCase.indictmentDecision === IndictmentDecision.SCHEDULING
                ? DateLog.courtDate(theCase.dateLogs)?.date
                : undefined
              : DateLog.arraignmentDate(theCase.dateLogs)?.date,
            policeCaseNumbers: theCase.policeCaseNumbers,
            defendants: transformDefendants(theCase.defendants),
            courtCaseNumber: theCase.courtCaseNumber,
            decision: theCase.decision,
            validToDate: theCase.validToDate,
            initialRulingDate: theCase.initialRulingDate,
            rulingDate: theCase.rulingDate,
            accusedPostponedAppealDate: theCase.accusedPostponedAppealDate,
            parentCaseId: theCase.parentCaseId,
            appealState: theCase.appealState,
            appealCaseNumber: theCase.appealCaseNumber,
            appealRulingDecision: theCase.appealRulingDecision,
            postponedIndefinitelyExplanation:
              CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
            indictmentDecision: theCase.indictmentDecision,
            indictmentRulingDecision: theCase.indictmentRulingDecision,
            courtSessionType: theCase.courtSessionType,
            caseSentToCourtDate: EventLog.getEventLogDateByEventType(
              [EventType.CASE_SENT_TO_COURT, EventType.INDICTMENT_CONFIRMED],
              theCase.eventLogs,
            ),
          }
        }),
      ),
    )
  }
}
