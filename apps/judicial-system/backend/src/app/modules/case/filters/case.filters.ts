import { CaseState, User, UserRole } from '@island.is/judicial-system/types'

import { Case } from '../models'

export function isStateHiddenFromRole(
  state: CaseState,
  role: UserRole,
): boolean {
  return state === CaseState.NEW && role !== UserRole.PROSECUTOR
}

export function isProsecutorInstitutionHiddenFromUser(
  prosecutorInstitutionId: String,
  user: User,
): boolean {
  return (
    prosecutorInstitutionId &&
    user?.role === UserRole.PROSECUTOR &&
    prosecutorInstitutionId !== user?.institution?.id
  )
}

export function isCaseBlockedFromUser(theCase: Case, user: User): boolean {
  return (
    isStateHiddenFromRole(theCase?.state, user?.role) ||
    isProsecutorInstitutionHiddenFromUser(
      theCase?.prosecutor?.institutionId,
      user,
    )
  )
}
