import {
  CaseAppealDecision,
  getStatementDeadline,
  UserRole,
} from '@island.is/judicial-system/types'

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

  appealInfo.canBeAppealed =
    !hasBeenAppealed &&
    (isAppealableDecision(accusedAppealDecision) ||
      isAppealableDecision(prosecutorAppealDecision))

  appealInfo.canProsecutorAppeal =
    !hasBeenAppealed && isAppealableDecision(prosecutorAppealDecision)

  appealInfo.canDefenderAppeal =
    !hasBeenAppealed && isAppealableDecision(accusedAppealDecision)

  appealInfo.hasBeenAppealed = hasBeenAppealed

  appealInfo.appealedByRole = prosecutorPostponedAppealDate
    ? UserRole.PROSECUTOR
    : accusedPostponedAppealDate
    ? UserRole.DEFENDER
    : undefined

  appealInfo.appealedDate =
    appealInfo.appealedByRole === UserRole.PROSECUTOR
      ? prosecutorPostponedAppealDate ?? undefined
      : accusedPostponedAppealDate ?? undefined

  const theRulingDate = new Date(rulingDate)
  appealInfo.appealDeadline = new Date(
    theRulingDate.setDate(theRulingDate.getDate() + 3),
  ).toISOString()

  if (appealReceivedByCourtDate) {
    appealInfo.statementDeadline = getStatementDeadline(
      new Date(appealReceivedByCourtDate),
    )
  }

  return appealInfo
}

export const transformCase = (theCase: Case): Case => {
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
    ...appealInfo,
  }
}
