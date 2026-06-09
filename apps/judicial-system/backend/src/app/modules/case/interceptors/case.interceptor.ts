import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  AppealEventType,
  CaseAppealDecision,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseState,
  DefendantEventType,
  EventType,
  getAppealDeadlineDate,
  getIndictmentAppealDeadline,
  getStatementDeadline,
  isCompletedCase,
  isDefenceUser,
  isDistrictCourtUser,
  isIndictmentCase,
  isPrisonSystemUser,
  isProsecutionUser,
  isRequestCase,
  prosecutionRoles,
  ServiceRequirement,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { isRulingOrderInConfirmedCourtSession } from '../../file/guards/caseFileCategory'
import { canDefenceUserViewCivilClaimCaseFile } from '../../file/guards/civilClaimFileVisibility'
import {
  AppealCase,
  AppealEventLog,
  Case,
  CaseFile,
  CaseString,
  CivilClaimant,
  Defendant,
  DefendantEventLog,
  EventLog,
} from '../../repository'

// ---------------------------------------------------------------------------
// Appeal-info computation
//
// Pre-appeal info (deadlines, hasBeenAppealed, canBeAppealed) lives on the
// entity that gets appealed:
//   - case-level appeals → on the Case
//   - ruling-order appeals → on the COURT_INDICTMENT_RULING_ORDER CaseFile
// Post-appeal info (appellant identity, statement deadline) lives on the
// AppealCase row — same shape for both case-level and ruling-order appeals.
// `hasBeenAppealed` is duplicated on the appealable entity for UI convenience.
// ---------------------------------------------------------------------------

const isAppealableDecision = (decision?: CaseAppealDecision | null) => {
  if (!decision) {
    return false
  }
  return [
    CaseAppealDecision.POSTPONE,
    CaseAppealDecision.NOT_APPLICABLE,
  ].includes(decision)
}

export interface CaseLevelAppealInfo {
  hasBeenAppealed?: boolean
  canBeAppealed?: boolean
  canProsecutorAppeal?: boolean
  canDefenderAppeal?: boolean
  appealDeadline?: Date
  isAppealDeadlineExpired?: boolean
}

export const getRequestCaseLevelAppealInfo = (
  theCase: Case,
): CaseLevelAppealInfo => {
  const {
    rulingDate,
    accusedAppealDecision,
    prosecutorAppealDecision,
    isCompletedWithoutRuling,
  } = theCase
  const { appealState } = theCase.appealCase ?? {}

  if (!rulingDate) {
    return {}
  }

  const didProsecutorAcceptInCourt =
    prosecutorAppealDecision === CaseAppealDecision.ACCEPT
  const didAccusedAcceptInCourt =
    accusedAppealDecision === CaseAppealDecision.ACCEPT
  const didAllAcceptInCourt =
    didProsecutorAcceptInCourt && didAccusedAcceptInCourt

  const hasBeenAppealed = Boolean(appealState) && !didAllAcceptInCourt
  const canBeAppealed = Boolean(
    !hasBeenAppealed &&
      !isCompletedWithoutRuling &&
      (isAppealableDecision(accusedAppealDecision) ||
        isAppealableDecision(prosecutorAppealDecision)),
  )
  const canProsecutorAppeal =
    canBeAppealed && isAppealableDecision(prosecutorAppealDecision)
  const canDefenderAppeal =
    canBeAppealed && isAppealableDecision(accusedAppealDecision)
  const appealDeadline = getAppealDeadlineDate(rulingDate)
  const isAppealDeadlineExpired = Date.now() >= appealDeadline.getTime()

  return {
    hasBeenAppealed,
    canBeAppealed,
    canProsecutorAppeal,
    canDefenderAppeal,
    appealDeadline,
    isAppealDeadlineExpired,
  }
}

export const getIndictmentCaseLevelAppealInfo = (
  theCase: Case,
): CaseLevelAppealInfo => {
  if (
    theCase.indictmentRulingDecision !==
      CaseIndictmentRulingDecision.DISMISSAL ||
    !theCase.rulingDate
  ) {
    return {}
  }

  const { appealState } = theCase.appealCase ?? {}
  const hasBeenAppealed = Boolean(appealState)
  const canBeAppealed = !hasBeenAppealed
  const appealDeadline = getAppealDeadlineDate(theCase.rulingDate)
  const isAppealDeadlineExpired = Date.now() >= appealDeadline.getTime()

  return {
    hasBeenAppealed,
    canBeAppealed,
    canProsecutorAppeal: canBeAppealed,
    canDefenderAppeal: canBeAppealed,
    appealDeadline,
    isAppealDeadlineExpired,
  }
}

