import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  AppealCaseTransition,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, Case } from '../../repository'
import {
  canWithdrawCaseLevelAppeal,
  isInCourtRulingOrderAppeal,
  userHasActiveInCourtAppeal,
} from '../appealCase.helpers'
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

// Determines whether the user (prosecution or defence) is an appellant of the
// appeal case being transitioned, and so may withdraw it. Handles case-level and
// ruling-order, in-court and out-of-court appeals.
const userAppealedAppealCase = (request: {
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

  // In-court ruling-order appeals are per party and withdrawn on the decision
  // row, which is the live state; the event log only catches up on confirmation.
  // So authorize from the decision: the user's party appealed in court and has
  // not already withdrawn.
  if (
    appealCase.rulingFileId &&
    isInCourtRulingOrderAppeal(theCase, appealCase.rulingFileId)
  ) {
    return userHasActiveInCourtAppeal(theCase, appealCase.rulingFileId, user)
  }

  // Out-of-court and case-level appeals: the appellant is read from the APPEALED
  // event log, resolved to the current representative (survives a defender swap).
  // For request cases the defence cannot withdraw a shared appeal the prosecution
  // also made (prosecution precedence), so authorize through canWithdraw... rather
  // than plain userIsAppellant.
  return canWithdrawCaseLevelAppeal(theCase, appealCase, user)
}

// Prosecutor transition rules
export const prosecutorTransitionRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.WITHDRAW_APPEAL],
  canActivate: (request) => userAppealedAppealCase(request),
}
export const prosecutorRepresentativeTransitionRule: RolesRule = {
  role: UserRole.PROSECUTOR_REPRESENTATIVE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.WITHDRAW_APPEAL],
  canActivate: (request) => userAppealedAppealCase(request),
}

export const defenderTransitionRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [AppealCaseTransition.WITHDRAW_APPEAL],
  canActivate: (request) => userAppealedAppealCase(request),
}
