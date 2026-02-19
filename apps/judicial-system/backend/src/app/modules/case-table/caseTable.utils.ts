import {
  CaseActionType,
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseType,
  ContextMenuCaseActionType,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
  isRequestCase,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'

/** Which field matched the search query and the displayed value (for sorting/highlighting). */
export const getMatch = (
  theCase: Pick<
    Case,
    'policeCaseNumbers' | 'courtCaseNumber' | 'appealCaseNumber' | 'defendants'
  >,
  query: string,
): { field: string; value: string } => {
  const lowerQuery = query.toLowerCase()

  const matchingPoliceCaseNumber = theCase.policeCaseNumbers?.find((pcn) =>
    pcn.toLowerCase().includes(lowerQuery),
  )

  if (matchingPoliceCaseNumber) {
    return { field: 'policeCaseNumbers', value: matchingPoliceCaseNumber }
  }

  if (theCase.courtCaseNumber?.toLowerCase().includes(lowerQuery)) {
    return { field: 'courtCaseNumber', value: theCase.courtCaseNumber }
  }

  if (theCase.appealCaseNumber?.toLowerCase().includes(lowerQuery)) {
    return { field: 'appealCaseNumber', value: theCase.appealCaseNumber }
  }

  for (const d of theCase.defendants ?? []) {
    if (d.nationalId?.toLowerCase().includes(lowerQuery)) {
      return { field: 'defendantNationalId', value: d.nationalId }
    }
  }

  for (const d of theCase.defendants ?? []) {
    if (d.name?.toLowerCase().includes(lowerQuery)) {
      return { field: 'defendantName', value: d.name }
    }
  }

  return {
    field: 'policeCaseNumbers',
    value: theCase.policeCaseNumbers?.[0] ?? '',
  }
}

export const isMyCase = (
  theCase: Pick<
    Case,
    'creatingProsecutorId' | 'prosecutorId' | 'judge' | 'registrar'
  >,
  user: TUser,
): boolean => {
  if (isProsecutionUser(user)) {
    return (
      theCase.creatingProsecutorId === user.id ||
      theCase.prosecutorId === user.id
    )
  }

  if (isDistrictCourtUser(user)) {
    return theCase.judge?.id === user.id || theCase.registrar?.id === user.id
  }

  return false
}

export const getActionOnRowClick = (
  theCase: Pick<Case, 'type' | 'state'>,
  user: TUser,
): CaseActionType => {
  if (
    isDistrictCourtUser(user) &&
    isIndictmentCase(theCase.type) &&
    theCase.state === CaseState.WAITING_FOR_CANCELLATION
  ) {
    return CaseActionType.COMPLETE_CANCELLED_CASE
  }

  return CaseActionType.OPEN_CASE
}

export const canDeleteRequestCase = (
  caseToDelete: Pick<Case, 'state'>,
): boolean => {
  return (
    caseToDelete.state === CaseState.NEW ||
    caseToDelete.state === CaseState.DRAFT ||
    caseToDelete.state === CaseState.SUBMITTED ||
    caseToDelete.state === CaseState.RECEIVED
  )
}

export const canDeleteIndictmentCase = (
  caseToDelete: Pick<Case, 'state'>,
): boolean => {
  return (
    caseToDelete.state === CaseState.DRAFT ||
    caseToDelete.state === CaseState.WAITING_FOR_CONFIRMATION
  )
}

export const canDeleteCase = (
  caseToDelete: Pick<Case, 'type' | 'state'>,
  user: TUser,
): boolean => {
  if (!isProsecutionUser(user)) {
    return false
  }

  if (isRequestCase(caseToDelete.type)) {
    return canDeleteRequestCase(caseToDelete)
  }

  if (isIndictmentCase(caseToDelete.type)) {
    return canDeleteIndictmentCase(caseToDelete)
  }

  return false
}

export const canCancelAppeal = (
  theCase: Pick<Case, 'type' | 'appealState' | 'prosecutorPostponedAppealDate'>,
  user: TUser,
): boolean => {
  if (!isProsecutionUser(user) || !isRequestCase(theCase.type)) {
    return false
  }

  if (
    (theCase.appealState === CaseAppealState.APPEALED ||
      theCase.appealState === CaseAppealState.RECEIVED) &&
    theCase.prosecutorPostponedAppealDate
  ) {
    return true
  }

  return false
}

export const getContextMenuActions = (
  theCase: Pick<
    Case,
    'type' | 'state' | 'appealState' | 'prosecutorPostponedAppealDate'
  >,
  user: TUser,
): ContextMenuCaseActionType[] => {
  if (
    isDistrictCourtUser(user) &&
    isIndictmentCase(theCase.type) &&
    theCase.state === CaseState.WAITING_FOR_CANCELLATION
  ) {
    return []
  }

  const actions = [ContextMenuCaseActionType.OPEN_CASE_IN_NEW_TAB]

  if (canDeleteCase(theCase, user)) {
    actions.push(ContextMenuCaseActionType.DELETE_CASE)
  }

  if (canCancelAppeal(theCase, user)) {
    actions.push(ContextMenuCaseActionType.WITHDRAW_APPEAL)
  }

  return actions
}

/** Normalize case type for display (e.g. custody with travel ban decision → travel ban). */
export const normalizeCaseTypeForDisplay = (
  type: CaseType,
  decision: CaseDecision | undefined,
): CaseType => {
  if (
    type === CaseType.CUSTODY &&
    decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
  ) {
    return CaseType.TRAVEL_BAN
  }
  return type
}
