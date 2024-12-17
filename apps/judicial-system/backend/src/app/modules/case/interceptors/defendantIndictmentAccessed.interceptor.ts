import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  DefendantEventType,
  isIndictmentCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { DefendantEventLog, DefendantService } from '../../defendant'
import { Case } from '../models/case.model'

const hasValidOpenByPrisonAdminEvent = (
  defendantEventLogs: DefendantEventLog[],
) => {
  const sentToPrisonAdminDate = DefendantEventLog.getDefendantEventLogTypeDate({
    defendantEventLogs,
    eventType: DefendantEventType.SENT_TO_PRISON_ADMIN,
  })
  const openedByPrisonAdminDate =
    DefendantEventLog.getDefendantEventLogTypeDate({
      defendantEventLogs,
      eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN,
    })
  return (
    sentToPrisonAdminDate &&
    openedByPrisonAdminDate &&
    sentToPrisonAdminDate < openedByPrisonAdminDate
  )
}
@Injectable()
export class DefendantIndictmentAccessedInterceptor implements NestInterceptor {
  constructor(private readonly defendantService: DefendantService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user
    const theCase: Case = request.case

    if (
      isIndictmentCase(theCase.type) &&
      user.role === UserRole.PRISON_SYSTEM_STAFF
    ) {
      const defendants = theCase.defendants?.filter(
        ({ isSentToPrisonAdmin }) => isSentToPrisonAdmin,
      )
      const defendantsIndictmentNotOpened = defendants?.filter(
        ({ eventLogs = [] }) => !hasValidOpenByPrisonAdminEvent(eventLogs),
      )

      // create new events for all defendants that prison admin has not accessed according to defendant event logs
      defendantsIndictmentNotOpened?.forEach((defendant) =>
        this.defendantService.createDefendantEvent({
          caseId: theCase.id,
          defendantId: defendant.id,
          eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN,
        }),
      )
    }
    return next.handle()
  }
}
