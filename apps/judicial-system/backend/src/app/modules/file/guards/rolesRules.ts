import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { CaseFileCategory, UserRole } from '@island.is/judicial-system/types'

export const defenderFileRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.BASIC,
  canActivate: (request) => {
    const caseFile = request.caseFile

    // Deny if case file is not a ruling
    if (!caseFile || caseFile.category !== CaseFileCategory.RULING) {
      return false
    }

    return true
  },
}
