import {
  CaseState,
  completedCaseStates,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

const RequestSharedWithDefenderAllowedStates: {
  [key in RequestSharedWithDefender]: CaseState[]
} = {
  [RequestSharedWithDefender.READY_FOR_COURT]: [
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
    ...completedCaseStates,
  ],
  [RequestSharedWithDefender.COURT_DATE]: [
    CaseState.RECEIVED,
    ...completedCaseStates,
  ],
  [RequestSharedWithDefender.NOT_SHARED]: completedCaseStates,
}

export function canDefenderViewRequest(theCase: Case) {
  const { requestSharedWithDefender, state, courtDate } = theCase

  if (!requestSharedWithDefender) {
    return false
  }

  const allowedStates =
    RequestSharedWithDefenderAllowedStates[requestSharedWithDefender]

  return (
    state &&
    allowedStates?.includes(state) &&
    (requestSharedWithDefender !== RequestSharedWithDefender.COURT_DATE ||
      Boolean(courtDate))
  )
}

export function transformLimitedAccessCase(theCase: Case): Case {
  return {
    ...theCase,
    caseResentExplanation: canDefenderViewRequest(theCase)
      ? theCase.caseResentExplanation
      : undefined,
  }
}
