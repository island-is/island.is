import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  CaseTransition,
  UserRole,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { UpdateCaseDto } from '../dto/updateCase.dto'

const prosecutorFields: (keyof UpdateCaseDto)[] = [
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
  'requestDriversLicenseSuspension',
]

const courtFields: (keyof UpdateCaseDto)[] = [
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

const staffFields: (keyof UpdateCaseDto)[] = [
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
    CaseTransition.APPEAL,
  ],
}

// Allows representatives to open, submit and delete cases
// Note that representatives can only access indictment cases
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

// Allows defenders to appeal cases.
// Note that defenders can not appeal indictment cases.
export const defenderTransitionRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [CaseTransition.APPEAL],
}

// Allows judges to receive, accept, reject and dismiss cases,
// and to reopen non indictment cases
export const judgeTransitionRule: RolesRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REJECT,
    CaseTransition.DISMISS,
    CaseTransition.REOPEN,
    CaseTransition.RECEIVE_APPEAL,
  ],
  canActivate: (request) => {
    const theCase = request.case

    // Deny if the case is missing - shuould never happen
    if (!theCase) {
      return false
    }

    // Deny if rejecting, dismissing or reopening an indictment case
    if (
      isIndictmentCase(theCase.type) &&
      [
        CaseTransition.REJECT,
        CaseTransition.DISMISS,
        CaseTransition.REOPEN,
      ].includes(request.body.transition)
    ) {
      return false
    }

    return true
  },
}

// Allows registrars to receive cases,
// to accept indictment cases,
// and to reopen non indictment cases
export const registrarTransitionRule: RolesRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REOPEN,
  ],
  canActivate: (request) => {
    const theCase = request.case

    // Deny if the case is missing - shuould never happen
    if (!theCase) {
      return false
    }

    // Deny if accepting a non indictment case
    if (
      !isIndictmentCase(theCase.type) &&
      request.body.transition === CaseTransition.ACCEPT
    ) {
      return false
    }

    // Deny if reopening an indictment case
    if (
      isIndictmentCase(theCase.type) &&
      request.body.transition === CaseTransition.REOPEN
    ) {
      return false
    }

    return true
  },
}

// Allows assistants to receive, accept, reject and dismiss cases
// Note that assistants can only access indictment cases
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
