import {
  CaseAppealDecision,
  CaseIndictmentRulingDecision,
  EventType,
  getIndictmentVerdictAppealDeadlineStatus,
  getStatementDeadline,
  isRequestCase,
  ServiceRequirement,
  UserRole,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { EventLog } from '../../event-log'
import { Case } from '../models/case.model'

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
  indictmentCompletedDate?: string
  indictmentAppealDeadline?: string
  indictmentVerdictViewedByAll?: boolean
  indictmentVerdictAppealDeadlineExpired?: boolean
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

export const getAppealInfo = (theCase: Case): AppealInfo => {
  const {
    rulingDate,
    appealState,
    accusedAppealDecision,
    prosecutorAppealDecision,
    prosecutorPostponedAppealDate,
    accusedPostponedAppealDate,
    appealReceivedByCourtDate,
  } = theCase

  const appealInfo: AppealInfo = {}

  if (!rulingDate) {
    return appealInfo
  }

  const hasBeenAppealed = Boolean(appealState)

  appealInfo.hasBeenAppealed = hasBeenAppealed

  if (hasBeenAppealed) {
    appealInfo.appealedByRole = prosecutorPostponedAppealDate
      ? UserRole.PROSECUTOR
      : accusedPostponedAppealDate
      ? UserRole.DEFENDER
      : undefined

    appealInfo.appealedDate =
      appealInfo.appealedByRole === UserRole.PROSECUTOR
        ? prosecutorPostponedAppealDate ?? undefined
        : accusedPostponedAppealDate ?? undefined
  }

  appealInfo.canBeAppealed = Boolean(
    !hasBeenAppealed &&
      (isAppealableDecision(accusedAppealDecision) ||
        isAppealableDecision(prosecutorAppealDecision)),
  )

  const theRulingDate = new Date(rulingDate)
  appealInfo.appealDeadline = new Date(
    theRulingDate.getTime() + getDays(3),
  ).toISOString()

  appealInfo.canProsecutorAppeal =
    !hasBeenAppealed && isAppealableDecision(prosecutorAppealDecision)

  appealInfo.canDefenderAppeal =
    !hasBeenAppealed && isAppealableDecision(accusedAppealDecision)

  if (appealReceivedByCourtDate) {
    appealInfo.statementDeadline = getStatementDeadline(
      new Date(appealReceivedByCourtDate),
    )
  }

  return appealInfo
}

const transformRequestCase = (theCase: Case): Case => {
  const appealInfo = getAppealInfo(theCase)

  return {
    ...theCase,
    requestProsecutorOnlySession: theCase.requestProsecutorOnlySession ?? false,
    isClosedCourtHidden: theCase.isClosedCourtHidden ?? false,
    isHeightenedSecurityLevel: theCase.isHeightenedSecurityLevel ?? false,
    isValidToDateInThePast: theCase.validToDate
      ? Date.now() > new Date(theCase.validToDate).getTime()
      : theCase.isValidToDateInThePast,

    // TODO: Move remaining appeal fields to appealInfo
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
  }
}

export const getIndictmentInfo = (
  rulingDecision?: CaseIndictmentRulingDecision,
  rulingDate?: string,
  defendants?: Defendant[],
  eventLog?: EventLog[],
): IndictmentInfo => {
  const indictmentInfo: IndictmentInfo = {}

  if (!rulingDate) {
    return indictmentInfo
  }

  const theRulingDate = new Date(rulingDate)
  indictmentInfo.indictmentAppealDeadline = new Date(
    theRulingDate.getTime() + getDays(28),
  ).toISOString()

  const verdictInfo = defendants?.map<[boolean, Date | undefined]>(
    (defendant) => [
      rulingDecision === CaseIndictmentRulingDecision.RULING,
      defendant.serviceRequirement === ServiceRequirement.NOT_REQUIRED
        ? new Date()
        : defendant.verdictViewDate
        ? new Date(defendant.verdictViewDate)
        : undefined,
    ],
  )

  const [indictmentVerdictViewedByAll, indictmentVerdictAppealDeadlineExpired] =
    getIndictmentVerdictAppealDeadlineStatus(verdictInfo)
  indictmentInfo.indictmentVerdictViewedByAll = indictmentVerdictViewedByAll
  indictmentInfo.indictmentVerdictAppealDeadlineExpired =
    indictmentVerdictAppealDeadlineExpired

  indictmentInfo.indictmentCompletedDate = eventLog
    ?.find((log) => log.eventType === EventType.INDICTMENT_COMPLETED)
    ?.created?.toString()

  return indictmentInfo
}

export const getIndictmentDefendantsInfo = (
  defendants: Defendant[] | undefined,
) => {
  return defendants?.map((defendant) => {
    const { verdictViewDate } = defendant
    const verdictAppealDeadline = verdictViewDate
      ? new Date(
          new Date(verdictViewDate).getTime() + getDays(28),
        ).toISOString()
      : undefined
    const isVerdictAppealDeadlineExpired = verdictAppealDeadline
      ? Date.now() >= new Date(verdictAppealDeadline).getTime()
      : false

    return {
      ...defendant,
      verdictAppealDeadline,
      isVerdictAppealDeadlineExpired,
    }
  })
}

const transformIndictmentCase = (theCase: Case): Case => {
  return {
    ...theCase,
    ...getIndictmentInfo(
      theCase.indictmentRulingDecision,
      theCase.rulingDate,
      theCase.defendants,
      theCase.eventLogs,
    ),
    defendants: getIndictmentDefendantsInfo(theCase.defendants),
  }
}

export const transformCase = (theCase: Case): Case => {
  if (isRequestCase(theCase.type)) {
    return transformRequestCase(theCase)
  }

  return transformIndictmentCase(theCase)
}
