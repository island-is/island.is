import { literal, Op, WhereOptions } from 'sequelize'

import {
  CaseAppealDecision,
  CaseState,
  CaseType,
  hasCaseBeenAppealed,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User, Case as TCase } from '@island.is/judicial-system/types'

import { Case } from '../models'

function getBlockedStates(role: UserRole, institutionType?: InstitutionType) {
  const blockedStates = [CaseState.DELETED]

  if (role === UserRole.PROSECUTOR) {
    return blockedStates
  }

  blockedStates.push(CaseState.NEW)

  if (institutionType !== InstitutionType.HIGH_COURT) {
    return blockedStates
  }

  blockedStates.push(CaseState.DRAFT, CaseState.SUBMITTED, CaseState.RECEIVED)

  return blockedStates
}

function prosecutorsOfficeMustMatchUserInstitution(role: UserRole): boolean {
  return role === UserRole.PROSECUTOR
}

function courtMustMatchUserIInstitution(role: UserRole): boolean {
  return role === UserRole.REGISTRAR || role === UserRole.JUDGE
}

function isStateHiddenFromRole(
  state: CaseState,
  role: UserRole,
  institutionType?: InstitutionType,
): boolean {
  return getBlockedStates(role, institutionType).includes(state)
}

function isProsecutorsOfficeCaseHiddenFromUser(
  prosecutorInstitutionId: string | undefined,
  user: User,
  forUpdate: boolean,
  sharedWithProsecutorsOfficeId: string | undefined,
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
  courtId: string | undefined,
  user: User,
  forUpdate: boolean,
  hasCaseBeenAppealed: boolean,
): boolean {
  return (
    courtMustMatchUserIInstitution(user.role) &&
    Boolean(courtId) &&
    courtId !== user.institution?.id &&
    (forUpdate ||
      !hasCaseBeenAppealed ||
      user.institution?.type !== InstitutionType.HIGH_COURT)
  )
}

export function isCaseBlockedFromUser(
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean {
  return (
    isStateHiddenFromRole(theCase.state, user.role, user.institution?.type) ||
    isProsecutorsOfficeCaseHiddenFromUser(
      theCase.prosecutor?.institutionId,
      user,
      forUpdate,
      theCase.sharedWithProsecutorsOfficeId,
    ) ||
    isCourtCaseHiddenFromUser(
      theCase.courtId,
      user,
      forUpdate,
      hasCaseBeenAppealed((theCase as unknown) as TCase),
    )
  )
}

export function getCasesQueryFilter(user: User): WhereOptions {
  const blockStates = {
    [Op.not]: { state: getBlockedStates(user.role, user.institution?.type) },
  }

  const blockOld = [
    {
      [Op.not]: {
        [Op.and]: [
          { state: [CaseState.REJECTED, CaseState.DISMISSED] },
          { ruling_date: { [Op.lt]: literal('current_date - 90') } },
        ],
      },
    },
    {
      [Op.not]: {
        [Op.and]: [
          {
            state: [
              CaseState.NEW,
              CaseState.DRAFT,
              CaseState.SUBMITTED,
              CaseState.RECEIVED,
            ],
          },
          { created: { [Op.lt]: literal('current_date - 90') } },
        ],
      },
    },
    {
      [Op.not]: {
        [Op.and]: [
          { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] },
          { state: CaseState.ACCEPTED },
          { valid_to_date: { [Op.lt]: literal('current_date - 90') } },
        ],
      },
    },
    {
      [Op.not]: {
        [Op.and]: [
          { [Op.not]: { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] } },
          { state: CaseState.ACCEPTED },
          { ruling_date: { [Op.lt]: literal('current_date - 90') } },
        ],
      },
    },
  ]

  const blockInstitutions =
    user.role === UserRole.PROSECUTOR
      ? {
          [Op.or]: [
            { prosecutor_id: { [Op.is]: null } },
            { '$prosecutor.institution_id$': user.institution?.id },
            { shared_with_prosecutors_office_id: user.institution?.id },
          ],
        }
      : user.institution?.type === InstitutionType.HIGH_COURT
      ? {
          [Op.or]: {
            accused_appeal_decision: CaseAppealDecision.APPEAL,
            prosecutor_appeal_decision: CaseAppealDecision.APPEAL,
            accused_postponed_appeal_date: { [Op.not]: null },
            prosecutor_postponed_appeal_date: { [Op.not]: null },
          },
        }
      : {
          [Op.or]: [
            { court_id: { [Op.is]: null } },
            { court_id: user.institution?.id },
          ],
        }

  return { [Op.and]: [blockStates, ...blockOld, blockInstitutions] }
}
