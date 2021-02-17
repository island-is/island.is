import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case } from '../models'
import { isStateVisibleToRole } from './case.filter'

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case[]> {
    const user: User = context.switchToHttp().getRequest().user

    return next.handle().pipe(
      map((cases: Case[]) => {
        return cases.filter((retCase) =>
          isStateVisibleToRole(retCase.state, user?.role),
        )
      }),
    )
  }
}
