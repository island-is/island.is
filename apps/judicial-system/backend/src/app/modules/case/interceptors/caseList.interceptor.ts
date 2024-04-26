import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { DateType } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

@Injectable()
export class CaseListInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((cases: Case[]) =>
        cases.map((theCase) => {
          // WARNING: Be careful when adding to this list. No sensitive information should be returned.
          // If you need to add sensitive information, then you should consider adding a new endpoint
          // for defenders and other user roles that are not allowed to see sensitive information.

          const latestDate = theCase.dateLogs?.find((d) =>
            [DateType.ARRAIGNMENT_DATE, DateType.COURT_DATE].includes(
              d.dateType,
            ),
          )?.date

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
            courtDate: latestDate,
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
          }
        }),
      ),
    )
  }
}
