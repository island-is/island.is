import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  xCaseTransition,
  UserRole,
  UpdateCase,
} from '@island.is/judicial-system/types'

const prosecutorFields: (keyof UpdateCase)[] = [
  'type',
  'indictmentSubtypes',
  'description',
  'policeCaseNumbers',
  'defenderName',
  'defenderNationalId',
  'defenderEmail',
  'defenderPhoneNumber',
  'sendRequestToDefender',
  'isHeightenedSecurityLevel',
  'courtId',
  'leadInvestigator',
  'arrestDate',
  'requestedCourtDate',
  'translator',
  'requestedValidToDate',
  'validToDate',
  'demands',
  'lawsBroken',
  'legalBasis',
  'legalProvisions',
  'requestedCustodyRestrictions',
  'requestedOtherRestrictions',
  'caseFacts',
  'legalArguments',
  'requestProsecutorOnlySession',
  'prosecutorOnlySessionRequest',
  'comments',
  'caseFilesComments',
  'prosecutorId',
  'sharedWithProsecutorsOfficeId',
  'caseModifiedExplanation',
  'isolationToDate',
  'caseResentExplanation',
  'crimeScenes',
]

// Allows prosecutors to update a specific set of fields
export const prosecutorUpdateRule = {
  role: UserRole.Prosecutor,
  type: RulesType.FIELD,
  dtoFields: prosecutorFields,
} as RolesRule

// Allows representatives to update a specific set of fields
export const representativeUpdateRule = {
  role: UserRole.Representative,
  type: RulesType.FIELD,
  dtoFields: prosecutorFields,
} as RolesRule

const courtFields: (keyof UpdateCase)[] = [
  'defenderName',
  'defenderNationalId',
  'defenderEmail',
  'defenderPhoneNumber',
  'courtCaseNumber',
  'sessionArrangements',
  'courtDate',
  'courtLocation',
  'courtRoom',
  'courtStartDate',
  'courtEndTime',
  'isClosedCourtHidden',
  'courtAttendees',
  'prosecutorDemands',
  'courtDocuments',
  'sessionBookings',
  'courtCaseFacts',
  'introduction',
  'courtLegalArguments',
  'ruling',
  'decision',
  'validToDate',
  'isCustodyIsolation',
  'isolationToDate',
  'conclusion',
  'endOfSessionBookings',
  'accusedAppealDecision',
  'accusedAppealAnnouncement',
  'prosecutorAppealDecision',
  'prosecutorAppealAnnouncement',
  'accusedPostponedAppealDate',
  'prosecutorPostponedAppealDate',
  'judgeId',
  'registrarId',
  'caseModifiedExplanation',
  'rulingModifiedHistory',
  'subpoenaType',
  'defendantWaivesRightToCounsel',
  'prosecutorId',
]

const staffFields: (keyof UpdateCase)[] = [
  'validToDate',
  'isolationToDate',
  'caseModifiedExplanation',
]

// Allows judges to update a specific set of fields
export const judgeUpdateRule = {
  role: UserRole.Judge,
  type: RulesType.FIELD,
  dtoFields: courtFields,
} as RolesRule

// Allows registrars to update a specific set of fields
export const registrarUpdateRule = {
  role: UserRole.Registrar,
  type: RulesType.FIELD,
  dtoFields: courtFields,
} as RolesRule

// Allows assistants to update a specific set of fields
export const assistantUpdateRule = {
  role: UserRole.Assistant,
  type: RulesType.FIELD,
  dtoFields: courtFields,
} as RolesRule

// Allows staff to update a specific set of fields
// In practice, only prison admins will be able to update these fields,
// as write access is blocked for other staff roles
export const staffUpdateRule = {
  role: UserRole.Staff,
  type: RulesType.FIELD,
  dtoFields: staffFields,
} as RolesRule

// Allows prosecutors to open, submit and delete cases
export const prosecutorTransitionRule = {
  role: UserRole.Prosecutor,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    xCaseTransition.OPEN,
    xCaseTransition.SUBMIT,
    xCaseTransition.DELETE,
  ],
} as RolesRule

// Allows representatives to open, submit and delete cases
export const representativeTransitionRule = {
  role: UserRole.Representative,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    xCaseTransition.OPEN,
    xCaseTransition.SUBMIT,
    xCaseTransition.DELETE,
  ],
} as RolesRule

// Allows judges to receive, accept, reject and dismiss cases
export const judgeTransitionRule = {
  role: UserRole.Judge,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    xCaseTransition.RECEIVE,
    xCaseTransition.ACCEPT,
    xCaseTransition.REJECT,
    xCaseTransition.DISMISS,
  ],
} as RolesRule

// Allows registrars to receive cases
export const registrarTransitionRule = {
  role: UserRole.Registrar,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [xCaseTransition.RECEIVE],
} as RolesRule

// Allows assistants to receive, accept, reject and dismiss cases
export const assistantTransitionRule = {
  role: UserRole.Assistant,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    xCaseTransition.RECEIVE,
    xCaseTransition.ACCEPT,
    xCaseTransition.REJECT,
    xCaseTransition.DISMISS,
  ],
} as RolesRule
