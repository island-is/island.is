import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { Case } from '../models/case.model'
import { transformCase } from './case.transformer'

@Injectable()
export class CaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    return next.handle().pipe(
      map((retCase: Case) => {
        return transformCase(retCase)
      }),
    )
  }
}
