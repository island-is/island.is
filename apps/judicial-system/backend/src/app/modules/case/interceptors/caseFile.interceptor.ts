import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseFileCategory,
  isPrisonStaffUser,
  isPrisonSystemUser,
  User,
} from '@island.is/judicial-system/types'

import { CaseFile } from '../../file'
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
          data.caseFiles?.splice(0, data.caseFiles.length)

          return data
        } else if (isPrisonSystemUser(user)) {
          data.caseFiles?.splice(
            0,
            data.caseFiles.length,
            ...data.caseFiles.filter(
              (cf) => cf.category === CaseFileCategory.APPEAL_RULING,
            ),
          )

          return returnData
        } else {
          return returnData
        }
      }),
    )
  }
}
