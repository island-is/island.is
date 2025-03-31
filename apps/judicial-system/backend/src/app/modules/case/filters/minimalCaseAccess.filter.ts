import {
  CaseState,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
  isRequestCase,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { MinimalCase } from '../models/case.types'

const canProsecutionUserAccessCase = (
  theCase: MinimalCase,
  user: User,
): boolean => {
  // Check case type access
  if (user.role !== UserRole.PROSECUTOR && !isIndictmentCase(theCase.type)) {
    return false
  }

  // Check case state access
  if (
    ![
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.WAITING_FOR_CONFIRMATION,
      CaseState.SUBMITTED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
      CaseState.COMPLETED,
    ].includes(theCase.state)
  ) {
    return false
  }

  // Check heightened security level access
  if (
    theCase.isHeightenedSecurityLevel &&
    user.id !== theCase.creatingProsecutorId &&
    user.id !== theCase.prosecutorId
  ) {
    return false
  }

  return true
}

const canDistrictCourtUserAccessCase = (
  theCase: MinimalCase,
  user: User,
): boolean => {
  // Check case state access
  if (isRequestCase(theCase.type)) {
    if (
      ![
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ].includes(theCase.state)
    ) {
      return false
    }
  } else if (
    ![
      CaseState.SUBMITTED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      CaseState.COMPLETED,
    ].includes(theCase.state)
  ) {
    return false
  }

  // Check court access
  if (user.institution?.id !== theCase.courtId) {
    return false
  }

  return true
}

export const canUserAccessMinimalCase = (
  theCase: MinimalCase,
  user: User,
): boolean => {
  if (isProsecutionUser(user)) {
    return canProsecutionUserAccessCase(theCase, user)
  }

  if (isDistrictCourtUser(user)) {
    return canDistrictCourtUserAccessCase(theCase, user)
  }

  // Other users can be added when needed
  return false
}
