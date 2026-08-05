import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { User, UserRole } from '@island.is/judicial-system/types'

import { Case } from '../../repository'

// Allows the registered district court judge to confirm a ruling order
// uploaded during the course of an indictment case
export const districtCourtJudgeConfirmRulingOrderRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_JUDGE,
  type: RulesType.BASIC,
  canActivate: (request) => {
    const user: User = request.user?.currentUser
    const theCase: Case = request.case

    // Deny if something is missing - should never happen
    if (!user || !theCase) {
      return false
    }

    return user.id === theCase.judgeId
  },
}
