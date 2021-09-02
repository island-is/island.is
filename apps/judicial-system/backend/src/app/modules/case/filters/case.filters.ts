import { Op, WhereOptions } from 'sequelize'

import {
  CaseState,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

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

function isProsecutorsOfficeHiddenFromUser(
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

function isCourtHiddenFromUser(
  courtId: string | undefined,
  user: User,
  forUpdate: boolean,
): boolean {
  return (
    courtMustMatchUserIInstitution(user.role) &&
    Boolean(courtId) &&
    courtId !== user.institution?.id &&
    (forUpdate || user.institution?.type !== InstitutionType.HIGH_COURT)
  )
}

export function isCaseBlockedFromUser(
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean {
  return (
    isStateHiddenFromRole(theCase.state, user.role, user.institution?.type) ||
    isProsecutorsOfficeHiddenFromUser(
      theCase.prosecutor?.institutionId,
      user,
      forUpdate,
      theCase.sharedWithProsecutorsOfficeId,
    ) ||
    isCourtHiddenFromUser(theCase.courtId, user, forUpdate)
  )
}

export function getCasesQueryFilter(user: User): WhereOptions {
  const blockStates = {
    [Op.not]: {
      state: getBlockedStates(user.role, user.institution?.type),
    },
  }

  if (user.institution?.type === InstitutionType.HIGH_COURT) {
    return blockStates
  }

  const blockInstitutions =
    user.role === UserRole.PROSECUTOR
      ? {
          [Op.or]: [
            { prosecutor_id: { [Op.is]: null } },
            {
              '$prosecutor.institution_id$': user.institution?.id,
            },
            { shared_with_prosecutors_office_id: user.institution?.id },
          ],
        }
      : {
          [Op.or]: [
            { court_id: { [Op.is]: null } },
            {
              court_id: user.institution?.id,
            },
          ],
        }

  return { [Op.and]: [blockStates, blockInstitutions] }
}
