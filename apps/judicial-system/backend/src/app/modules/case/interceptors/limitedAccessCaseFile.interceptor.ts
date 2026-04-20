import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { CaseFileCategory, User } from '@island.is/judicial-system/types'

import { canLimitedAccessUserViewCaseFile } from '../../file'

@Injectable()
export class LimitedAccessCaseFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user?.currentUser

    return next.handle().pipe(
      map((theCase) => {
        const caseFiles = theCase.caseFiles?.filter(
          ({
            category,
            submittedBy,
            fileRepresentative,
            defendantId,
          }: {
            category: CaseFileCategory
            submittedBy: string
            fileRepresentative: string
            defendantId?: string
          }) =>
            canLimitedAccessUserViewCaseFile({
              user,
              caseType: theCase.type,
              caseState: theCase.state,
              submittedBy,
              fileRepresentative,
              caseFileCategory: category,
              defendants: theCase.defendants,
              civilClaimants: theCase.civilClaimants,
              defendantId,
            }),
        )

        return {
          ...theCase,
          caseFiles,
        }
      }),
    )
  }
}
