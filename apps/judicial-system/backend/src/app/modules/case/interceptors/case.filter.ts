import { CaseState, UserRole } from '@island.is/judicial-system/types'

export function isStateVisibleToRole(
  state: CaseState,
  role: UserRole,
): unknown {
  return state !== CaseState.NEW || role === UserRole.PROSECUTOR
}
