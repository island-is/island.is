import { literal, Op, WhereOptions } from 'sequelize'

import {
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
  isProsecutionUser,
  isCourtRole,
  CaseAppealState,
  isDistrictCourtUser,
} from '@island.is/judicial-system/types'
import type { User, Case as TCase } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

const hideArchived = { isArchived: false }

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

function getProsecutionUserCasesQueryFilter(user: User): WhereOptions {
  const options: WhereOptions = [
    { isArchived: false },
    {
      state: [
        CaseState.NEW,
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ],
    },
    {
      [Op.or]: [
        { creating_prosecutor_id: { [Op.is]: null } },
        { '$creatingProsecutor.institution_id$': 'Prosecutors Office Id' },
        { shared_with_prosecutors_office_id: 'Prosecutors Office Id' },
      ],
    },
    {
      [Op.or]: [
        { is_heightened_security_level: { [Op.is]: null } },
        { is_heightened_security_level: false },
        { creating_prosecutor_id: 'Prosecutor Id' },
        { prosecutor_id: 'Prosecutor Id' },
      ],
    },
  ]

  if (user.role === UserRole.REPRESENTATIVE) {
    options.push({ type: indictmentCases })
  }

  return {
    [Op.and]: options,
  }
}

function getDistricteCourtUserCasesQueryFilter(user: User): WhereOptions {
  const options: WhereOptions = [
    { isArchived: false },
    {
      [Op.or]: [
        { court_id: { [Op.is]: null } },
        { court_id: user.institution?.id },
      ],
    },
  ]

  const blockStates = {
    [Op.not]: { state: getBlockedStates(user, user.institution?.type) },
  }

  const blockDraftIndictmentsForCourt =
    isCourtRole(user.role) && user.institution?.type === InstitutionType.COURT
      ? [
          {
            [Op.not]: {
              [Op.and]: [{ state: CaseState.DRAFT }, { type: indictmentCases }],
            },
          },
        ]
      : []

  const restrictCaseTypes =
    user.role === UserRole.ASSISTANT ? [{ type: indictmentCases }] : []

  options.push(
    blockStates,
    ...blockDraftIndictmentsForCourt,
    ...restrictCaseTypes,
  )

  return {
    [Op.and]: options,
  }
}

function getStaffRoleCasesQueryFilter(user: User): WhereOptions {
  const options: WhereOptions = [
    { isArchived: false },
    { state: CaseState.ACCEPTED },
  ]

  if (user.institution?.type === InstitutionType.PRISON_ADMIN) {
    options.push({
      type: [
        CaseType.ADMISSION_TO_FACILITY,
        CaseType.CUSTODY,
        CaseType.TRAVEL_BAN,
      ],
    })
  } else {
    options.push(
      { type: [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY] },
      {
        decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY],
      },
    )
  }

  return { [Op.and]: options }
}

export function getCasesQueryFilter(user: User): WhereOptions {
  // TODO: Convert to switch
  if (isProsecutionUser(user)) {
    return getProsecutionUserCasesQueryFilter(user)
  } else if (isDistrictCourtUser(user)) {
    return getDistricteCourtUserCasesQueryFilter(user)
  } else if (user.role === UserRole.STAFF) {
    return getStaffRoleCasesQueryFilter(user)
  }

  const blockStates = {
    [Op.not]: { state: getBlockedStates(user, user.institution?.type) },
  }

  const blockInstitutions =
    user.institution?.type === InstitutionType.HIGH_COURT
      ? {
          appeal_state: [
            CaseAppealState.APPEALED,
            CaseAppealState.RECEIVED,
            CaseAppealState.COMPLETED,
          ],
        }
      : {
          [Op.or]: [
            { court_id: { [Op.is]: null } },
            { court_id: user.institution?.id },
          ],
        }

  const blockDraftIndictmentsForCourt =
    isCourtRole(user.role) && user.institution?.type === InstitutionType.COURT
      ? [
          {
            [Op.not]: {
              [Op.and]: [{ state: CaseState.DRAFT }, { type: indictmentCases }],
            },
          },
        ]
      : []

  const restrictCaseTypes =
    user.role === UserRole.ASSISTANT
      ? [{ type: indictmentCases }]
      : user.institution?.type === InstitutionType.HIGH_COURT
      ? [{ type: [...restrictionCases, ...investigationCases] }]
      : []

  return {
    [Op.and]: [
      hideArchived,
      blockStates,
      blockInstitutions,
      ...blockDraftIndictmentsForCourt,
      ...restrictCaseTypes,
    ],
  }
}
