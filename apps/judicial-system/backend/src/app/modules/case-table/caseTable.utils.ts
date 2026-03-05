import {
  CaseActionType,
  CaseAppealState,
  CaseState,
  ContextMenuCaseActionType,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
  isRequestCase,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'

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
