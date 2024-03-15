import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseState,
  EventType,
  isIndictmentCase,
  User,
} from '@island.is/judicial-system/types'

import { EventLogService } from '../../event-log'
import { Case } from '../models/case.model'

@Injectable()
export class TransitionInterceptor implements NestInterceptor {
  constructor(private readonly eventLogService: EventLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    return next.handle().pipe(
      map((data: Case) => {
        if (isIndictmentCase(data.type) && data.state === CaseState.SUBMITTED) {
          this.eventLogService.create({
            eventType: EventType.INDICTMENT_CONFIRMED,
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
