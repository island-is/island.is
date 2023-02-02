import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  CaseTransition,
  UserRole,
  UpdateCase,
  isIndictmentCase,
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
  'indictmentIntroduction',
]

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

// Allows prosecutors to update a specific set of fields
export const prosecutorUpdateRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD,
  dtoFields: prosecutorFields,
}

// Allows representatives to update a specific set of fields
export const representativeUpdateRule: RolesRule = {
  role: UserRole.REPRESENTATIVE,
  type: RulesType.FIELD,
  dtoFields: prosecutorFields,
}

// Allows judges to update a specific set of fields
export const judgeUpdateRule: RolesRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD,
  dtoFields: courtFields,
}

// Allows registrars to update a specific set of fields
export const registrarUpdateRule: RolesRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: courtFields,
}

// Allows assistants to update a specific set of fields
export const assistantUpdateRule: RolesRule = {
  role: UserRole.ASSISTANT,
  type: RulesType.FIELD,
  dtoFields: courtFields,
}

// Allows staff to update a specific set of fields
// In practice, only prison admins will be able to update these fields,
// as write access is blocked for other staff roles
export const staffUpdateRule: RolesRule = {
  role: UserRole.STAFF,
  type: RulesType.FIELD,
  dtoFields: staffFields,
}

// Allows prosecutors to open, submit and delete cases
export const prosecutorTransitionRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.OPEN,
    CaseTransition.SUBMIT,
    CaseTransition.DELETE,
  ],
}

// Allows representatives to open, submit and delete cases
export const representativeTransitionRule: RolesRule = {
  role: UserRole.REPRESENTATIVE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.OPEN,
    CaseTransition.SUBMIT,
    CaseTransition.DELETE,
  ],
}

// Allows judges to receive, accept, reject and dismiss cases
export const judgeTransitionRule: RolesRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REJECT,
    CaseTransition.DISMISS,
  ],
}

// Allows registrars to receive cases
export const registrarTransitionRule: RolesRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [CaseTransition.RECEIVE, CaseTransition.ACCEPT],
  canActivate: (request) => {
    const theCase = request.case

    // Deny if accepting a non indictment case
    if (
      !theCase ||
      (!isIndictmentCase(theCase.type) &&
        request.body.transition === CaseTransition.ACCEPT)
    ) {
      return false
    }

    return true
  },
}

// Allows assistants to receive, accept, reject and dismiss cases
export const assistantTransitionRule: RolesRule = {
  role: UserRole.ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REJECT,
    CaseTransition.DISMISS,
  ],
}
