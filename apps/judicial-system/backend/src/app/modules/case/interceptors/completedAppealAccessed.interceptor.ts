import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

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
  constructor(private readonly eventLogService: EventLogService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user?.currentUser

    return next.handle().pipe(
      map((data) => {
        if (
          data.appealState === CaseAppealState.COMPLETED &&
          (isProsecutionUser(user) ||
            isDefenceUser(user) ||
            isPrisonStaffUser(user))
        ) {
          this.eventLogService.createWithUser(
            EventType.APPEAL_RESULT_ACCESSED,
            data.id,
            user,
          )
        }

        return data
      }),
    )
  }
}
