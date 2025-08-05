import { mergeMap } from 'rxjs/operators'
import { Sequelize } from 'sequelize-typescript'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import {
  CaseAppealState,
  EventType,
  isDefenceUser,
  isPrisonStaffUser,
  isProsecutionUser,
  User,
} from '@island.is/judicial-system/types'

import { EventLogService } from '../../event-log'

@Injectable()
export class CompletedAppealAccessedInterceptor implements NestInterceptor {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly eventLogService: EventLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user?.currentUser

    return next.handle().pipe(
      mergeMap(async (data) => {
        if (
          data.appealState === CaseAppealState.COMPLETED &&
          (isProsecutionUser(user) ||
            isDefenceUser(user) ||
            isPrisonStaffUser(user))
        ) {
          await this.sequelize.transaction(async (transaction) => {
            return this.eventLogService.createWithUser(
              EventType.APPEAL_RESULT_ACCESSED,
              data.id,
              user,
              transaction,
            )
          })
        }

        return data
      }),
    )
  }
}
