import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { Case } from '../models/case.model'

import { transformCase } from './case.transformer'

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case[]> {
    return next.handle().pipe(
      map((cases: Case[]) => {
        return cases.map((retCase) => {
          return transformCase(retCase)
        })
      }),
    )
  }
}
