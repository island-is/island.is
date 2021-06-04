import { Op, WhereOptions } from 'sequelize'

import { CaseState, User, UserRole } from '@island.is/judicial-system/types'

import { Case } from '../models'

function getBlockedStates(role: UserRole) {
  const blockedStates = [CaseState.DELETED]

  if (role !== UserRole.PROSECUTOR) {
    blockedStates.push(CaseState.NEW)
  }

  return blockedStates
}

function prosecutorsOfficeMustMatchUserInstitution(role: UserRole): boolean {
  return role === UserRole.PROSECUTOR
}

function courtMustMatchUserIInstitution(role: UserRole): boolean {
  return role === UserRole.REGISTRAR || role === UserRole.JUDGE
}

function isStateHiddenFromRole(state: CaseState, role: UserRole): boolean {
  return getBlockedStates(role).includes(state)
}

function isProsecutorsOfficeHiddenFromUser(
  prosecutorInstitutionId: string,
  user: User,
  forUpdate: boolean,
  sharedWithProsecutorsOfficeId: string,
): boolean {
  return (
    prosecutorsOfficeMustMatchUserInstitution(user.role) &&
    prosecutorInstitutionId &&
    prosecutorInstitutionId !== user.institution.id &&
    (forUpdate ||
      !sharedWithProsecutorsOfficeId ||
      sharedWithProsecutorsOfficeId !== user.institution.id)
  )
}

function isCourtHiddenFromUser(courtId: string, user: User): boolean {
  return (
    courtMustMatchUserIInstitution(user.role) &&
    courtId &&
    courtId !== user.institution.id
  )
}

export function isCaseBlockedFromUser(
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean {
  return (
    isStateHiddenFromRole(theCase.state, user.role) ||
    isProsecutorsOfficeHiddenFromUser(
      theCase.prosecutor?.institutionId,
      user,
      forUpdate,
      theCase.sharedWithProsecutorsOfficeId,
    ) ||
    isCourtHiddenFromUser(theCase.courtId, user)
  )
}

export function getCasesQueryFilter(user: User): WhereOptions {
  const blockStates = {
    [Op.not]: {
      state: getBlockedStates(user.role),
    },
  }

  const blockInstitutions =
    user.role === UserRole.PROSECUTOR
      ? {
          [Op.or]: [
            { prosecutor_id: { [Op.is]: null } },
            {
              '$prosecutor.institution_id$': user.institution.id,
            },
            { shared_with_prosecutors_office_id: user.institution.id },
          ],
        }
      : {
          [Op.or]: [
            { court_id: { [Op.is]: null } },
            {
              court_id: user.institution.id,
            },
          ],
        }

  return { [Op.and]: [blockStates, blockInstitutions] }
}
