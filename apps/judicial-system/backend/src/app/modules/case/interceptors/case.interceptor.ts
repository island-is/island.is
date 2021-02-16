import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  ForbiddenException,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case } from '../models'
import { isCaseBlockedFromUser } from '../filters'

@Injectable()
export class CaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const user: User = context.switchToHttp().getRequest().user

    return next.handle().pipe(
      map((retCase: Case) => {
        if (isCaseBlockedFromUser(retCase, user)) {
          throw new ForbiddenException(
            `Role ${user?.role} cannot get a case in state ${retCase.state}`,
          )
        }

        return retCase
      }),
    )
  }
}
