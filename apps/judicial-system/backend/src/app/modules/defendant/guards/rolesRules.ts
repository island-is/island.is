import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'

import { UpdateCivilClaimantDto } from '../dto/updateCivilClaimant.dto'
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

// The court of appeals settles the lawyers of the appeal proceeding, and only
// those. A field rule rather than a role rule because the district court's own
// defender lives on the same defendant: who defended at the district court is
// a fact about that proceeding, and nothing this court does may rewrite it.
const courtOfAppealsDefendantFields: (keyof UpdateDefendantDto)[] = [
  'appealDefenderNationalId',
  'appealDefenderName',
  'appealDefenderEmail',
  'appealDefenderPhoneNumber',
  'appealDefenderWaived',
  'isAppealDefenderConfirmed',
]

const courtOfAppealsCivilClaimantFields: (keyof UpdateCivilClaimantDto)[] = [
  'hasAppealSpokesperson',
  'appealSpokespersonIsLawyer',
  'appealSpokespersonNationalId',
  'appealSpokespersonName',
  'appealSpokespersonEmail',
  'appealSpokespersonPhoneNumber',
  'isAppealSpokespersonConfirmed',
]

export const courtOfAppealsJudgeUpdateDefendantRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsDefendantFields,
}

export const courtOfAppealsRegistrarUpdateDefendantRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsDefendantFields,
}

export const courtOfAppealsAssistantUpdateDefendantRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsDefendantFields,
}

export const courtOfAppealsJudgeUpdateCivilClaimantRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsCivilClaimantFields,
}

export const courtOfAppealsRegistrarUpdateCivilClaimantRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsCivilClaimantFields,
}

export const courtOfAppealsAssistantUpdateCivilClaimantRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsCivilClaimantFields,
}
