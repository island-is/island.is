import {
  CASE_TABLE_GROUPS_ROUTE,
  CASES_ROUTE,
  COURT_OF_APPEAL_CASES_ROUTE,
  DEFENDER_CASES_ROUTE,
  PRISON_CASES_ROUTE,
  USERS_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  hasCaseGroupListsEnabled,
  isAdminUser,
  isCourtOfAppealsUser,
  isDefenceUser,
  isPrisonStaffUser,
} from '@island.is/judicial-system/types'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'

export const getUserDashboardRoute = (user: User) =>
  hasCaseGroupListsEnabled(user)
    ? CASE_TABLE_GROUPS_ROUTE
    : isDefenceUser(user)
    ? DEFENDER_CASES_ROUTE
    : isPrisonStaffUser(user)
    ? PRISON_CASES_ROUTE
    : isCourtOfAppealsUser(user)
    ? COURT_OF_APPEAL_CASES_ROUTE
    : isAdminUser(user)
    ? USERS_ROUTE
    : CASES_ROUTE
