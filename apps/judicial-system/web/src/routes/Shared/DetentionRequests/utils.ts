import { TagVariant } from '@island.is/island-ui/core'
import { CaseState, UserRole } from '@island.is/judicial-system/types'
import router from 'next/router'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const mapCaseStateToTagVariant = (
  state: CaseState,
  isJudge: boolean,
  isCustodyEndDateInThePast?: boolean,
): { color: TagVariant; text: string } => {
  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
      return { color: 'red', text: 'Drög' }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: `${isJudge ? 'Ný krafa' : 'Krafa send'}`,
      }
    case CaseState.RECEIVED:
      return { color: 'darkerMint', text: 'Krafa móttekin' }
    case CaseState.ACCEPTED:
      if (isCustodyEndDateInThePast) {
        return {
          color: 'darkerBlue',
          text: 'Lokið',
        }
      } else {
        return {
          color: 'blue',
          text: 'Virkt',
        }
      }
    case CaseState.REJECTED:
      return { color: 'rose', text: 'Kröfu hafnað' }
    default:
      return { color: 'white', text: 'Óþekkt' }
  }
}

export const openCase = (
  caseState: CaseState,
  caseId: string,
  role?: UserRole,
  isCourtDateInThePast?: boolean,
): void => {
  if (caseState === CaseState.ACCEPTED || caseState === CaseState.REJECTED) {
    router.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${caseId}`)
  } else if (role === UserRole.JUDGE || role === UserRole.REGISTRAR) {
    router.push(`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${caseId}`)
  } else if (caseState === CaseState.RECEIVED && isCourtDateInThePast) {
    router.push(`${Constants.STEP_FIVE_ROUTE}/${caseId}`)
  } else {
    router.push(`${Constants.STEP_ONE_ROUTE}/${caseId}`)
  }
}
