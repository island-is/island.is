import {
  CaseDecision,
  CaseState,
  CaseType,
  hasCaseBeenAppealed,
  indictmentCases,
  InstitutionType,
  investigationCases,
  isIndictmentCase,
  restrictionCases,
  UserRole,
  isExtendedCourtRole,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import type { User, Case as TCase } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

function getAllowedStates(
  user: User,
  institutionType?: InstitutionType,
  caseType?: CaseType,
): CaseState[] {
  if (isProsecutionUser(user)) {
    return [
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
    ]
  }

  if (institutionType === InstitutionType.COURT) {
    if (
      user.role === UserRole.ASSISTANT ||
      (caseType && isIndictmentCase(caseType))
    ) {
      return [
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]
    }

    return [
      CaseState.DRAFT,
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
    ]
  }

  if (institutionType === InstitutionType.HIGH_COURT) {
    return [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED]
  }

  return [CaseState.ACCEPTED]
}

function getBlockedStates(
  user: User,
  institutionType?: InstitutionType,
  caseType?: CaseType,
): CaseState[] {
  const allowedStates = getAllowedStates(user, institutionType, caseType)

  return Object.values(CaseState).filter(
    (state) => !allowedStates.includes(state as CaseState),
  )
}

function prosecutorsOfficeMustMatchUserInstitution(user: User): boolean {
  return isProsecutionUser(user)
}

function courtMustMatchUserInstitution(role: UserRole): boolean {
  return isExtendedCourtRole(role)
}

function isStateHiddenFromRole(
  state: CaseState,
  user: User,
  caseType: CaseType,
  institutionType?: InstitutionType,
): boolean {
  return getBlockedStates(user, institutionType, caseType).includes(state)
}

function getAllowedTypes(
  role: UserRole,
  forUpdate: boolean,
  institutionType?: InstitutionType,
): CaseType[] {
  if (role === UserRole.ADMIN) {
    return [] // admins should only handle user management
  }

  if (role === UserRole.REPRESENTATIVE || role === UserRole.ASSISTANT) {
    return indictmentCases
  }

  if (
    [UserRole.JUDGE, UserRole.REGISTRAR, UserRole.PROSECUTOR].includes(role)
  ) {
    return [...indictmentCases, ...investigationCases, ...restrictionCases]
  }

  if (institutionType === InstitutionType.PRISON_ADMIN) {
    return [
      CaseType.CUSTODY,
      CaseType.ADMISSION_TO_FACILITY,
      ...(forUpdate ? [] : [CaseType.TRAVEL_BAN]),
    ]
  }

  return forUpdate ? [] : [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY]
}

function isTypeHiddenFromRole(
  type: CaseType,
  role: UserRole,
  forUpdate: boolean,
  institutionType?: InstitutionType,
): boolean {
  return !getAllowedTypes(role, forUpdate, institutionType).includes(type)
}

function isDecisionHiddenFromInstitution(
  decision?: CaseDecision,
  institutionType?: InstitutionType,
): boolean {
  return (
    institutionType === InstitutionType.PRISON &&
    decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
  )
}

function isProsecutorsOfficeCaseHiddenFromUser(
  user: User,
  forUpdate: boolean,
  prosecutorInstitutionId?: string,
  sharedWithProsecutorsOfficeId?: string,
): boolean {
  return (
    prosecutorsOfficeMustMatchUserInstitution(user) &&
    Boolean(prosecutorInstitutionId) &&
    prosecutorInstitutionId !== user.institution?.id &&
    (forUpdate ||
      !sharedWithProsecutorsOfficeId ||
      sharedWithProsecutorsOfficeId !== user.institution?.id)
  )
}

function isCourtCaseHiddenFromUser(
  user: User,
  forUpdate: boolean,
  hasCaseBeenAppealed: boolean,
  courtId?: string,
): boolean {
  return (
    courtMustMatchUserInstitution(user.role) &&
    Boolean(courtId) &&
    courtId !== user.institution?.id &&
    (forUpdate ||
      !hasCaseBeenAppealed ||
      user.institution?.type !== InstitutionType.HIGH_COURT)
  )
}

function isHightenedSecurityCaseHiddenFromUser(
  user: User,
  isHeightenedSecurityLevel?: boolean,
  creatingProsecutorId?: string,
  prosecutorId?: string,
): boolean {
  return (
    isProsecutionUser(user) &&
    Boolean(isHeightenedSecurityLevel) &&
    user.id !== creatingProsecutorId &&
    user.id !== prosecutorId
  )
}

export function isCaseBlockedFromUser(
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean {
  return (
    isStateHiddenFromRole(
      theCase.state,
      user,
      theCase.type,
      user.institution?.type,
    ) ||
    isTypeHiddenFromRole(
      theCase.type,
      user.role,
      forUpdate,
      user.institution?.type,
    ) ||
    isDecisionHiddenFromInstitution(theCase.decision, user.institution?.type) ||
    isProsecutorsOfficeCaseHiddenFromUser(
      user,
      forUpdate,
      theCase.creatingProsecutor?.institutionId,
      theCase.sharedWithProsecutorsOfficeId,
    ) ||
    isCourtCaseHiddenFromUser(
      user,
      forUpdate,
      hasCaseBeenAppealed((theCase as unknown) as TCase),
      theCase.courtId,
    ) ||
    isHightenedSecurityCaseHiddenFromUser(
      user,
      theCase.isHeightenedSecurityLevel,
      theCase.creatingProsecutor?.id,
      theCase.prosecutor?.id,
    )
  )
}
