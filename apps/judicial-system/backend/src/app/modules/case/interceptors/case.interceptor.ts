import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseFileCategory,
  DefendantEventType,
  EventType,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  Case,
  CaseString,
  Defendant,
  DefendantEventLog,
  EventLog,
} from '../../repository'

export const transformDefendants = (defendants?: Defendant[]) => {
  return defendants?.map((defendant) => {
    const { verdict } = defendant
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

const transformCase = (theCase: Case) => {
  return {
    ...theCase.toJSON(),
    defendants: transformDefendants(theCase.defendants),
    postponedIndefinitelyExplanation:
      CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
    civilDemands: CaseString.civilDemands(theCase.caseStrings),
    penalties: CaseString.penalties(theCase.caseStrings),
    caseSentToCourtDate: EventLog.getEventLogDateByEventType(
      [EventType.CASE_SENT_TO_COURT, EventType.INDICTMENT_CONFIRMED],
      theCase.eventLogs,
    ),
    indictmentReviewedDate: EventLog.getEventLogDateByEventType(
      EventType.INDICTMENT_REVIEWED,
      theCase.eventLogs,
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
    caseRepresentatives: transformCaseRepresentatives(theCase),
  }
}

@Injectable()
export class CaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map(transformCase))
  }
}

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(
        map((cases: Case[]) => cases.map((theCase) => transformCase(theCase))),
      )
  }
}
