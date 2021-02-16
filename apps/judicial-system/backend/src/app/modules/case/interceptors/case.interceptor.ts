import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { ForbiddenException } from '@nestjs/common'

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
export class CaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const user: User = context.switchToHttp().getRequest().user

    return next.handle().pipe(
      map((retCase: Case) => {
        if (isStateVisibleToRole(retCase.state, user?.role)) {
          return retCase
        } else {
          throw new ForbiddenException(
            `Role ${user?.role} cannot get a case in state ${retCase.state}`,
          )
        }
      }),
    )
  }
}
