import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'

import { UpdateDefendantDto } from '../dto/updateDefendant.dto'

const limitedAccessFields: (keyof UpdateDefendantDto)[] = [
  'punishmentType',
  'isRegisteredInPrisonSystem',
]

// Allows prison staff to update a specific set of fields for defendant
export const prisonSystemStaffUpdateRule: RolesRule = {
  role: UserRole.PRISON_SYSTEM_STAFF,
  type: RulesType.FIELD,
  dtoFields: limitedAccessFields,
}
