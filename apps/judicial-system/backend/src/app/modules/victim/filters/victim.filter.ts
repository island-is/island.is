import { User } from '@island.is/judicial-system/types'
import {
  CaseState,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'

import { MinimalCase } from '../../case/models/case.types'

export const canUserEditVictim = (
  theCase: MinimalCase,
  user: User,
): boolean => {
  if (isProsecutionUser(user)) {
    return canProsecutionUserEditVictim(theCase)
  }
  if (isDistrictCourtUser(user)) {
    return canDistrictCourtUserEditVictim(theCase)
  }
  // No other users currently need to edit victims
  return false
}

const canProsecutionUserEditVictim = (theCase: MinimalCase): boolean => {
  if (theCase.state in [CaseState.NEW, CaseState.DRAFT]) {
    return true
  }

  return false
}

const canDistrictCourtUserEditVictim = (theCase: MinimalCase): boolean => {
  if (theCase.state in [CaseState.SUBMITTED, CaseState.RECEIVED]) {
    return true
  }

  return false
}
