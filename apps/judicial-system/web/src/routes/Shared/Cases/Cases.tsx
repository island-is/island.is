import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import partition from 'lodash/partition'

import { AlertMessage, Box, Select } from '@island.is/island-ui/core'
import {
  DropdownMenu,
  Logo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
  isIndictmentCase,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { TempCaseListEntry as CaseListEntry } from '@island.is/judicial-system-web/src/types'
import {
  core,
  tables,
  titles,
  errors,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { capitalize } from '@island.is/judicial-system/formatters'

import {
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'
import * as constants from '@island.is/judicial-system/consts'
import PastCasesTable from '@island.is/judicial-system-web/src/components/Table/PastCasesTable/PastCasesTable'

import ActiveCases from './ActiveCases'
import { FilterOption, useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'
import TableSkeleton from '@island.is/judicial-system-web/src/components/Table/TableSkeleton/TableSkeleton'

const CreateCaseButton: React.FC<{
  user: User
}> = ({ user }) => {
  const { formatMessage } = useIntl()

  const items = useMemo(() => {
    if (user.role === UserRole.REPRESENTATIVE) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
      ]
    }

    if (user.role === UserRole.PROSECUTOR) {
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

  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isRepresentative = user?.role === UserRole.REPRESENTATIVE
  const isPrisonAdminUser =
    user?.institution?.type === InstitutionType.PRISON_ADMIN
  const isPrisonUser = user?.institution?.type === InstitutionType.PRISON

  const {
    transitionCase,
    isTransitioningCase,
    isSendingNotification,
    getCaseToOpen,
  } = useCase()

  const { data, error, loading, refetch } = useQuery<{
    cases?: CaseListEntry[]
  }>(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

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

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={styles.logoContainer}>
        <Logo />
        {isProsecutor || isRepresentative ? (
          <CreateCaseButton user={user} />
        ) : null}
      </div>
      {user?.role !== UserRole.STAFF && (
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
            title={formatMessage(errors.failedToFetchDataFromDbTitle)}
            message={formatMessage(errors.failedToFetchDataFromDbMessage)}
            type="error"
          />
        </div>
      ) : loading || isFiltering || !user ? (
        <TableSkeleton />
      ) : (
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
                <PastCasesTable
                  cases={activeCases}
                  onRowClick={handleRowClick}
                />
              ) : (
                <ActiveCases
                  cases={activeCases}
                  onRowClick={handleRowClick}
                  isDeletingCase={isTransitioningCase || isSendingNotification}
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
      )}
      <SectionHeading
        title={formatMessage(
          isPrisonUser
            ? m.pastRequests.prisonStaffUsers.title
            : isPrisonAdminUser
            ? m.pastRequests.prisonStaffUsers.prisonAdminTitle
            : tables.completedCasesTitle,
        )}
      />

      {pastCases.length > 0 ? (
        <PastCasesTable cases={pastCases} onRowClick={handleRowClick} />
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
    </SharedPageLayout>
  )
}

export default Cases
