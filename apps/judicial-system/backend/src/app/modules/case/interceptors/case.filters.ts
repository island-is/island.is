import { CaseState, User, UserRole } from '@island.is/judicial-system/types'
import { String } from 'aws-sdk/clients/apigateway'

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
