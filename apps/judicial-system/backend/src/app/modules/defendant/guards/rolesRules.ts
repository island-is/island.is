import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  isPublicProsecutionUser,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { UpdateCivilClaimantDto } from '../dto/updateCivilClaimant.dto'
import { UpdateDefendantDto } from '../dto/updateDefendant.dto'

const limitedAccessFields: (keyof UpdateDefendantDto)[] = [
  'punishmentType',
  'isRegisteredInPrisonSystem',
]

// The prosecutors who review indictments are prosecutors at the public
// prosecutors office, not at a police prosecutors office. Decides on the user
// alone, so it can run before the case is read.
export const publicProsecutionProsecutorUpdateDefendantsRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.BASIC,
  canActivate: (request: { user?: { currentUser?: User } }) =>
    isPublicProsecutionUser(request.user?.currentUser),
}

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
  'isAppealDefenderWaived',
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
