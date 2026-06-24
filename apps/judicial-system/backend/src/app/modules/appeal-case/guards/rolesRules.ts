import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  AppealCaseTransition,
  isIndictmentCase,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, Case, User } from '../../repository'
import { UpdateAppealCaseDto } from '../dto/updateAppealCase.dto'

const prosecutorFields: (keyof UpdateAppealCaseDto)[] = [
  'requestAppealRulingNotToBePublished',
]

const courtOfAppealsUpdateFields: (keyof UpdateAppealCaseDto)[] = [
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
  dtoFields: courtOfAppealsUpdateFields,
}

export const courtOfAppealsRegistrarUpdateRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsUpdateFields,
}

export const courtOfAppealsAssistantUpdateRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  type: RulesType.FIELD,
  dtoFields: courtOfAppealsUpdateFields,
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

// Prosecutor update rules (statement date)
export const prosecutorUpdateRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD,
  dtoFields: prosecutorFields,
}

export const prosecutorRepresentativeUpdateRule: RolesRule = {
  role: UserRole.PROSECUTOR_REPRESENTATIVE,
  type: RulesType.FIELD,
  dtoFields: prosecutorFields,
}

// Determines whether the prosecution is the appellant of the appeal case being
// transitioned. Considers the current appeal case so both case-level and
// ruling-order appeals are handled.
const prosecutionAppealedAppealCase = (request: {
  case?: Case
  appealCase?: AppealCase
}): boolean => {
  const theCase = request.case
  const appealCase = request.appealCase

  if (!theCase || !appealCase) {
    return false
  }

  // Ruling-order appeals (indictment cases) record the appellant on the appeal
  // case itself: a defence national id means the defence appealed, so the
  // absence of one means the prosecution is the appellant.
  if (appealCase.rulingFileId) {
    return !appealCase.appealedByNationalId
  }

  // Case-level appeals: the prosecution appealed iff the postponed appeal date
  // was set on the case.
  return Boolean(theCase.prosecutorPostponedAppealDate)
}

// Determines whether the given defender is the appellant of the appeal case
// being transitioned. Considers the current appeal case so both case-level and
// ruling-order appeals are handled.
const defenderAppealedAppealCase = (request: {
  user?: { currentUser?: User }
  case?: Case
  appealCase?: AppealCase
}): boolean => {
  const user = request.user?.currentUser
  const theCase = request.case
  const appealCase = request.appealCase

  if (!user || !theCase || !appealCase) {
    return false
  }

  // Ruling-order appeals are only available on indictment cases, so only the
  // specific defender who appealed (recorded on the appeal case) can withdraw.
  if (appealCase.rulingFileId) {
    return appealCase.appealedByNationalId === user.nationalId
  }

  // Deny withdrawal if the defence did not appeal the case
  if (!theCase.accusedPostponedAppealDate) {
    return false
  }

  // For indictment cases, only the specific defender who appealed can withdraw
  if (
    isIndictmentCase(theCase.type) &&
    appealCase.appealedByNationalId !== user.nationalId
  ) {
    return false
  }

  return true
}

// Prosecutor transition rules
export const prosecutorTransitionRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.WITHDRAW_APPEAL],
  canActivate: (request) => prosecutionAppealedAppealCase(request),
}
export const prosecutorRepresentativeTransitionRule: RolesRule = {
  role: UserRole.PROSECUTOR_REPRESENTATIVE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.WITHDRAW_APPEAL],
  canActivate: (request) => prosecutionAppealedAppealCase(request),
}

export const defenderTransitionRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.WITHDRAW_APPEAL],
  canActivate: (request) => defenderAppealedAppealCase(request),
}
