import {
  CaseAppealDecision,
  CaseIndictmentRulingDecision,
  getAppealDeadlineDate,
  getDefendantServiceDate,
  getIndictmentAppealDeadline,
  getIndictmentVerdictAppealDeadlineStatus,
  getStatementDeadline,
  hasDatePassed,
  isRequestCase,
  UserRole,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
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
  indictmentAppealDeadline?: string
  indictmentVerdictViewedByAll?: boolean
  indictmentVerdictAppealDeadlineExpired?: boolean
}

interface IndictmentInfoParams {
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: string
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

export const getAppealInfo = (theCase: Case): AppealInfo => {
  const {
    rulingDate,
    accusedAppealDecision,
    prosecutorAppealDecision,
    prosecutorPostponedAppealDate,
    accusedPostponedAppealDate,
    isCompletedWithoutRuling,
  } = theCase

  const appealState = theCase.appealCase?.appealState
  const appealReceivedByCourtDate =
    theCase.appealCase?.appealReceivedByCourtDate

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
    isStatementDeadlineExpired: theCase.appealCase?.appealReceivedByCourtDate
      ? Date.now() >=
        new Date(theCase.appealCase.appealReceivedByCourtDate).getTime() +
          getDays(1)
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
}: IndictmentInfoParams): IndictmentInfo => {
  const isFine = indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
  const isRuling =
    indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

  if (!rulingDate) {
    return {}
  }

  const theRulingDate = new Date(rulingDate)
  const indictmentAppealDeadline = getIndictmentAppealDeadline({
    baseDate: theRulingDate,
    isFine,
  }).deadlineDate.toISOString()

  const defendantVerdictInfo = defendants?.map((defendant) => ({
    canAppealVerdict: isRuling || isFine,
    serviceDate: getDefendantServiceDate({
      verdict: defendant.verdict,
      fallbackDate: rulingDate,
    }),
  }))

  const {
    isVerdictViewedByAllRequiredDefendants,
    hasVerdictAppealDeadlineExpiredForAll,
  } = getIndictmentVerdictAppealDeadlineStatus(defendantVerdictInfo, isFine)

  return {
    indictmentAppealDeadline,
    indictmentVerdictViewedByAll: isVerdictViewedByAllRequiredDefendants,
    indictmentVerdictAppealDeadlineExpired:
      hasVerdictAppealDeadlineExpiredForAll,
  }
}

export const getIndictmentDefendantsInfo = (theCase: Case) => {
  return theCase.defendants?.map((defendant) => {
    const baseDate = getDefendantServiceDate({
      verdict: defendant.verdict,
      fallbackDate: theCase.rulingDate,
    })
    const verdictAppealDeadline = baseDate
      ? getIndictmentAppealDeadline({
          baseDate,
          isFine:
            theCase.indictmentRulingDecision ===
            CaseIndictmentRulingDecision.FINE,
        })
      : undefined

    return {
      ...defendant,
      // represents both verdicts and fines
      verdictAppealDeadline: verdictAppealDeadline?.deadlineDate?.toISOString(),
      isVerdictAppealDeadlineExpired: verdictAppealDeadline?.isDeadlineExpired,
    }
  })
}

export const getIndictmentDismissalAppealInfo = (theCase: Case): AppealInfo => {
  const appealInfo: AppealInfo = {}

  if (
    theCase.indictmentRulingDecision !==
      CaseIndictmentRulingDecision.DISMISSAL ||
    !theCase.rulingDate
  ) {
    return appealInfo
  }

  const appealState = theCase.appealCase?.appealState
  const appealReceivedByCourtDate =
    theCase.appealCase?.appealReceivedByCourtDate

  const hasBeenAppealed = Boolean(appealState)
  appealInfo.hasBeenAppealed = hasBeenAppealed

  if (hasBeenAppealed) {
    appealInfo.appealedByRole = theCase.prosecutorPostponedAppealDate
      ? UserRole.PROSECUTOR
      : theCase.accusedPostponedAppealDate
      ? UserRole.DEFENDER
      : undefined

    appealInfo.appealedDate =
      appealInfo.appealedByRole === UserRole.PROSECUTOR
        ? theCase.prosecutorPostponedAppealDate ?? undefined
        : theCase.accusedPostponedAppealDate ?? undefined
  }

  appealInfo.canBeAppealed = !hasBeenAppealed
  appealInfo.canProsecutorAppeal = appealInfo.canBeAppealed
  appealInfo.canDefenderAppeal = appealInfo.canBeAppealed

  const theRulingDate = new Date(theCase.rulingDate)
  appealInfo.appealDeadline = getAppealDeadlineDate(theRulingDate).toISOString()

  if (appealReceivedByCourtDate) {
    appealInfo.statementDeadline = getStatementDeadline(
      new Date(appealReceivedByCourtDate),
    )
  }

  return appealInfo
}

const transformIndictmentCase = (theCase: Case): Case => {
  const { rulingDate, defendants, indictmentRulingDecision } = theCase

  const dismissalAppealInfo = getIndictmentDismissalAppealInfo(theCase)

  return {
    ...theCase,
    ...getIndictmentInfo({
      indictmentRulingDecision,
      rulingDate,
      defendants,
    }),
    ...dismissalAppealInfo,
    isAppealDeadlineExpired: dismissalAppealInfo.appealDeadline
      ? Date.now() >= new Date(dismissalAppealInfo.appealDeadline).getTime()
      : false,
    isStatementDeadlineExpired: theCase.appealCase?.appealReceivedByCourtDate
      ? Date.now() >=
        new Date(theCase.appealCase.appealReceivedByCourtDate).getTime() +
          getDays(1)
      : false,
    accusedPostponedAppealDate: dismissalAppealInfo.hasBeenAppealed
      ? theCase.accusedPostponedAppealDate
      : undefined,
    prosecutorPostponedAppealDate: dismissalAppealInfo.hasBeenAppealed
      ? theCase.prosecutorPostponedAppealDate
      : undefined,
  }
}

export const transformCase = (theCase: Case): Case => {
  if (isRequestCase(theCase.type)) {
    return transformRequestCase(theCase)
  }

  return transformIndictmentCase(theCase)
}
