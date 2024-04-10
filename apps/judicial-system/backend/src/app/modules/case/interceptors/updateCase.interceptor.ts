import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { DateType } from '@island.is/judicial-system/types'

import { DateLogService } from '../../date-log'
import { Case } from '../models/case.model'

@Injectable()
export class UpdateCaseInterceptor implements NestInterceptor {
  constructor(private readonly dateLogService: DateLogService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Case | undefined> {
    const request = context.switchToHttp().getRequest()

    if (request.body.courtDate) {
      this.dateLogService.create({
        dateType: DateType.COURT_DATE,
        date: request.body.courtDate,
        caseId: request.params.caseId,
      })

      if (Object.keys(request.body).length === 1) {
        // Return an Observable that completes immediately
        return of(undefined)
      }

      delete request.body.courtDate
    }

    return next.handle()
  }
}
