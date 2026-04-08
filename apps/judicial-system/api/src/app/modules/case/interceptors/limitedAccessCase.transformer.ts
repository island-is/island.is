import {
  CaseState,
  completedRequestCaseStates,
  isRequestCase,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import {
  getIndictmentDismissalAppealInfo,
  getIndictmentInfo,
} from './case.transformer'

const RequestSharedWithDefenderAllowedStates: {
  [key in RequestSharedWithDefender]: CaseState[]
} = {
  [RequestSharedWithDefender.READY_FOR_COURT]: [
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
    ...completedRequestCaseStates,
  ],
  [RequestSharedWithDefender.COURT_DATE]: [
    CaseState.RECEIVED,
    ...completedRequestCaseStates,
  ],
  [RequestSharedWithDefender.NOT_SHARED]: completedRequestCaseStates,
}

export const canDefenderViewRequest = (theCase: Case) => {
  const { requestSharedWithDefender, state } = theCase

  if (!requestSharedWithDefender) {
    return false
  }

  const allowedStates =
    RequestSharedWithDefenderAllowedStates[requestSharedWithDefender]

  return (
    state &&
    allowedStates?.includes(state) &&
    (requestSharedWithDefender !== RequestSharedWithDefender.COURT_DATE ||
      Boolean(theCase.arraignmentDate?.date))
  )
}

const transformRequestCase = (theCase: Case): Case => {
  return {
    ...theCase,
    caseResentExplanation: canDefenderViewRequest(theCase)
      ? theCase.caseResentExplanation
      : undefined,
  }
}

const getDays = (days: number) => days * 24 * 60 * 60 * 1000

const transformIndictmentCase = (theCase: Case): Case => {
  const { indictmentRulingDecision, rulingDate, defendants } = theCase

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

export const transformLimitedAccessCase = (theCase: Case): Case => {
  if (isRequestCase(theCase.type)) {
    return transformRequestCase(theCase)
  }

  return transformIndictmentCase(theCase)
}
