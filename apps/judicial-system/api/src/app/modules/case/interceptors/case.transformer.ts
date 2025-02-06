import {
  getAppealDeadlineDate,
  getIndictmentAppealDeadlineDate,
  hasDatePassed,
} from '@island.is/judicial-system/types'
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

interface IndictmentInfoParams {
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: string
  defendants?: Defendant[]
  eventLogs?: EventLog[]
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
        ? prosecutorPostponedAppealDate ?? undefined
        : accusedPostponedAppealDate ?? undefined
  }

  appealInfo.canBeAppealed = Boolean(
    !hasBeenAppealed &&
      (isAppealableDecision(accusedAppealDecision) ||
        isAppealableDecision(prosecutorAppealDecision)),
  )

  const theRulingDate = new Date(rulingDate)
  appealInfo.appealDeadline = getAppealDeadlineDate(theRulingDate).toISOString()

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
      ? hasDatePassed(new Date(theCase.validToDate))
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

export const getIndictmentInfo = ({
  indictmentRulingDecision,
  rulingDate,
  defendants,
  eventLogs,
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

  const indictmentCompletedDate = rulingDate
    ? new Date(rulingDate).toISOString()
    : eventLogs
        ?.find((log) => log.eventType === EventType.INDICTMENT_COMPLETED)
        ?.created?.toString()

  return {
    indictmentAppealDeadline,
    indictmentVerdictViewedByAll,
    indictmentVerdictAppealDeadlineExpired,
    indictmentCompletedDate,
  }
}

export const getIndictmentDefendantsInfo = (theCase: Case) => {
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

    return {
      ...defendant,
      verdictAppealDeadline: verdictAppealDeadline?.toISOString(),
      isVerdictAppealDeadlineExpired,
    }
  })
}

const transformIndictmentCase = (theCase: Case): Case => {
  const { rulingDate, defendants, eventLogs, indictmentRulingDecision } =
    theCase

  return {
    ...theCase,
    ...getIndictmentInfo({
      indictmentRulingDecision,
      rulingDate,
      defendants,
      eventLogs,
    }),
    defendants: getIndictmentDefendantsInfo(theCase),
  }
}

export const transformCase = (theCase: Case): Case => {
  if (isRequestCase(theCase.type)) {
    return transformRequestCase(theCase)
  }

  return transformIndictmentCase(theCase)
}
