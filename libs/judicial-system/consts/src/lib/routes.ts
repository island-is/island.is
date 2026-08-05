import { InstitutionUser, isAdminUser } from '@island.is/judicial-system/types'

import { ADMIN_USERS_ROUTE, CASE_TABLE_GROUPS_ROUTE } from './consts'

export const getStandardUserDashboardRoute = (user?: InstitutionUser) => {
  if (!user) {
    return '/'
  }

  return CASE_TABLE_GROUPS_ROUTE
}

export const getUserDashboardRoute = (user?: InstitutionUser) => {
  if (isAdminUser(user)) {
    return ADMIN_USERS_ROUTE
  }

  return getStandardUserDashboardRoute(user)
}
