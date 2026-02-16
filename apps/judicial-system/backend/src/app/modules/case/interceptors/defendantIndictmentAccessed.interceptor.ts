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
      // Read defendantIds from query parameters to only mark specific defendants.
      // For prison admin users, defendantIds must be explicitly provided to mark
      // any defendants. This prevents page-load refetches (which don't include
      // defendantIds) from inadvertently marking all defendants.
      const rawDefendantIds = request.query?.defendantIds
      const defendantIds = rawDefendantIds
        ? Array.isArray(rawDefendantIds)
          ? rawDefendantIds
          : [rawDefendantIds]
        : undefined

      if (defendantIds && defendantIds.length > 0) {
        const defendantsIndictmentNotOpened = theCase.defendants?.filter(
          ({ id, isSentToPrisonAdmin, eventLogs = [] }) =>
            isSentToPrisonAdmin &&
            !DefendantEventLog.hasValidOpenByPrisonAdminEvent(eventLogs) &&
            defendantIds.includes(id),
        )

        // create new events for the specific defendants that prison admin has accessed
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
    }
    return next.handle()
  }
}
