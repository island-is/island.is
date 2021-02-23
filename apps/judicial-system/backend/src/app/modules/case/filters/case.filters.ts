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

function prosecutorInstitutionMustMatchUserInstitution(role: UserRole) {
  return role === UserRole.PROSECUTOR
}

export function isStateHiddenFromRole(
  state: CaseState,
  role: UserRole,
): boolean {
  return getBlockedStates(role).includes(state)
}

export function isProsecutorInstitutionHiddenFromUser(
  prosecutorInstitutionId: string,
  user: User,
): boolean {
  return (
    prosecutorInstitutionMustMatchUserInstitution(user?.role) &&
    prosecutorInstitutionId &&
    prosecutorInstitutionId !== user?.institution?.id
  )
}

export function isCaseBlockedFromUser(theCase: Case, user: User): boolean {
  return (
    isStateHiddenFromRole(theCase?.state, user?.role) ||
    isProsecutorInstitutionHiddenFromUser(
      theCase?.prosecutor?.institutionId,
      user,
    )
  )
}

export function getCasesQueryFilter(user: User): WhereOptions {
  const blockStates = {
    [Op.not]: {
      state: getBlockedStates(user?.role),
    },
  }

  return prosecutorInstitutionMustMatchUserInstitution(user?.role)
    ? {
        [Op.and]: [
          blockStates,
          {
            [Op.or]: [
              { prosecutor_id: { [Op.is]: null } }, // eslint-disable-line @typescript-eslint/camelcase
              {
                '$prosecutor.institution_id$': user?.institution?.id,
              },
            ],
          },
        ],
      }
    : blockStates
}