export const getCaseLevelAppealInfo = (theCase: Case): CaseLevelAppealInfo => {
  return isRequestCase(theCase.type)
    ? getRequestCaseLevelAppealInfo(theCase)
    : getIndictmentCaseLevelAppealInfo(theCase)
}

export interface AppealCaseInfo {
  appealedByRole?: UserRole
  appealedDate?: Date
  statementDeadline?: Date
  isStatementDeadlineExpired?: boolean
}

export const getAppealCaseInfo = (
  appealCase: AppealCase,
  theCase: Case,
): AppealCaseInfo => {
  const {
    appealReceivedByCourtDate,
    rulingFileId,
    appealedByNationalId,
    created,
  } = appealCase
  const isRulingOrderAppeal = Boolean(rulingFileId)

  let appealedByRole: UserRole | undefined
  let appealedDate: Date | undefined

  if (isRulingOrderAppeal) {
    // Ruling-order appeals record the appellant on the AppealCase row itself.
    appealedByRole = appealedByNationalId
      ? UserRole.DEFENDER
      : UserRole.PROSECUTOR
    appealedDate = created
  } else {
    const { prosecutorPostponedAppealDate, accusedPostponedAppealDate } =
      theCase
    if (isRequestCase(theCase.type)) {
      const didProsecutorAcceptInCourt =
        theCase.prosecutorAppealDecision === CaseAppealDecision.ACCEPT
      const didAccusedAcceptInCourt =
        theCase.accusedAppealDecision === CaseAppealDecision.ACCEPT
      appealedByRole =
        prosecutorPostponedAppealDate && !didProsecutorAcceptInCourt
          ? UserRole.PROSECUTOR
          : accusedPostponedAppealDate && !didAccusedAcceptInCourt
          ? UserRole.DEFENDER
          : undefined
    } else {
      appealedByRole = prosecutorPostponedAppealDate
        ? UserRole.PROSECUTOR
        : accusedPostponedAppealDate
        ? UserRole.DEFENDER
        : undefined
    }
    appealedDate =
      appealedByRole === UserRole.PROSECUTOR
        ? prosecutorPostponedAppealDate
        : appealedByRole === UserRole.DEFENDER
        ? accusedPostponedAppealDate
        : undefined
  }

  let statementDeadline: Date | undefined
  let isStatementDeadlineExpired: boolean | undefined
  if (appealReceivedByCourtDate) {
    statementDeadline = getStatementDeadline(appealReceivedByCourtDate)
    isStatementDeadlineExpired = Date.now() >= statementDeadline.getTime()
  }

  return {
    appealedByRole,
    appealedDate,
    statementDeadline,
    isStatementDeadlineExpired,
  }
}

export interface AppealCaseStatementDates {
  prosecutorStatementDate?: Date
  defendantStatementDate?: Date
  defendantStatementDates?: { defendantId: string; statementDate: Date }[]
  civilClaimantStatementDates?: {
    civilClaimantId: string
    statementDate: Date
  }[]
}

export const getAppealCaseStatementDates = (
  appealCase: AppealCase,
  theCase: Case,
): AppealCaseStatementDates => {
  const eventLogs = appealCase.appealEventLogs
  const prosecutorStatementDate = AppealEventLog.getLatestDateByRole(
    AppealEventType.APPEAL_STATEMENT_SENT,
    prosecutionRoles,
    eventLogs,
  )

  if (isRequestCase(theCase.type)) {
    return {
      prosecutorStatementDate,
      defendantStatementDate: AppealEventLog.getLatestDateByRole(
        AppealEventType.APPEAL_STATEMENT_SENT,
        UserRole.DEFENDER,
        eventLogs,
      ),
    }
  }

  return {
    prosecutorStatementDate,
    defendantStatementDates: AppealEventLog.groupLatestByDefendant(
      AppealEventType.APPEAL_STATEMENT_SENT,
      eventLogs,
    ),
    civilClaimantStatementDates: AppealEventLog.groupLatestByCivilClaimant(
      AppealEventType.APPEAL_STATEMENT_SENT,
      eventLogs,
    ),
  }
}

export interface RulingOrderAppealInfo {
  hasBeenAppealed?: boolean
  canBeAppealed?: boolean
  appealDeadline?: Date
  isAppealDeadlineExpired?: boolean
}

