import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  DefendantEventType,
  EventType,
  getIndictmentAppealDeadline,
  isDefenceUser,
  isPrisonSystemUser,
  isProsecutionUser,
  isRequestCase,
  ServiceRequirement,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  Case,
  CaseString,
  CivilClaimant,
  Defendant,
  DefendantEventLog,
  EventLog,
} from '../../repository'

export const transformDefendants = ({
  defendants,
  indictmentRulingDecision,
  rulingDate,
}: {
  defendants?: Defendant[]
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: Date
}) => {
  return defendants?.map((defendant) => {
    // Only the latest verdict is relevant
    const { verdicts } = defendant
    const verdict = verdicts?.[0]
    const isServiceRequired =
      verdict?.serviceRequirement === ServiceRequirement.REQUIRED
    const isFine =
      indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

    const baseDate = isServiceRequired ? verdict.serviceDate : rulingDate
    const appealDeadlineResult = baseDate
      ? getIndictmentAppealDeadline({
          baseDate: new Date(baseDate),
          isFine,
        })
      : undefined
    const appealDeadline = appealDeadlineResult?.deadlineDate
    const isAppealDeadlineExpired =
      appealDeadlineResult?.isDeadlineExpired ?? false

    return {
      ...defendant.toJSON(),
      ...(verdict
        ? {
            verdict: {
              ...verdict.toJSON(),
              verdictDeliveredToNationalCommissionersOffice:
                DefendantEventLog.getEventLogDateByEventType(
                  DefendantEventType.VERDICT_DELIVERED_TO_NATIONAL_COMMISSIONERS_OFFICE,
                  defendant.eventLogs,
                ),
            },
          }
        : {}),
      verdicts: undefined,
      verdictAppealDeadline: appealDeadline,
      isVerdictAppealDeadlineExpired: isAppealDeadlineExpired,
      sentToPrisonAdminDate: defendant.isSentToPrisonAdmin
        ? DefendantEventLog.getEventLogDateByEventType(
            DefendantEventType.SENT_TO_PRISON_ADMIN,
            defendant.eventLogs,
          )
        : undefined,
      openedByPrisonAdminDate: DefendantEventLog.getEventLogDateByEventType(
        DefendantEventType.OPENED_BY_PRISON_ADMIN,
        defendant.eventLogs,
      ),
    }
  })
}

const transformCaseRepresentatives = (theCase: Case) => {
  const { prosecutor, civilClaimants } = theCase
  const prosecutorRepresentativeProps =
    prosecutor?.name && prosecutor?.nationalId
      ? {
          name: prosecutor.name,
          nationalId: prosecutor.nationalId,
          caseFileCategory: CaseFileCategory.PROSECUTOR_CASE_FILE,
        }
      : undefined

  const civilClaimantSpokespersons = civilClaimants?.map((civilClaimant) => {
    const { spokespersonName, spokespersonNationalId, spokespersonIsLawyer } =
      civilClaimant
    if (!spokespersonName) return undefined

    return {
      name: spokespersonName,
      nationalId: spokespersonNationalId,
      caseFileCategory: spokespersonIsLawyer
        ? CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE
        : CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
    }
  })

  const defendantsAndDefenders = theCase.defendants?.flatMap((defendant) => {
    const defendantAndDefender = [
      {
        name: defendant.name ?? '',
        nationalId: defendant.nationalId,
        caseFileCategory: CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
      },
    ]
    if (defendant.defenderName) {
      defendantAndDefender.push({
        name: defendant.defenderName ?? '',
        nationalId: defendant.defenderNationalId,
        caseFileCategory: CaseFileCategory.DEFENDANT_CASE_FILE,
      })
    }
    return defendantAndDefender
  })

  return [
    prosecutorRepresentativeProps,
    ...(civilClaimantSpokespersons ? civilClaimantSpokespersons : []),
    ...(defendantsAndDefenders ? defendantsAndDefenders : []),
  ].filter((representative) => !!representative)
}

const transformCase = (theCase: Case, user: User | undefined) => {
  return {
    ...theCase.toJSON(),
    defendants: transformDefendants({
      defendants: theCase.defendants,
      indictmentRulingDecision: theCase.indictmentRulingDecision,
      rulingDate: theCase.rulingDate,
    }),
    caseFiles: theCase.caseFiles?.filter(
      (file) =>
        // The user must me known
        user &&
        // Rejected files are only visible to relevant parties
        (file.state !== CaseFileState.REJECTED ||
          (file.category === CaseFileCategory.PROSECUTOR_CASE_FILE &&
            isProsecutionUser(user)) ||
          ((file.category === CaseFileCategory.DEFENDANT_CASE_FILE ||
            file.category ===
              CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE) &&
            Defendant.isConfirmedDefenderOfDefendant(
              user.nationalId,
              theCase.defendants,
            )) ||
          ((file.category ===
            CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE ||
            file.category ===
              CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE) &&
            CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(
              user.nationalId,
              theCase.civilClaimants,
            ))),
    ),
    caseRepresentatives: transformCaseRepresentatives(theCase),
    postponedIndefinitelyExplanation:
      CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
    civilDemands: CaseString.civilDemands(theCase.caseStrings),
    penalties:
      user && isProsecutionUser(user)
        ? CaseString.penalties(theCase.caseStrings)
        : null,
    caseSentToCourtDate: EventLog.getEventLogDateByEventType(
      [EventType.CASE_SENT_TO_COURT, EventType.INDICTMENT_CONFIRMED],
      theCase.eventLogs,
    ),
    indictmentReviewedDate: DefendantEventLog.getEventLogDateByEventType(
      DefendantEventType.INDICTMENT_REVIEWED,
      theCase.defendants?.flatMap((defendant) => defendant.eventLogs || []),
    ),
    indictmentSentToPublicProsecutorDate: EventLog.getEventLogDateByEventType(
      EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      theCase.eventLogs,
    ),
    defenceAppealResultAccessDate: EventLog.getEventLogDateByEventType(
      EventType.APPEAL_RESULT_ACCESSED,
      theCase.eventLogs,
      UserRole.DEFENDER,
    ),
    prosecutionAppealResultAccessDate: EventLog.getEventLogDateByEventType(
      EventType.APPEAL_RESULT_ACCESSED,
      theCase.eventLogs,
      UserRole.PROSECUTOR,
    ),
    prisonStaffAppealResultAccessDate: EventLog.getEventLogDateByEventType(
      EventType.APPEAL_RESULT_ACCESSED,
      theCase.eventLogs,
      UserRole.PRISON_SYSTEM_STAFF,
    ),
    requestCompletedDate: EventLog.getEventLogDateByEventType(
      EventType.REQUEST_COMPLETED,
      theCase.eventLogs,
    ),
    indictmentCompletedDate: EventLog.getEventLogDateByEventType(
      EventType.INDICTMENT_COMPLETED,
      theCase.eventLogs,
    ),
    eventLogs: undefined,
    // Defence and prison system users should not see rulingModifiedHistory for request cases
    rulingModifiedHistory:
      isRequestCase(theCase.type) &&
      (isDefenceUser(user) || isPrisonSystemUser(user))
        ? undefined
        : theCase.rulingModifiedHistory,
  }
}

@Injectable()
export class CaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()

    const user: User | undefined = request.user?.currentUser

    return next.handle().pipe(map((theCase) => transformCase(theCase, user)))
  }
}

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()

    const user: User | undefined = request.user?.currentUser

    return next
      .handle()
      .pipe(
        map((cases: Case[]) =>
          cases.map((theCase) => transformCase(theCase, user)),
        ),
      )
  }
}
