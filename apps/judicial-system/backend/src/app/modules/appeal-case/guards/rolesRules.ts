import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  AppealCaseTransition,
  isIndictmentCase,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case, User } from '../../repository'
import { UpdateAppealCaseDto } from '../dto/updateAppealCase.dto'

const appealCaseFields: (keyof UpdateAppealCaseDto)[] = [
  'appealCaseNumber',
  'appealAssistantId',
  'appealJudge1Id',
  'appealJudge2Id',
  'appealJudge3Id',
  'appealConclusion',
  'appealRulingDecision',
  'appealRulingModifiedHistory',
  'appealValidToDate',
  'isAppealCustodyIsolation',
  'appealIsolationToDate',
]

// Court of appeals update rules
export const courtOfAppealsJudgeUpdateRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  type: RulesType.FIELD,
  dtoFields: appealCaseFields,
}

export const courtOfAppealsRegistrarUpdateRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: appealCaseFields,
}

export const courtOfAppealsAssistantUpdateRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  type: RulesType.FIELD,
  dtoFields: appealCaseFields,
}

// Court of appeals transition rules
export const courtOfAppealsJudgeTransitionRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    AppealCaseTransition.COMPLETE_APPEAL,
    AppealCaseTransition.REOPEN_APPEAL,
  ],
}

export const courtOfAppealsRegistrarTransitionRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    AppealCaseTransition.COMPLETE_APPEAL,
    AppealCaseTransition.REOPEN_APPEAL,
  ],
}

export const courtOfAppealsAssistantTransitionRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    AppealCaseTransition.COMPLETE_APPEAL,
    AppealCaseTransition.REOPEN_APPEAL,
  ],
}

// District court transition rules (receive appeal)
export const districtCourtJudgeTransitionRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.RECEIVE_APPEAL],
}

export const districtCourtRegistrarTransitionRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.RECEIVE_APPEAL],
}

// Prosecutor create/transition rules
export const prosecutorCreateRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.BASIC,
}

// Prosecutor update rules (statement date)
export const prosecutorUpdateRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD,
  dtoFields: ['prosecutorStatementDate'],
}

export const prosecutorTransitionRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.WITHDRAW_APPEAL],
  canActivate: (request) => {
    const theCase: Case = request.case

    if (!theCase) {
      return false
    }

    // Deny withdrawal if prosecutor did not appeal the case
    if (!theCase.prosecutorPostponedAppealDate) {
      return false
    }

    return true
  },
}

// Defender create/transition rules
export const defenderCreateRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.BASIC,
}

// Defender update rules (statement date)
export const defenderUpdateRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD,
  dtoFields: ['defendantStatementDate'],
}

export const defenderTransitionRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.WITHDRAW_APPEAL],
  canActivate: (request) => {
    const user: User = request.user?.currentUser
    const theCase: Case = request.case

    if (!user || !theCase) {
      return false
    }

    // Deny withdrawal if defender did not appeal the case
    if (!theCase.accusedPostponedAppealDate) {
      return false
    }

    // For indictment cases, only the specific defender who appealed can withdraw
    if (
      isIndictmentCase(theCase.type) &&
      (!theCase.appealCase?.appealedByNationalId ||
        theCase.appealCase?.appealedByNationalId !== user.nationalId)
    ) {
      return false
    }

    return true
  },
}
