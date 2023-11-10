import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  CaseTransition,
  isIndictmentCase,
  UserRole,
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
  'requestSharedWithDefender',
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
  'prosecutorStatementDate',
]

const districtCourtFields: (keyof UpdateCaseDto)[] = [
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
  'judgeId',
  'registrarId',
  'caseModifiedExplanation',
  'rulingModifiedHistory',
  'defendantWaivesRightToCounsel',
  'prosecutorId',
]

const courtOfAppealsFields: (keyof UpdateCaseDto)[] = [
  'appealCaseNumber',
  'appealAssistantId',
  'appealJudge1Id',
  'appealJudge2Id',
  'appealJudge3Id',
  'appealConclusion',
  'appealRulingDecision',
  'appealRulingModifiedHistory',
]

const limitedAccessFields: (keyof UpdateCaseDto)[] = ['defendantStatementDate']

// Allows prosecutors to update a specific set of fields
export const prosecutorUpdateRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD,
  dtoFields: prosecutorFields,
}

// Allows prosecutor representatives to update a specific set of fields
export const prosecutorRepresentativeUpdateRule: RolesRule = {
  role: UserRole.PROSECUTOR_REPRESENTATIVE,
  type: RulesType.FIELD,
  dtoFields: prosecutorFields,
}

// Allows district court judges to update a specific set of fields
export const districtCourtJudgeUpdateRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_JUDGE,
  type: RulesType.FIELD,
  dtoFields: districtCourtFields,
}

// Allows district court registrars to update a specific set of fields
export const districtCourtRegistrarUpdateRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: districtCourtFields,
}

// Allows district court assistants to update a specific set of fields
export const districtCourtAssistantUpdateRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_ASSISTANT,
  type: RulesType.FIELD,
  dtoFields: districtCourtFields,
}

// Allows court of appeals judges to update a specific set of fields
export const courtOfAppealsJudgeUpdateRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsFields,
}

// Allows court of appeals registrars to update a specific set of fields
export const courtOfAppealsRegistrarUpdateRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsFields,
}

// Allows court of appeals assistants to update a specific set of fields
export const courtOfAppealsAssistantUpdateRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsFields,
}

// Allows defenders to update a specific set of fields
export const defenderUpdateRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD,
  dtoFields: limitedAccessFields,
}

// Allows prosecutors to transition cases
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
  canActivate: (request) => {
    const theCase = request.case

    // Deny if the case is missing - shuould never happen
    if (!theCase) {
      return false
    }

    // Deny certain transitions on indictment cases
    if (
      isIndictmentCase(theCase.type) &&
      request.body.transition === CaseTransition.APPEAL
    ) {
      return false
    }

    return true
  },
}

// Allows prosecutor representatives to transition cases
// Note that prosecutor representatives can only access indictment cases
export const prosecutorRepresentativeTransitionRule: RolesRule = {
  role: UserRole.PROSECUTOR_REPRESENTATIVE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.OPEN,
    CaseTransition.SUBMIT,
    CaseTransition.DELETE,
  ],
}

// Allows defenders to transition cases
export const defenderTransitionRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [CaseTransition.APPEAL],
  canActivate: (request) => {
    const theCase = request.case

    // Deny if the case is missing - should never happen
    if (!theCase) {
      return false
    }

    // Deny transitions on indictment cases
    if (isIndictmentCase(theCase.type)) {
      return false
    }

    return true
  },
}

// Allows judges to transition cases
export const districtCourtJudgeTransitionRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_JUDGE,
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

    // Deny certain transitions on indictment cases
    if (
      isIndictmentCase(theCase.type) &&
      [
        CaseTransition.REJECT,
        CaseTransition.DISMISS,
        CaseTransition.REOPEN,
        CaseTransition.RECEIVE_APPEAL,
      ].includes(request.body.transition)
    ) {
      return false
    }

    return true
  },
}

// Allows registrars to transition cases
export const districtCourtRegistrarTransitionRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REOPEN,
    CaseTransition.RECEIVE_APPEAL,
  ],
  canActivate: (request) => {
    const theCase = request.case

    // Deny if the case is missing - shuould never happen
    if (!theCase) {
      return false
    }

    // Deny certain transactions on non indictment cases
    if (
      !isIndictmentCase(theCase.type) &&
      request.body.transition === CaseTransition.ACCEPT
    ) {
      return false
    }

    // Deny certain transitions on indictment cases
    if (
      isIndictmentCase(theCase.type) &&
      [CaseTransition.REOPEN, CaseTransition.RECEIVE_APPEAL].includes(
        request.body.transition,
      )
    ) {
      return false
    }

    return true
  },
}

// Allows district court assistants to receive and accept indictment cases.
export const districtCourtAssistantTransitionRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [CaseTransition.RECEIVE, CaseTransition.ACCEPT],
  // canActivate: no need for further restrictions as district court assistants can only access indictment cases
}

// Allows court of appeals judges to complete appeals.
export const courtOfAppealsJudgeTransitionRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.COMPLETE_APPEAL,
    CaseTransition.REOPEN_APPEAL,
  ],
  // canActivate: no need for further restrictions as court of appeals judges can only access appealed non-indictment cases
}

// Allows court of appeals registrars to complete appeals.
export const courtOfAppealsRegistrarTransitionRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.COMPLETE_APPEAL,
    CaseTransition.REOPEN_APPEAL,
  ],
  // canActivate: no need for further restrictions as court of appeals registrars can only access appealed non-indictment cases
}

// Allows court of appeals assistants to complete appeals.
export const courtOfAppealsAssistantTransitionRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.COMPLETE_APPEAL,
    CaseTransition.REOPEN_APPEAL,
  ],
  // canActivate: no need for further restrictions as court of appeals assistants can only access appealed non-indictment cases
}
