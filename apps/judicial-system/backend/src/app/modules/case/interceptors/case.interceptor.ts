import { Observable } from 'rxjs'
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
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { EventLogService } from '../../event-log'
import { Case } from '../models/case.model'

@Injectable()
export class CaseInterceptor implements NestInterceptor {
  constructor(private readonly eventLogService: EventLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    return next.handle().pipe(
      map((data: Case) => {
        if (
          data.appealState === CaseAppealState.COMPLETED &&
          [
            UserRole.PROSECUTOR,
            UserRole.DEFENDER,
            UserRole.PRISON_SYSTEM_STAFF,
          ].includes(user.role)
        ) {
          this.eventLogService.create({
            eventType: EventType.APPEAL_RESULT_ACCESSED,
            caseId: data.id,
            nationalId: user.nationalId,
            userRole: user.role,
          })
        }
        return data
      }),
    )
  }
}
