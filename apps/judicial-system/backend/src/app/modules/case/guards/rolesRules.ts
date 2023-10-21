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
  'judgeId',
  'registrarId',
  'caseModifiedExplanation',
  'rulingModifiedHistory',
  'defendantWaivesRightToCounsel',
  'prosecutorId',
  'appealCaseNumber',
  'appealAssistantId',
  'appealJudge1Id',
  'appealJudge2Id',
  'appealJudge3Id',
  'appealConclusion',
  'appealRulingDecision',
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

// Allows defenders to update a specific set of fields
export const defenderUpdateRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD,
  dtoFields: limitedAccessFields,
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

// Allows prosecutor representatives to open, submit and delete cases
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

// Allows defenders to appeal cases.
// Note that defenders can not appeal indictment cases.
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

// Allows judges to receive, accept, reject and dismiss cases,
// to receive and complete appeals,
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
    CaseTransition.COMPLETE_APPEAL,
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
        CaseTransition.COMPLETE_APPEAL,
      ].includes(request.body.transition)
    ) {
      return false
    }

    return true
  },
}

// Allows registrars to receive cases,
// to accept indictment cases,
// to receive and complete appeals,
// and to reopen non indictment cases.
export const registrarTransitionRule: RolesRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REOPEN,
    CaseTransition.RECEIVE_APPEAL,
    CaseTransition.COMPLETE_APPEAL,
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
      [
        CaseTransition.REOPEN,
        CaseTransition.RECEIVE_APPEAL,
        CaseTransition.COMPLETE_APPEAL,
      ].includes(request.body.transition)
    ) {
      return false
    }

    return true
  },
}

// Allows assistants to receive and accept indictment cases,
// and to receive and complete appeals.
export const assistantTransitionRule: RolesRule = {
  role: UserRole.ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.RECEIVE_APPEAL,
    CaseTransition.COMPLETE_APPEAL,
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
      [CaseTransition.RECEIVE, CaseTransition.ACCEPT].includes(
        request.body.transition,
      )
    ) {
      return false
    }

    // Deny certain transitions on indictment cases
    if (
      isIndictmentCase(theCase.type) &&
      [CaseTransition.RECEIVE_APPEAL, CaseTransition.COMPLETE_APPEAL].includes(
        request.body.transition,
      )
    ) {
      return false
    }

    return true
  },
}
