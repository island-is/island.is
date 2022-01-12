import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { CaseTransition, UserRole } from '@island.is/judicial-system/types'

// Allows prosecutors to update a specific set of fields
export const prosecutorUpdateRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD,
  dtoFields: [
    'type',
    'description',
    'policeCaseNumber',
    'defenderName',
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
  ],
} as RolesRule

const courtFields = [
  'defenderName',
  'defenderEmail',
  'defenderPhoneNumber',
  'defenderIsSpokesperson',
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
  'accusedBookings',
  'litigationPresentations',
  'courtCaseFacts',
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
]

// Allows judges to update a specific set of fields
export const judgeUpdateRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD,
  dtoFields: courtFields,
} as RolesRule

// Allows registrars to update a specific set of fields
export const registrarUpdateRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: courtFields,
} as RolesRule

// Allows prosecutors to open, submit and delete cases
export const prosecutorTransitionRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.OPEN,
    CaseTransition.SUBMIT,
    CaseTransition.DELETE,
  ],
} as RolesRule

// Allows judges to receive, accept and reject cases
export const judgeTransitionRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REJECT,
    CaseTransition.DISMISS,
  ],
} as RolesRule

// Allows registrars to receive cases
export const registrarTransitionRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [CaseTransition.RECEIVE],
} as RolesRule
