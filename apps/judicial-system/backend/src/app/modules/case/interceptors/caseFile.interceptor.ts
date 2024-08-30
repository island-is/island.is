import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { isPrisonStaffUser, User } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

@Injectable()
export class CaseFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    return next.handle().pipe(
      map((data: Case) => {
        const returnData = data

        if (isPrisonStaffUser(user)) {
          returnData.caseFiles = []

          return returnData
        }

        return returnData
      }),
    )
  }
}
