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
  isCourtRole,
  isExtendedCourtRole,
  isIndictmentCase,
  isProsecutionRole,
  restrictionCases,
  UserRole,
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
      CaseState.New,
      CaseState.Draft,
      CaseState.Submitted,
      CaseState.Received,
      CaseState.Accepted,
      CaseState.Rejected,
      CaseState.Dismissed,
    ]
  }

  if (institutionType === InstitutionType.Court && caseType) {
    if (role === UserRole.Assistant || isIndictmentCase(caseType)) {
      return [
        CaseState.Submitted,
        CaseState.Received,
        CaseState.Accepted,
        CaseState.Rejected,
        CaseState.Dismissed,
      ]
    }

    return [
      CaseState.Draft,
      CaseState.Submitted,
      CaseState.Received,
      CaseState.Accepted,
      CaseState.Rejected,
      CaseState.Dismissed,
    ]
  }

  if (institutionType === InstitutionType.HighCourt) {
    return [CaseState.Accepted, CaseState.Rejected, CaseState.Dismissed]
  }

  return [CaseState.Accepted]
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
  institutionType?: InstitutionType,
  caseType?: CaseType,
): boolean {
  return getBlockedStates(role, institutionType, caseType).includes(state)
}

function getAllowedTypes(
  role: UserRole,
  forUpdate: boolean,
  institutionType?: InstitutionType,
): CaseType[] {
  if (role === UserRole.Admin) {
    return [] // admins should only handle user management
  }

  if (role === UserRole.Representative || role === UserRole.Assistant) {
    return indictmentCases
  }

  if (
    [
      UserRole.Judge,
      UserRole.Registrar,
      UserRole.Prosecutor,
      UserRole.Defender,
    ].includes(role)
  ) {
    return [...indictmentCases, ...investigationCases, ...restrictionCases]
  }

  if (institutionType === InstitutionType.PrisonAdmin) {
    return [
      CaseType.Custody,
      CaseType.AdmissionToFacility,
      ...(forUpdate ? [] : [CaseType.TravelBan]),
    ]
  }

  return forUpdate ? [] : [CaseType.Custody, CaseType.AdmissionToFacility]
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
    institutionType === InstitutionType.Prison &&
    decision === CaseDecision.AcceptingAlternativeTravelBan
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
      user.institution?.type !== InstitutionType.HighCourt)
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
            CaseState.New,
            CaseState.Draft,
            CaseState.Submitted,
            CaseState.Received,
          ],
        },
        { created: { [Op.lt]: lifetime } },
      ],
    },
    {
      [Op.and]: [
        { type: restrictionCases },
        { state: [CaseState.Rejected, CaseState.Dismissed] },
        { ruling_date: { [Op.lt]: lifetime } },
      ],
    },
    {
      [Op.and]: [
        { type: restrictionCases },
        { state: CaseState.Accepted },
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
      user.institution?.type as InstitutionType, // TODO REMOVE InstitutionType cast
      theCase.type,
    ) ||
    isTypeHiddenFromRole(
      theCase.type,
      user.role,
      forUpdate,
      user.institution?.type as InstitutionType,
    ) ||
    isDecisionHiddenFromInstitution(
      theCase.decision,
      user.institution?.type as InstitutionType,
    ) ||
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
  return institutionType === InstitutionType.PrisonAdmin
    ? {
        [Op.and]: [
          { isArchived: false },
          { state: CaseState.Accepted },
          {
            type: [
              CaseType.AdmissionToFacility,
              CaseType.Custody,
              CaseType.TravelBan,
            ],
          },
        ],
      }
    : {
        [Op.and]: [
          { isArchived: false },
          { state: CaseState.Accepted },
          { type: [CaseType.Custody, CaseType.AdmissionToFacility] },
          {
            decision: [CaseDecision.Accepting, CaseDecision.AcceptingPartially],
          },
        ],
      }
}

export function getCasesQueryFilter(user: User): WhereOptions {
  if (user.role === UserRole.Staff) {
    return getStaffCasesQueryFilter(user.institution?.type as InstitutionType)
  }

  const blockStates = {
    [Op.not]: {
      state: getBlockedStates(
        user.role,
        user.institution?.type as InstitutionType,
      ),
    },
  }

  const blockInstitutions = isProsecutionRole(user.role)
    ? {
        [Op.or]: [
          { creating_prosecutor_id: { [Op.is]: null } },
          { '$creatingProsecutor.institution_id$': user.institution?.id },
          { shared_with_prosecutors_office_id: user.institution?.id },
        ],
      }
    : user.institution?.type === InstitutionType.HighCourt
    ? {
        [Op.or]: [
          { accused_appeal_decision: CaseAppealDecision.Appeal },
          { prosecutor_appeal_decision: CaseAppealDecision.Appeal },
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
            [Op.and]: [{ state: CaseState.Draft }, { type: indictmentCases }],
          },
        },
      ]
    : []

  const restrictCaseTypes =
    user.role === UserRole.Representative || user.role === UserRole.Assistant
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
