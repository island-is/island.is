import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { DefendantEventType } from '@island.is/judicial-system/types'

import { Defendant, DefendantEventLog } from '../../defendant'
import { EventLog } from '../../event-log'
import { Case } from '../models/case.model'
import { CaseString } from '../models/caseString.model'

export const transformDefendants = (defendants?: Defendant[]) => {
  return defendants?.map((defendant) => ({
    ...defendant.toJSON(),
    sentToPrisonAdminDate: defendant.isSentToPrisonAdmin
      ? DefendantEventLog.getDefendantEventLogTypeDate(
          DefendantEventType.SENT_TO_PRISON_ADMIN,
          defendant.eventLogs,
        )
      : undefined,
    openedByPrisonAdminDate: DefendantEventLog.getDefendantEventLogTypeDate(
      DefendantEventType.OPENED_BY_PRISON_ADMIN,
      defendant.eventLogs,
    ),
  }))
}

const transformCase = (theCase: Case) => {
  return {
    ...theCase.toJSON(),
    defendants: transformDefendants(theCase.defendants),
    postponedIndefinitelyExplanation:
      CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
    civilDemands: CaseString.civilDemands(theCase.caseStrings),
    caseSentToCourtDate: EventLog.caseSentToCourtEvent(theCase.eventLogs)
      ?.created,
  }
}

@Injectable()
export class CaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map(transformCase))
  }
}

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(
        map((cases: Case[]) => cases.map((theCase) => transformCase(theCase))),
      )
  }
}
