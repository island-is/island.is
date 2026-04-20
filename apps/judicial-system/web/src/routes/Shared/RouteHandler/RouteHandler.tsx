import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, LoadingDots } from '@island.is/island-ui/core'
import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  INDICTMENTS_COMPLETED_ROUTE,
  INDICTMENTS_COURT_OVERVIEW_ROUTE,
  INDICTMENTS_OVERVIEW_ROUTE,
  PRISON_CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isDistrictCourtUser,
  isPrisonSystemUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

import * as styles from './RouteHandler.css'

type UserType =
  | 'prosecution'
  | 'publicProsecutor'
  | 'districtCourt'
  | 'prisonSystem'
type CaseStatus = 'completed' | 'ongoing'

const routes: Partial<
  Record<CaseType, Record<UserType, Record<CaseStatus, string | null>>>
> = {
  [CaseType.INDICTMENT]: {
    prosecution: {
      completed: CLOSED_INDICTMENT_OVERVIEW_ROUTE,
      ongoing: INDICTMENTS_OVERVIEW_ROUTE,
    },
    publicProsecutor: {
      completed: PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE,
      ongoing: null,
    },
    districtCourt: {
      completed: INDICTMENTS_COMPLETED_ROUTE,
      ongoing: INDICTMENTS_COURT_OVERVIEW_ROUTE,
    },
    prisonSystem: {
      completed: PRISON_CLOSED_INDICTMENT_OVERVIEW_ROUTE,
      ongoing: null,
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

const getRoute = (caseToOpen: Case, user: User): string => {
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
    : null
  const caseStatus = getCaseStatus(caseToOpen.state, userType)

  const route =
    caseToOpen.type &&
    userType &&
    routes[caseToOpen.type]?.[userType]?.[caseStatus]

  return route ? `${route}/${caseToOpen.id}` : '/'
}

const RouteHandler: React.FC = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { getCase } = useContext(FormContext)
  const [caseToOpen, setCaseToOpen] = useState<Case>()

  const handleGetCase = useCallback(
    (caseId?: string) => {
      if (!caseId) {
        router.push('/')
        return
      }

      if (!caseToOpen) {
        getCase(
          caseId,
          (caseData) => setCaseToOpen(caseData),
          () => router.push('/'),
        )
      }
    },
    [caseToOpen, getCase, router],
  )

  useEffect(() => {
    handleGetCase(router.query.id?.toString())
  }, [handleGetCase, router.query.id])

  useEffect(() => {
    if (!caseToOpen || !user) {
      return
    }

    router.push(getRoute(caseToOpen, user))
  }, [caseToOpen, router, user])

  return (
    <Box className={styles.loadingContainer}>
      <LoadingDots />
    </Box>
  )
}

export default RouteHandler
