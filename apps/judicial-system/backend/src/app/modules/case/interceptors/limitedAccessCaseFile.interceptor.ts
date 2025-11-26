import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  getIndictmentAppealDeadline,
  ServiceRequirement,
  User,
} from '@island.is/judicial-system/types'

import { canLimitedAccessUserViewCaseFile } from '../../file'
import { Defendant } from '../../repository'

const transformDefendants = ({
  defendants,
  indictmentRulingDecision,
  rulingDate,
}: {
  defendants?: Defendant[]
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: Date
}) => {
  return defendants?.map((defendant) => {
    const { verdict } = defendant
    const isServiceRequired =
      verdict?.serviceRequirement === ServiceRequirement.REQUIRED
    const isFine =
      indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

    const baseDate = isServiceRequired ? verdict.serviceDate : rulingDate
    const { deadlineDate, isDeadlineExpired } = baseDate
      ? getIndictmentAppealDeadline({
          baseDate: new Date(baseDate),
          isFine,
        })
      : {}

    return {
      ...defendant.toJSON(),
      verdictAppealDeadline: deadlineDate,
      isVerdictAppealDeadlineExpired: isDeadlineExpired,
    }
  })
}

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
          }: {
            category: CaseFileCategory
            submittedBy: string
            fileRepresentative: string
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
            }),
        )

        return {
          ...theCase,
          caseFiles,
          defendants: transformDefendants({
            defendants: theCase.defendants,
            indictmentRulingDecision: theCase.indictmentRulingDecision,
            rulingDate: theCase.rulingDate,
          }),
        }
      }),
    )
  }
}
