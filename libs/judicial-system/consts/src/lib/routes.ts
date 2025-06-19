import {
  hasCaseGroupListsEnabled,
  InstitutionUser,
  isAdminUser,
  isCourtOfAppealsUser,
  isDefenceUser,
  isPrisonSystemUser,
} from '@island.is/judicial-system/types'

import {
  CASE_TABLE_GROUPS_ROUTE,
  CASES_ROUTE,
  COURT_OF_APPEAL_CASES_ROUTE,
  DEFENDER_CASES_ROUTE,
  PRISON_CASES_ROUTE,
  USERS_ROUTE,
} from './consts'

export const getCourtDashboardRoute = (user?: InstitutionUser) => {
  return hasCaseGroupListsEnabled(user) ? CASE_TABLE_GROUPS_ROUTE : CASES_ROUTE
}

export const getStandardUserDashboardRoute = (user?: InstitutionUser) => {
  if (!user) {
    return '/'
  }

  return hasCaseGroupListsEnabled(user)
    ? CASE_TABLE_GROUPS_ROUTE
    : isDefenceUser(user)
    ? DEFENDER_CASES_ROUTE
    : isPrisonSystemUser(user)
    ? PRISON_CASES_ROUTE
    : isCourtOfAppealsUser(user)
    ? COURT_OF_APPEAL_CASES_ROUTE
    : CASES_ROUTE
}

export const getUserDashboardRoute = (user?: InstitutionUser) => {
  if (isAdminUser(user)) {
    return USERS_ROUTE
  }

  return getStandardUserDashboardRoute(user)
}