export const getRulingOrderAppealInfo = (
  caseFile: CaseFile,
  theCase: Case,
): RulingOrderAppealInfo => {
  if (caseFile.category !== CaseFileCategory.COURT_INDICTMENT_RULING_ORDER) {
    return {}
  }

  const hasBeenAppealed = Boolean(
    theCase.rulingOrderAppealCases?.some((a) => a.rulingFileId === caseFile.id),
  )
  // Soft deadline — does not gate canBeAppealed; frontend warns visually.
  const canBeAppealed = !hasBeenAppealed && !isCompletedCase(theCase.state)

  // The ruling time and appeal deadline are based on the end date of the
  // confirmed court session the ruling order was added to.
  const confirmedCourtSession = theCase.courtSessions?.find(
    (session) => session.isConfirmed && session.rulingFileId === caseFile.id,
  )

  let appealDeadline: Date | undefined
  let isAppealDeadlineExpired: boolean | undefined
  if (confirmedCourtSession?.endDate) {
    appealDeadline = getAppealDeadlineDate(confirmedCourtSession.endDate)
    isAppealDeadlineExpired = Date.now() >= appealDeadline.getTime()
  }

  return {
    hasBeenAppealed,
    canBeAppealed,
    appealDeadline,
    isAppealDeadlineExpired,
  }
}

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
    const indictmentCancelledOrDismissedEventLog =
      DefendantEventLog.getEventLogByEventType(
        [
          DefendantEventType.INDICTMENT_CANCELLED,
          DefendantEventType.INDICTMENT_DISMISSED,
        ],
        defendant.eventLogs,
      )
    const indictmentCancelledOrDismissedState =
      indictmentCancelledOrDismissedEventLog
        ? {
            type:
              indictmentCancelledOrDismissedEventLog.eventType ===
              DefendantEventType.INDICTMENT_CANCELLED
                ? CaseIndictmentRulingDecision.CANCELLATION
                : CaseIndictmentRulingDecision.DISMISSAL,
            time: indictmentCancelledOrDismissedEventLog.created,
          }
        : undefined

    return {
      ...defendant.toJSON(),
      policeCaseNumbers: defendant.policeCaseNumbers,
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
      indictmentCancelledOrDismissedState,
      connectedCases: defendant.connectedCases ?? [],
    }
  })
}

