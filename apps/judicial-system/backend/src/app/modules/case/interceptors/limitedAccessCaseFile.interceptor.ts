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
  getDefenceUserVisiblePoliceCaseNumbers,
  isRulingOrderInConfirmedCourtSession,
} from '../../file'
import { CivilClaimant, Defendant } from '../../repository'

@Injectable()
export class LimitedAccessCaseFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user?.currentUser

    return next.handle().pipe(
      map((theCase) => {
        const caseFiles = theCase.caseFiles?.filter(
          ({
            id,
            category,
            submittedBy,
            fileRepresentative,
            defendantId,
            created,
            civilClaimantId,
          }: {
            id: string
            category: CaseFileCategory
            submittedBy: string
            fileRepresentative: string
            defendantId?: string
            created?: Date
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
              fileCreated: created,
              civilClaimantId,
              isRulingOrderInConfirmedCourtSession:
                isRulingOrderInConfirmedCourtSession(id, theCase.courtSessions),
            }),
        )

        let policeCaseNumbers = theCase.policeCaseNumbers

        if (
          isDefenceUser(user) &&
          isIndictmentCase(theCase.type) &&
          theCase.policeCaseNumbers &&
          (Defendant.isConfirmedDefenderOfDefendant(
            user.nationalId,
            theCase.defendants,
          ) ||
            CivilClaimant.isConfirmedSpokespersonOfCivilClaimantWithCaseFileAccess(
              user.nationalId,
              theCase.civilClaimants,
            ))
        ) {
          policeCaseNumbers = getDefenceUserVisiblePoliceCaseNumbers(
            user.nationalId,
            theCase.defendants,
            theCase.civilClaimants,
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
