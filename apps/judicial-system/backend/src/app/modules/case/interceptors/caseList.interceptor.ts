import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { IndictmentDecision } from '@island.is/judicial-system/types'

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
            created: theCase.created,
            policeCaseNumbers: theCase.policeCaseNumbers,
            state: theCase.state,
            type: theCase.type,
            defendants: transformDefendants(theCase.defendants),
            courtCaseNumber: theCase.courtCaseNumber,
            decision: theCase.decision,
            validToDate: theCase.validToDate,
            courtDate: theCase.indictmentDecision
              ? theCase.indictmentDecision === IndictmentDecision.SCHEDULING
                ? DateLog.courtDate(theCase.dateLogs)?.date
                : undefined
              : DateLog.arraignmentDate(theCase.dateLogs)?.date,
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
            prosecutorsOffice: theCase.prosecutorsOffice,
            postponedIndefinitelyExplanation:
              CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
            indictmentReviewer: theCase.indictmentReviewer,
            indictmentReviewDecision: theCase.indictmentReviewDecision,
            indictmentDecision: theCase.indictmentDecision,
            indictmentRulingDecision: theCase.indictmentRulingDecision,
            courtSessionType: theCase.courtSessionType,
            eventLogs: theCase.eventLogs,
            court: theCase.court,
            caseSentToCourtDate: EventLog.caseSentToCourtEvent(
              theCase.eventLogs,
            )?.created,
            isRegisteredInPrisonSystem: theCase.isRegisteredInPrisonSystem,
            isCompletedWithoutRuling: theCase.isCompletedWithoutRuling,
            publicProsecutorIsRegisteredInPoliceSystem:
              theCase.publicProsecutorIsRegisteredInPoliceSystem,
          }
        }),
      ),
    )
  }
}