export const transformCivilClaimants = ({
  civilClaimants,
}: {
  civilClaimants?: CivilClaimant[]
}) => {
  return civilClaimants?.map((civilClaimant) => civilClaimant.toJSON())
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

const getDefenceUserDefendants = (
  theCase: Case,
  user: User,
): {
  defendants: Defendant[] | undefined
  allCancelledOrDismissed: boolean
  latestCancelledOrDismissedDate: Date | undefined
} => {
  const myDefendants = theCase.defendants?.filter(
    (defendant) =>
      defendant.isDefenderChoiceConfirmed &&
      defendant.defenderNationalId &&
      defendant.defenderNationalId === user.nationalId,
  )

  if (!myDefendants?.length) {
    return {
      defendants: theCase.defendants,
      allCancelledOrDismissed: false,
      latestCancelledOrDismissedDate: undefined,
    }
  }

  const cancelledOrDismissedEventLogs = myDefendants.map((defendant) =>
    DefendantEventLog.getEventLogByEventType(
      [
        DefendantEventType.INDICTMENT_CANCELLED,
        DefendantEventType.INDICTMENT_DISMISSED,
      ],
      defendant.eventLogs,
    ),
  )

  const allCancelledOrDismissed = cancelledOrDismissedEventLogs.every(Boolean)

  const latestCancelledOrDismissedDate = allCancelledOrDismissed
    ? cancelledOrDismissedEventLogs.reduce<Date | undefined>((latest, log) => {
        if (!log) return latest
        return !latest || log.created > latest ? log.created : latest
      }, undefined)
    : undefined

  return {
    defendants: allCancelledOrDismissed ? myDefendants : theCase.defendants,
    allCancelledOrDismissed,
    latestCancelledOrDismissedDate,
  }
}

const transformCase = (
  theCase: Case,
  user: User | undefined,
): Record<string, unknown> => {
  const isDefence = isDefenceUser(user)
  const {
    defendants: transformedDefendants,
    allCancelledOrDismissed,
    latestCancelledOrDismissedDate,
  } = isDefence && user
    ? getDefenceUserDefendants(theCase, user)
    : {
        defendants: theCase.defendants,
        allCancelledOrDismissed: false,
        latestCancelledOrDismissedDate: undefined,
      }

  const stateOverride =
    isDefence && isIndictmentCase(theCase.type) && allCancelledOrDismissed
      ? {
          state: CaseState.COMPLETED,
          rulingDate: latestCancelledOrDismissedDate,
        }
      : {}

  // Per-appeal statement dates are derived from each appeal's own event log,
  // never from the parent case's union — keeps attribution scoped to the row.
  const appealCaseOverride = theCase.appealCase
    ? {
        appealCase: {
          ...theCase.appealCase.toJSON(),
          ...getAppealCaseStatementDates(theCase.appealCase, theCase),
          ...getAppealCaseInfo(theCase.appealCase, theCase),
          appealEventLogs: undefined,
        },
      }
    : {}

  const rulingOrderAppealCasesOverride = theCase.rulingOrderAppealCases
    ? {
        rulingOrderAppealCases: theCase.rulingOrderAppealCases.map((ac) => ({
          ...ac.toJSON(),
          ...getAppealCaseStatementDates(ac, theCase),
          ...getAppealCaseInfo(ac, theCase),
          appealEventLogs: undefined,
        })),
      }
    : {}

  const caseLevelAppealInfo = getCaseLevelAppealInfo(theCase)

  return {
    ...theCase.toJSON(),
    ...stateOverride,
    ...caseLevelAppealInfo,
    accusedPostponedAppealDate: caseLevelAppealInfo.hasBeenAppealed
      ? theCase.accusedPostponedAppealDate
      : undefined,
    prosecutorPostponedAppealDate: caseLevelAppealInfo.hasBeenAppealed
      ? theCase.prosecutorPostponedAppealDate
      : undefined,
    ...appealCaseOverride,
    ...rulingOrderAppealCasesOverride,
    defendants: transformDefendants({
      defendants: transformedDefendants,
      indictmentRulingDecision: theCase.indictmentRulingDecision,
      rulingDate: theCase.rulingDate,
    }),
    civilClaimants: transformCivilClaimants({
      civilClaimants: theCase.civilClaimants,
    }),
    caseFiles: theCase.caseFiles
      ?.filter(
        (file) =>
          // The user must be known
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
      )
      .filter(
        (file) =>
          !isDefence ||
          canDefenceUserViewCivilClaimCaseFile(user?.nationalId, {
            category: file.category,
            civilClaimantId: file.civilClaimantId,
            defendants: theCase.defendants,
            civilClaimants: theCase.civilClaimants,
          }),
      )
      // A ruling order uploaded during the course of a case is hidden from
      // everyone except district-court users until it has been added to a
      // confirmed court session.
      .filter(
        (file) =>
          file.category !== CaseFileCategory.COURT_INDICTMENT_RULING_ORDER ||
          isDistrictCourtUser(user) ||
          isRulingOrderInConfirmedCourtSession(file.id, theCase.courtSessions),
      )
      .map((file) => ({
        ...file.toJSON(),
        ...getRulingOrderAppealInfo(file, theCase),
      })),
    caseRepresentatives: transformCaseRepresentatives(theCase),
    postponedIndefinitelyExplanation:
      CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
    civilDemands: CaseString.civilDemands(theCase.caseStrings),
    penalties:
      user && isProsecutionUser(user)
        ? CaseString.penalties(theCase.caseStrings)
        : null,
    reopenReason: CaseString.reopenReason(theCase.caseStrings),
    caseSentToCourtDate: EventLog.getEventLogDateByEventType(
      [EventType.CASE_SENT_TO_COURT, EventType.INDICTMENT_CONFIRMED],
      theCase.eventLogs,
    ),
    indictmentReviewedDate: (() => {
      const reviewedDate = DefendantEventLog.getEventLogDateByEventType(
        DefendantEventType.INDICTMENT_REVIEWED,
        theCase.defendants?.flatMap((defendant) => defendant.eventLogs || []),
      )
      if (!reviewedDate) return undefined
      const reopenedDate = EventLog.getEventLogDateByEventType(
        EventType.INDICTMENT_REOPENED,
        theCase.eventLogs,
      )
      return reopenedDate && reopenedDate > reviewedDate
        ? undefined
        : reviewedDate
    })(),
    indictmentSentToPublicProsecutorDate: (() => {
      const sentDate = EventLog.getEventLogDateByEventType(
        EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
        theCase.eventLogs,
      )
      if (!sentDate) return undefined
      const reopenedDate = EventLog.getEventLogDateByEventType(
        EventType.INDICTMENT_REOPENED,
        theCase.eventLogs,
      )
      return reopenedDate && reopenedDate > sentDate ? undefined : sentDate
    })(),
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
    parentCase: theCase.parentCase && transformCase(theCase.parentCase, user),
    childCase: theCase.childCase && transformCase(theCase.childCase, user),
    mergeCase: theCase.mergeCase && transformCase(theCase.mergeCase, user),
    mergedCases:
      theCase.mergedCases &&
      theCase.mergedCases.map((mergedCase) => transformCase(mergedCase, user)),
    splitCase: theCase.splitCase && transformCase(theCase.splitCase, user),
    splitCases:
      theCase.splitCases &&
      theCase.splitCases.map((splitCase) => transformCase(splitCase, user)),
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
