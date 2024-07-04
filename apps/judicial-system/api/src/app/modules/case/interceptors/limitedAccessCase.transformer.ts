import {
  CaseState,
  completedRequestCaseStates,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

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

export const transformLimitedAccessCase = (theCase: Case): Case => {
  return {
    ...theCase,
    caseResentExplanation: canDefenderViewRequest(theCase)
      ? theCase.caseResentExplanation
      : undefined,
  }
}
