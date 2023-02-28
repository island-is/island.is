import { literal, Op, WhereOptions } from 'sequelize'

import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseType,
  completedCaseStates,
  hasCaseBeenAppealed,
  indictmentCases,
  InstitutionType,
  investigationCases,
  isIndictmentCase,
  restrictionCases,
  UserRole,
  isExtendedCourtRole,
  isProsecutionRole,
  isCourtRole,
} from '@island.is/judicial-system/types'
import type { User, Case as TCase } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

const hideArchived = { isArchived: false }

function getAllowedStates(
  role: UserRole,
  institutionType?: InstitutionType,
  caseType?: CaseType,
): CaseState[] {
  if (isProsecutionRole(role)) {
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
      role === UserRole.ASSISTANT ||
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
  role: UserRole,
  institutionType?: InstitutionType,
  caseType?: CaseType,
): CaseState[] {
  const allowedStates = getAllowedStates(role, institutionType, caseType)

  return Object.values(CaseState).filter(
    (state) => !allowedStates.includes(state as CaseState),
  )
}

function prosecutorsOfficeMustMatchUserInstitution(role: UserRole): boolean {
  return isProsecutionRole(role)
}

function courtMustMatchUserInstitution(role: UserRole): boolean {
  return isExtendedCourtRole(role)
}

function isStateHiddenFromRole(
  state: CaseState,
  role: UserRole,
  caseType: CaseType,
  institutionType?: InstitutionType,
): boolean {
  return getBlockedStates(role, institutionType, caseType).includes(state)
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
    [
      UserRole.JUDGE,
      UserRole.REGISTRAR,
      UserRole.PROSECUTOR,
      UserRole.DEFENDER,
    ].includes(role)
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
    prosecutorsOfficeMustMatchUserInstitution(user.role) &&
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
    isProsecutionRole(user.role) &&
    Boolean(isHeightenedSecurityLevel) &&
    user.id !== creatingProsecutorId &&
    user.id !== prosecutorId
  )
}

const lifetime = literal('current_date - 90')
const indictmentLifetime = literal('current_date - 180')

export const oldFilter = {
  [Op.or]: [
    {
      [Op.and]: [
        { type: [...restrictionCases, ...investigationCases] },
        {
          state: [
            CaseState.NEW,
            CaseState.DRAFT,
            CaseState.SUBMITTED,
            CaseState.RECEIVED,
          ],
        },
        { created: { [Op.lt]: lifetime } },
      ],
    },
    {
      [Op.and]: [
        { type: restrictionCases },
        { state: [CaseState.REJECTED, CaseState.DISMISSED] },
        { ruling_date: { [Op.lt]: lifetime } },
      ],
    },
    {
      [Op.and]: [
        { type: restrictionCases },
        { state: CaseState.ACCEPTED },
        { valid_to_date: { [Op.lt]: lifetime } },
      ],
    },
    {
      [Op.and]: [
        { type: investigationCases },
        { state: completedCaseStates },
        { ruling_date: { [Op.lt]: lifetime } },
      ],
    },
    {
      [Op.and]: [
        { type: indictmentCases },
        { state: completedCaseStates },
        { ruling_date: { [Op.lt]: indictmentLifetime } },
      ],
    },
  ],
}

export function isCaseBlockedFromUser(
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean {
  return (
    isStateHiddenFromRole(
      theCase.state,
      user.role,
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

function getStaffCasesQueryFilter(
  institutionType?: InstitutionType,
): WhereOptions {
  return institutionType === InstitutionType.PRISON_ADMIN
    ? {
        [Op.and]: [
          { isArchived: false },
          { state: CaseState.ACCEPTED },
          {
            type: [
              CaseType.ADMISSION_TO_FACILITY,
              CaseType.CUSTODY,
              CaseType.TRAVEL_BAN,
            ],
          },
        ],
      }
    : {
        [Op.and]: [
          { isArchived: false },
          { state: CaseState.ACCEPTED },
          { type: [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY] },
          {
            decision: [
              CaseDecision.ACCEPTING,
              CaseDecision.ACCEPTING_PARTIALLY,
            ],
          },
        ],
      }
}

export function getCasesQueryFilter(user: User): WhereOptions {
  if (user.role === UserRole.STAFF) {
    return getStaffCasesQueryFilter(user.institution?.type)
  }

  const blockStates = {
    [Op.not]: { state: getBlockedStates(user.role, user.institution?.type) },
  }

  const blockInstitutions = isProsecutionRole(user.role)
    ? {
        [Op.or]: [
          { creating_prosecutor_id: { [Op.is]: null } },
          { '$creatingProsecutor.institution_id$': user.institution?.id },
          { shared_with_prosecutors_office_id: user.institution?.id },
        ],
      }
    : user.institution?.type === InstitutionType.HIGH_COURT
    ? {
        [Op.or]: [
          { accused_appeal_decision: CaseAppealDecision.APPEAL },
          { prosecutor_appeal_decision: CaseAppealDecision.APPEAL },
          { accused_postponed_appeal_date: { [Op.not]: null } },
          { prosecutor_postponed_appeal_date: { [Op.not]: null } },
        ],
      }
    : {
        [Op.or]: [
          { court_id: { [Op.is]: null } },
          { court_id: user.institution?.id },
        ],
      }

  const blockHightenedSecurity = isProsecutionRole(user.role)
    ? [
        {
          [Op.or]: [
            { is_heightened_security_level: { [Op.is]: null } },
            { is_heightened_security_level: false },
            { creating_prosecutor_id: user.id },
            { prosecutor_id: user.id },
          ],
        },
      ]
    : []

  const blockDraftIndictmentsForCourt = isCourtRole(user.role)
    ? [
        {
          [Op.not]: {
            [Op.and]: [{ state: CaseState.DRAFT }, { type: indictmentCases }],
          },
        },
      ]
    : []

  const restrictCaseTypes =
    user.role === UserRole.REPRESENTATIVE || user.role === UserRole.ASSISTANT
      ? [{ type: indictmentCases }]
      : []

  return {
    [Op.and]: [
      hideArchived,
      blockStates,
      blockInstitutions,
      ...blockHightenedSecurity,
      ...blockDraftIndictmentsForCourt,
      ...restrictCaseTypes,
    ],
  }
}
