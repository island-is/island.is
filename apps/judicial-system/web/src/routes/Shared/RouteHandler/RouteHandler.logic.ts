import {
  DEFENDER_INDICTMENT_CASE_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_COMPLETED_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE,
  PRISON_INDICTMENT_CASE_OVERVIEW_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE,
  PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE,
  PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonSystemUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import {
  Case,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

type UserType =
  | 'prosecution'
  | 'publicProsecutor'
  | 'districtCourt'
  | 'prisonSystem'
  | 'defence'
type CaseStatus = 'completed' | 'ongoing'

const routes: Partial<
  Record<CaseType, Record<UserType, Record<CaseStatus, string | null>>>
> = {
  [CaseType.INDICTMENT]: {
    prosecution: {
      completed: PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE,
      ongoing: PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE,
    },
    publicProsecutor: {
      completed: PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE,
      ongoing: null,
    },
    districtCourt: {
      completed: DISTRICT_COURT_INDICTMENT_CASE_COMPLETED_ROUTE,
      ongoing: DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE,
    },
    prisonSystem: {
      completed: PRISON_INDICTMENT_CASE_OVERVIEW_ROUTE,
      ongoing: null,
    },
    defence: {
      completed: DEFENDER_INDICTMENT_CASE_ROUTE,
      ongoing: DEFENDER_INDICTMENT_CASE_ROUTE,
    },
  },
}

const getCaseStatus = (
  state: CaseState | undefined | null,
  userType?: UserType | null,
): CaseStatus =>
  isCompletedCase(state)
    ? userType === 'districtCourt' && state === CaseState.CORRECTING
      ? 'ongoing'
      : 'completed'
    : 'ongoing'

export const getRoute = (caseToOpen: Case, user: User): string => {
  if (!caseToOpen || !user) {
    return '/'
  }

  const userType: UserType | null = isProsecutionUser(user)
    ? 'prosecution'
    : isPublicProsecutionOfficeUser(user)
    ? 'publicProsecutor'
    : isDistrictCourtUser(user)
    ? 'districtCourt'
    : isPrisonSystemUser(user)
    ? 'prisonSystem'
    : isDefenceUser(user)
    ? 'defence'
    : null
  const caseStatus = getCaseStatus(caseToOpen.state, userType)

  const route =
    caseToOpen.type &&
    userType &&
    routes[caseToOpen.type]?.[userType]?.[caseStatus]

  return route ? `${route}/${caseToOpen.id}` : '/'
}
