import { Sequelize } from 'sequelize-typescript'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import {
  DefendantEventType,
  isIndictmentCase,
  isPrisonAdminUser,
  User,
} from '@island.is/judicial-system/types'

import { DefendantService } from '../../defendant'
import { Case, DefendantEventLog } from '../../repository'

const hasValidOpenByPrisonAdminEvent = (
  defendantEventLogs: DefendantEventLog[],
) => {
  const sentToPrisonAdminDate = DefendantEventLog.getEventLogDateByEventType(
    DefendantEventType.SENT_TO_PRISON_ADMIN,
    defendantEventLogs,
  )
  const openedByPrisonAdminDate = DefendantEventLog.getEventLogDateByEventType(
    DefendantEventType.OPENED_BY_PRISON_ADMIN,
    defendantEventLogs,
  )
  return (
    sentToPrisonAdminDate &&
    openedByPrisonAdminDate &&
    sentToPrisonAdminDate <= openedByPrisonAdminDate
  )
}

@Injectable()
export class DefendantIndictmentAccessedInterceptor implements NestInterceptor {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly defendantService: DefendantService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user?.currentUser
    const theCase: Case = request.case

    if (isIndictmentCase(theCase.type) && isPrisonAdminUser(user)) {
      const defendantsIndictmentNotOpened = theCase.defendants?.filter(
        ({ isSentToPrisonAdmin, eventLogs = [] }) =>
          isSentToPrisonAdmin && !hasValidOpenByPrisonAdminEvent(eventLogs),
      )

      // create new events for all defendants that prison admin has not accessed according to defendant event logs
      defendantsIndictmentNotOpened?.forEach((defendant) =>
        this.sequelize
          .transaction((transaction) =>
            this.defendantService.createDefendantEvent(
              {
                caseId: theCase.id,
                defendantId: defendant.id,
                eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN,
              },
              transaction,
            ),
          )
          .catch((reason) => {
            // Log the error but do not fail the request
            console.error(
              `Failed to create ${DefendantEventType.OPENED_BY_PRISON_ADMIN} event for defendant ${defendant.id} in case ${theCase.id}`,
              { reason },
            )
          }),
      )
    }
    return next.handle()
  }
}
