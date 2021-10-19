import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { Case } from '../models'
import { transformCase } from './case.transformer'
import { maskCase } from './case.mask'

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case[]> {
    return next.handle().pipe(
      map((cases: Case[]) => {
        return cases.map((retCase) => {
          return maskCase(transformCase(retCase))
        })
      }),
    )
  }
}
