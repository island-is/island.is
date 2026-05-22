import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseFileCategory,
  isDefenceUser,
  isIndictmentCase,
  User,
} from '@island.is/judicial-system/types'

import {
  canLimitedAccessUserViewCaseFile,
  getDefenderVisiblePoliceCaseNumbers,
} from '../../file'
import { Defendant } from '../../repository'

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
            civilClaimantId,
          }: {
            category: CaseFileCategory
            submittedBy: string
            fileRepresentative: string
            defendantId?: string
            civilClaimantId?: string | null
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
              civilClaimantId,
            }),
        )

        let policeCaseNumbers = theCase.policeCaseNumbers

        if (
          isDefenceUser(user) &&
          isIndictmentCase(theCase.type) &&
          theCase.policeCaseNumbers &&
          Defendant.isConfirmedDefenderOfDefendant(
            user.nationalId,
            theCase.defendants,
          )
        ) {
          policeCaseNumbers = getDefenderVisiblePoliceCaseNumbers(
            user.nationalId,
            theCase.defendants,
            theCase.policeCaseNumbers,
          )
        }

        return {
          ...theCase,
          caseFiles,
          policeCaseNumbers,
        }
      }),
    )
  }
}
