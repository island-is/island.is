import { CaseState, UserRole } from '@island.is/judicial-system/types'

export function isStateVisibleToRole(
  state: CaseState,
  role: UserRole,
): boolean {
  return state !== CaseState.NEW || role === UserRole.PROSECUTOR
}
