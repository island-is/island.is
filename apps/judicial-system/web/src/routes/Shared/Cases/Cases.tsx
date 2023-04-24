import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery, useLazyQuery } from '@apollo/client'
import router from 'next/router'
import partition from 'lodash/partition'

import { AlertMessage, Box, Select } from '@island.is/island-ui/core'
import {
  CaseQuery,
  DropdownMenu,
  Logo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
  isRestrictionCase,
  isInvestigationCase,
  isIndictmentCase,
  isExtendedCourtRole,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseData,
  TempCase as Case,
  TempCaseListEntry as CaseListEntry,
} from '@island.is/judicial-system-web/src/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { capitalize } from '@island.is/judicial-system/formatters'
import { findFirstInvalidStep } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isTrafficViolationCase } from '@island.is/judicial-system-web/src/utils/stepHelper'
import * as constants from '@island.is/judicial-system/consts'

import ActiveCases from './ActiveCases'
import PastCases from './PastCases'
import TableSkeleton from './TableSkeleton'
import { FilterOption, useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

const CreateCaseButton: React.FC<{
  user: User
}> = ({ user }) => {
  const { formatMessage } = useIntl()

  const items = useMemo(() => {
    if (user.role === UserRole.Representative) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
      ]
    }

    if (user.role === UserRole.Prosecutor) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
        {
          href: constants.CREATE_RESTRICTION_CASE_ROUTE,
          title: capitalize(formatMessage(core.restrictionCase)),
        },
        {
          href: constants.CREATE_TRAVEL_BAN_ROUTE,
          title: capitalize(formatMessage(core.travelBan)),
        },
        {
          href: constants.CREATE_INVESTIGATION_CASE_ROUTE,
          title: capitalize(formatMessage(core.investigationCase)),
        },
      ]
    }

    return []
  }, [formatMessage, user?.role])

  return (
    <Box display={['none', 'none', 'block']}>
      <DropdownMenu
        dataTestId="createCaseDropdown"
        menuLabel="Tegund kröfu"
        icon="add"
        items={items}
        title={formatMessage(m.createCaseButton)}
      />
    </Box>
  )
}

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const Cases: React.FC = () => {
  const { formatMessage } = useIntl()

  const { user } = useContext(UserContext)

  const [isFiltering, setIsFiltering] = useState<boolean>(false)

  const isProsecutor = user?.role === UserRole.Prosecutor
  const isRepresentative = user?.role === UserRole.Representative
  const isHighCourtUser = user?.institution?.type === InstitutionType.HighCourt
  const isPrisonAdminUser =
    user?.institution?.type === InstitutionType.PrisonAdmin
  const isPrisonUser = user?.institution?.type === InstitutionType.Prison

  const { data, error, loading, refetch } = useQuery<{
    cases?: CaseListEntry[]
  }>(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [getCaseToOpen] = useLazyQuery<CaseData>(CaseQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (caseData) => {
      if (user?.role && caseData?.case) {
        openCase(caseData.case, user.role)
      }
    },
  })

  const {
    transitionCase,
    isTransitioningCase,
    isSendingNotification,
  } = useCase()

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsFiltering(false)
    }, 250)

    return () => {
      clearTimeout(loadingTimeout)
    }
  }, [isFiltering])

  const resCases = data?.cases

  const [allActiveCases, allPastCases]: [
    CaseListEntry[],
    CaseListEntry[],
  ] = useMemo(() => {
    if (!resCases) {
      return [[], []]
    }

    const casesWithoutDeleted = resCases.filter((c: CaseListEntry) => {
      return c.state !== CaseState.DELETED
    })

    return partition(casesWithoutDeleted, (c) => {
      if (isIndictmentCase(c.type)) {
        return !completedCaseStates.includes(c.state)
      } else if (isPrisonAdminUser || isPrisonUser) {
        return !c.isValidToDateInThePast
      } else {
        return !(completedCaseStates.includes(c.state) && c.rulingDate)
      }
    })
  }, [resCases, isPrisonAdminUser, isPrisonUser])

  const {
    filter,
    setFilter,
    options: filterOptions,
    activeCases,
    pastCases,
  } = useFilter(allActiveCases, allPastCases, user)

  const deleteCase = async (caseToDelete: CaseListEntry) => {
    if (
      caseToDelete.state === CaseState.NEW ||
      caseToDelete.state === CaseState.DRAFT ||
      caseToDelete.state === CaseState.SUBMITTED ||
      caseToDelete.state === CaseState.RECEIVED
    ) {
      await transitionCase(caseToDelete.id, CaseTransition.DELETE)
      refetch()
    }
  }

  const handleRowClick = (id: string) => {
    getCaseToOpen({
      variables: { input: { id } },
    })
  }

  const openCase = (caseToOpen: Case, role: UserRole) => {
    let routeTo = null
    const isTrafficViolation = isTrafficViolationCase(caseToOpen, user)

    if (
      caseToOpen.state === CaseState.ACCEPTED ||
      caseToOpen.state === CaseState.REJECTED ||
      caseToOpen.state === CaseState.DISMISSED
    ) {
      if (isIndictmentCase(caseToOpen.type)) {
        routeTo = constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE
      } else if (isHighCourtUser) {
        routeTo = constants.COURT_OF_APPEAL_OVERVIEW
      } else {
        routeTo = constants.SIGNED_VERDICT_OVERVIEW_ROUTE
      }
    } else if (isExtendedCourtRole(role)) {
      if (isRestrictionCase(caseToOpen.type)) {
        routeTo = findFirstInvalidStep(
          constants.courtRestrictionCasesRoutes,
          caseToOpen,
        )
      } else if (isInvestigationCase(caseToOpen.type)) {
        routeTo = findFirstInvalidStep(
          constants.courtInvestigationCasesRoutes,
          caseToOpen,
        )
      } else {
        // Route to Indictment Overview section since it always a valid step and
        // would be skipped if we route to the last valid step
        routeTo = constants.INDICTMENTS_COURT_OVERVIEW_ROUTE
      }
    } else {
      if (isRestrictionCase(caseToOpen.type)) {
        routeTo = findFirstInvalidStep(
          constants.prosecutorRestrictionCasesRoutes,
          caseToOpen,
        )
      } else if (isInvestigationCase(caseToOpen.type)) {
        routeTo = findFirstInvalidStep(
          constants.prosecutorInvestigationCasesRoutes,
          caseToOpen,
        )
      } else {
        routeTo = findFirstInvalidStep(
          constants.prosecutorIndictmentRoutes(isTrafficViolation),
          caseToOpen,
        )
      }
    }

    if (routeTo) router.push(`${routeTo}/${caseToOpen.id}`)
  }

  return (
    <Box paddingX={[2, 2, 4]}>
      <Box
        className={styles.casesContainer}
        marginX={'auto'}
        marginY={[4, 4, 12]}
      >
        <PageHeader title={formatMessage(titles.shared.cases)} />
        <div className={styles.logoContainer}>
          <Logo />
          {isProsecutor || isRepresentative ? (
            <CreateCaseButton user={user} />
          ) : null}
        </div>
        {user?.role !== UserRole.Staff && (
          <Box marginBottom={[2, 5, 5]} className={styles.filterContainer}>
            <Select
              name="filter-cases"
              options={filterOptions}
              label={formatMessage(m.filter.label)}
              onChange={(value) => {
                setIsFiltering(true)
                setFilter(value as FilterOption)
              }}
              value={filter}
            />
          </Box>
        )}
        {error ? (
          <div
            className={styles.infoContainer}
            data-testid="custody-requests-error"
          >
            <AlertMessage
              title="Ekki tókst að sækja gögn úr gagnagrunni"
              message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
              type="error"
            />
          </div>
        ) : loading || isFiltering || !user ? (
          <TableSkeleton />
        ) : (
          !isHighCourtUser && (
            <>
              <SectionHeading
                title={formatMessage(
                  isPrisonUser
                    ? m.activeRequests.prisonStaffUsers.title
                    : isPrisonAdminUser
                    ? m.activeRequests.prisonStaffUsers.prisonAdminTitle
                    : m.activeRequests.title,
                )}
              />
              <Box marginBottom={[5, 5, 12]}>
                {activeCases.length > 0 ? (
                  isPrisonUser || isPrisonAdminUser ? (
                    <PastCases
                      cases={activeCases}
                      onRowClick={handleRowClick}
                      isHighCourtUser={false}
                    />
                  ) : (
                    <ActiveCases
                      cases={activeCases}
                      onRowClick={handleRowClick}
                      isDeletingCase={
                        isTransitioningCase || isSendingNotification
                      }
                      onDeleteCase={deleteCase}
                    />
                  )
                ) : (
                  <div className={styles.infoContainer}>
                    <AlertMessage
                      type="info"
                      title={formatMessage(
                        isPrisonUser || isPrisonAdminUser
                          ? m.activeRequests.prisonStaffUsers.infoContainerTitle
                          : m.activeRequests.infoContainerTitle,
                      )}
                      message={formatMessage(
                        isPrisonUser || isPrisonAdminUser
                          ? m.activeRequests.prisonStaffUsers.infoContainerText
                          : m.activeRequests.infoContainerText,
                      )}
                    />
                  </div>
                )}
              </Box>
            </>
          )
        )}
        <SectionHeading
          title={formatMessage(
            isHighCourtUser
              ? m.pastRequests.highCourtUsers.title
              : isPrisonUser
              ? m.pastRequests.prisonStaffUsers.title
              : isPrisonAdminUser
              ? m.pastRequests.prisonStaffUsers.prisonAdminTitle
              : m.pastRequests.title,
          )}
        />
        {pastCases.length > 0 ? (
          <PastCases
            cases={pastCases}
            onRowClick={handleRowClick}
            isHighCourtUser={isHighCourtUser}
          />
        ) : (
          <div className={styles.infoContainer}>
            <AlertMessage
              type="info"
              title={formatMessage(
                isPrisonAdminUser || isPrisonUser
                  ? m.activeRequests.prisonStaffUsers.infoContainerTitle
                  : m.pastRequests.infoContainerTitle,
              )}
              message={formatMessage(
                isPrisonAdminUser || isPrisonUser
                  ? m.activeRequests.prisonStaffUsers.infoContainerText
                  : m.pastRequests.infoContainerText,
              )}
            />
          </div>
        )}
      </Box>
    </Box>
  )
}

export default Cases
