import { Observable, of } from 'rxjs'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { DateType } from '@island.is/judicial-system/types'

import { DateLogService } from '../../date-log'
import { CaseService } from '../case.service'
import { Case } from '../models/case.model'

@Injectable()
export class UpdateCaseInterceptor implements NestInterceptor {
  constructor(
    private readonly dateLogService: DateLogService,
    private readonly caseService: CaseService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Case | undefined>> {
    const request = context.switchToHttp().getRequest()

    if (request.body.courtDate) {
      this.dateLogService.create({
        dateType: DateType.COURT_DATE,
        date: request.body.courtDate,
        caseId: request.params.caseId,
      })

      if (Object.keys(request.body).length === 1) {
        const caseById = await this.caseService.findById(request.case.id)
        return of(caseById)
      }

      delete request.body.courtDate
    }

    return next.handle()
  }
}
