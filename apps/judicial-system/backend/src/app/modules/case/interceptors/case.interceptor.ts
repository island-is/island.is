import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseAppealDecision,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  DefendantEventType,
  getAppealDeadlineDate,
  getIndictmentAppealDeadlineDate,
  getIndictmentVerdictAppealDeadlineStatus,
  getStatementDeadline,
  hasDatePassed,
  isRequestCase,
  ServiceRequirement,
  UserRole,
} from '@island.is/judicial-system/types'

import { Defendant, DefendantEventLog } from '../../defendant'
import { EventLog } from '../../event-log'
import { Case } from '../models/case.model'
import { CaseString } from '../models/caseString.model'

const getDays = (days: number) => days * 24 * 60 * 60 * 1000

interface AppealInfo {
  canBeAppealed?: boolean
  hasBeenAppealed?: boolean
  appealDeadline?: string
  appealedByRole?: UserRole
  appealedDate?: string
  statementDeadline?: string
  canProsecutorAppeal?: boolean
  canDefenderAppeal?: boolean
}

interface IndictmentInfo {
  indictmentAppealDeadline?: string
  indictmentVerdictViewedByAll?: boolean
  indictmentVerdictAppealDeadlineExpired?: boolean
}

interface IndictmentInfoParams {
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: Date
  defendants?: Defendant[]
}

const isAppealableDecision = (decision?: CaseAppealDecision | null) => {
  if (!decision) {
    return false
  }
  return [
    CaseAppealDecision.POSTPONE,
    CaseAppealDecision.NOT_APPLICABLE,
  ].includes(decision)
}

const getAppealInfo = (theCase: Case): AppealInfo => {
  const {
    rulingDate,
    appealState,
    accusedAppealDecision,
    prosecutorAppealDecision,
    prosecutorPostponedAppealDate,
    accusedPostponedAppealDate,
    appealReceivedByCourtDate,
    isCompletedWithoutRuling,
  } = theCase

  const appealInfo: AppealInfo = {}

  if (!rulingDate) {
    return appealInfo
  }

  const didProsecutorAcceptInCourt =
    prosecutorAppealDecision === CaseAppealDecision.ACCEPT
  const didAccusedAcceptInCourt =
    accusedAppealDecision === CaseAppealDecision.ACCEPT
  const didAllAcceptInCourt =
    didProsecutorAcceptInCourt && didAccusedAcceptInCourt

  const hasBeenAppealed = Boolean(appealState) && !didAllAcceptInCourt
  appealInfo.hasBeenAppealed = hasBeenAppealed

  if (hasBeenAppealed) {
    appealInfo.appealedByRole =
      prosecutorPostponedAppealDate && !didProsecutorAcceptInCourt
        ? UserRole.PROSECUTOR
        : accusedPostponedAppealDate && !didAccusedAcceptInCourt
        ? UserRole.DEFENDER
        : undefined

    appealInfo.appealedDate =
      appealInfo.appealedByRole === UserRole.PROSECUTOR
        ? prosecutorPostponedAppealDate
          ? new Date(prosecutorPostponedAppealDate).toISOString()
          : undefined
        : accusedPostponedAppealDate
        ? new Date(accusedPostponedAppealDate).toISOString()
        : undefined
  }

  appealInfo.canBeAppealed = Boolean(
    !hasBeenAppealed &&
      !isCompletedWithoutRuling &&
      (isAppealableDecision(accusedAppealDecision) ||
        isAppealableDecision(prosecutorAppealDecision)),
  )

  appealInfo.canProsecutorAppeal =
    appealInfo.canBeAppealed && isAppealableDecision(prosecutorAppealDecision)

  appealInfo.canDefenderAppeal =
    appealInfo.canBeAppealed && isAppealableDecision(accusedAppealDecision)

  const theRulingDate = new Date(rulingDate)
  appealInfo.appealDeadline = getAppealDeadlineDate(theRulingDate).toISOString()

  if (appealReceivedByCourtDate) {
    appealInfo.statementDeadline = getStatementDeadline(
      new Date(appealReceivedByCourtDate),
    )
  }

  return appealInfo
}

const getIndictmentInfo = ({
  indictmentRulingDecision,
  rulingDate,
  defendants,
}: IndictmentInfoParams): IndictmentInfo => {
  const isFine = indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
  const isRuling =
    indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

  if (!rulingDate) {
    return {}
  }

  const theRulingDate = new Date(rulingDate)
  const indictmentAppealDeadline = getIndictmentAppealDeadlineDate(
    theRulingDate,
    isFine,
  ).toISOString()

  const verdictInfo = defendants?.map<[boolean, Date | undefined]>(
    (defendant) => [
      isRuling || isFine,
      isFine || defendant.serviceRequirement === ServiceRequirement.NOT_REQUIRED
        ? theRulingDate
        : defendant.verdictViewDate
        ? new Date(defendant.verdictViewDate)
        : undefined,
    ],
  )

  const [indictmentVerdictViewedByAll, indictmentVerdictAppealDeadlineExpired] =
    getIndictmentVerdictAppealDeadlineStatus(verdictInfo, isFine)

  return {
    indictmentAppealDeadline,
    indictmentVerdictViewedByAll,
    indictmentVerdictAppealDeadlineExpired,
  }
}

