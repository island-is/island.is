import {
  isPublicProsecutionOfficeUser,
  User,
} from '@island.is/judicial-system/types'
import {
  CaseState,
  isDistrictCourtUser,
} from '@island.is/judicial-system/types'

import { canPublicProsecutionUserAccessCase } from '../../case/filters/case.filter'
import { MinimalCase } from '../../case/models/case.types'

const canDistrictCourtUserEditVerdict = (theCase: MinimalCase): boolean =>
  theCase.state === CaseState.COMPLETED

export const canUserEditVerdict = (
  theCase: MinimalCase,
  user: User,
): boolean => {
  if (isDistrictCourtUser(user)) {
    return canDistrictCourtUserEditVerdict(theCase)
  }
  if (isPublicProsecutionOfficeUser(user)) {
    return canPublicProsecutionUserAccessCase(theCase)
  }
  // No other users need to edit verdicts
  return false
}
