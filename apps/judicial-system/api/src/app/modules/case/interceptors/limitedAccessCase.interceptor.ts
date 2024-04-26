import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { Case } from '../models/case.model'
import { transformLimitedAccessCase } from './limitedAccessCase.transformer'

@Injectable()
export class LimitedAccessCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    return next.handle().pipe(
      map((retCase: Case) => {
        return transformLimitedAccessCase(retCase)
      }),
    )
  }
}