const getIndictmentDefendantsInfo = (theCase: Case) => {
  return theCase.defendants?.map((defendant) => {
    const serviceRequired =
      defendant.serviceRequirement === ServiceRequirement.REQUIRED
    const isFine =
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

    const { verdictViewDate } = defendant

    const baseDate = serviceRequired ? verdictViewDate : theCase.rulingDate
    const verdictAppealDeadline = baseDate
      ? getIndictmentAppealDeadlineDate(new Date(baseDate), isFine)
      : undefined
    const isVerdictAppealDeadlineExpired =
      !!verdictAppealDeadline && hasDatePassed(verdictAppealDeadline)

    // Convert defendant to JSON first to avoid circular references
    const defendantJson = defendant.toJSON()

    return {
      ...defendantJson,
      verdictAppealDeadline: verdictAppealDeadline?.toISOString(),
      isVerdictAppealDeadlineExpired,
    }
  })
}

export const transformDefendants = (defendants?: Defendant[]) => {
  return defendants?.map((defendant) => ({
    ...defendant.toJSON(),
    sentToPrisonAdminDate: defendant.isSentToPrisonAdmin
      ? DefendantEventLog.getDefendantEventLogTypeDate(
          DefendantEventType.SENT_TO_PRISON_ADMIN,
          defendant.eventLogs,
        )
      : undefined,
    openedByPrisonAdminDate: DefendantEventLog.getDefendantEventLogTypeDate(
      DefendantEventType.OPENED_BY_PRISON_ADMIN,
      defendant.eventLogs,
    ),
  }))
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
        name: defendant.name,
        nationalId: defendant.nationalId,
        caseFileCategory: CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
      },
    ]
    if (defendant.defenderName) {
      defendantAndDefender.push({
        name: defendant.defenderName,
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

const transformRequestCase = (theCase: Case) => {
  const appealInfo = getAppealInfo(theCase)
  const caseJson = theCase.toJSON()

  return {
    ...caseJson,
    requestProsecutorOnlySession: theCase.requestProsecutorOnlySession ?? false,
    isClosedCourtHidden: theCase.isClosedCourtHidden ?? false,
    isHeightenedSecurityLevel: theCase.isHeightenedSecurityLevel ?? false,
    isValidToDateInThePast: theCase.validToDate
      ? hasDatePassed(new Date(theCase.validToDate))
      : undefined,

    // Appeal deadline calculations
    isAppealDeadlineExpired: appealInfo.appealDeadline
      ? Date.now() >= new Date(appealInfo.appealDeadline).getTime()
      : false,
    isAppealGracePeriodExpired: theCase.rulingDate
      ? Date.now() >= new Date(theCase.rulingDate).getTime() + getDays(31)
      : false,
    isStatementDeadlineExpired: theCase.appealReceivedByCourtDate
      ? Date.now() >=
        new Date(theCase.appealReceivedByCourtDate).getTime() + getDays(1)
      : false,
    accusedPostponedAppealDate: appealInfo.hasBeenAppealed
      ? theCase.accusedPostponedAppealDate
      : undefined,
    prosecutorPostponedAppealDate: appealInfo.hasBeenAppealed
      ? theCase.prosecutorPostponedAppealDate
      : undefined,
    ...appealInfo,

    defendants: transformDefendants(theCase.defendants),
    postponedIndefinitelyExplanation:
      CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
    civilDemands: CaseString.civilDemands(theCase.caseStrings),
    caseSentToCourtDate: EventLog.caseSentToCourtEvent(theCase.eventLogs)
      ?.created,
    caseRepresentatives: transformCaseRepresentatives(theCase),
  }
}

const transformIndictmentCase = (theCase: Case) => {
  const { defendants, indictmentRulingDecision } = theCase
  const caseJson = theCase.toJSON()

  return {
    ...caseJson,
    ...getIndictmentInfo({
      indictmentRulingDecision,
      rulingDate: theCase.rulingDate,
      defendants,
    }),
    // Merge indictment defendants info with existing defendant transformations
    defendants: getIndictmentDefendantsInfo(theCase)?.map(
      (defendant, index) => {
        const originalDefendant = theCase.defendants?.[index]

        return {
          ...defendant,
          sentToPrisonAdminDate: originalDefendant?.isSentToPrisonAdmin
            ? DefendantEventLog.getDefendantEventLogTypeDate(
                DefendantEventType.SENT_TO_PRISON_ADMIN,
                originalDefendant.eventLogs,
              )
            : undefined,
          openedByPrisonAdminDate: originalDefendant
            ? DefendantEventLog.getDefendantEventLogTypeDate(
                DefendantEventType.OPENED_BY_PRISON_ADMIN,
                originalDefendant.eventLogs,
              )
            : undefined,
        }
      },
    ),

    postponedIndefinitelyExplanation:
      CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
    civilDemands: CaseString.civilDemands(theCase.caseStrings),
    caseSentToCourtDate: EventLog.caseSentToCourtEvent(theCase.eventLogs)
      ?.created,
    caseRepresentatives: transformCaseRepresentatives(theCase),
  }
}

const transformCase = (theCase: Case) => {
  if (isRequestCase(theCase.type)) {
    return transformRequestCase(theCase)
  }

  return transformIndictmentCase(theCase)
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
