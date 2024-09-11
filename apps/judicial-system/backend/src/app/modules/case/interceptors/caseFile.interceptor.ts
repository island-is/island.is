import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseAppealState,
  CaseFileCategory,
  isDefenceUser,
  isIndictmentCase,
  isPrisonStaffUser,
  isPrisonSystemUser,
  isRestrictionCase,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

@Injectable()
export class CaseFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    return next.handle().pipe(
      map((data: Case) => {
        if (isDefenceUser(user)) {
          return data
        }

        if (
          isPrisonStaffUser(user) ||
          (isRestrictionCase(data.type) &&
            data.appealState !== CaseAppealState.COMPLETED)
        ) {
          data.caseFiles?.splice(0, data.caseFiles.length)
        } else if (isPrisonSystemUser(user)) {
          data.caseFiles?.splice(
            0,
            data.caseFiles.length,
            ...data.caseFiles.filter((cf) =>
              isIndictmentCase(data.type)
                ? cf.category === CaseFileCategory.RULING
                : cf.category === CaseFileCategory.APPEAL_RULING,
            ),
          )
        }

        return data
      }),
    )
  }
}
