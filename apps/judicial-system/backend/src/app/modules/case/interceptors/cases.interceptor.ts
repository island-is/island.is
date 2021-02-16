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
import {
  isProsecutorInstitutionHiddenFromUser,
  isStateHiddenFromRole,
} from './case.filters'

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case[]> {
    const user: User = context.switchToHttp().getRequest().user

    return next.handle().pipe(
      map((cases: Case[]) => {
        return cases.filter(
          (retCase) =>
            !isStateHiddenFromRole(retCase.state, user?.role) &&
            !isProsecutorInstitutionHiddenFromUser(
              retCase.prosecutor?.institutionId,
              user,
            ),
        )
      }),
    )
  }
}
