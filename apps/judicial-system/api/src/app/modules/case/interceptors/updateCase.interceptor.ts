import { Observable } from 'rxjs'

import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common'

import { UpdateCaseInput } from '../dto'
import { Case } from '../models'
import { CaseInterceptor } from './case.interceptor'

@Injectable()
export class UpdateCaseInterceptor extends CaseInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const input: UpdateCaseInput = context.getArgByIndex(1)?.input

    // The server must determine the appeal timestamps
    // TODO: Rewrite so the client does not need to send a dummy timestamp
    if (input?.accusedPostponedAppealDate) {
      input.accusedPostponedAppealDate = new Date().toISOString()
    }

    if (input?.prosecutorPostponedAppealDate) {
      input.prosecutorPostponedAppealDate = new Date().toISOString()
    }

    return super.intercept(context, next)
  }
}
