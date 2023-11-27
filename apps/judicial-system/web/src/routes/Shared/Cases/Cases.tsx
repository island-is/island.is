import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import partition from 'lodash/partition'
import { useQuery } from '@apollo/client'

import { AlertMessage, Box, Select } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  CaseState,
  CaseTransition,
  completedCaseStates,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  core,
  errors,
  tables,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  DropdownMenu,
  Logo,
  PageHeader,
  PastCasesTable,
  SectionHeading,
  SharedPageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { TableSkeleton } from '@island.is/judicial-system-web/src/components/Table'
import {
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCaseListEntry as CaseListEntry } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'

import ActiveCases from './ActiveCases'
import { FilterOption, useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

const CreateCaseButton: React.FC<
  React.PropsWithChildren<{
    user: User
  }>
> = ({ user }) => {
  const { formatMessage } = useIntl()

  const items = useMemo(() => {
    if (user.role === UserRole.PROSECUTOR_REPRESENTATIVE) {
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
export const Cases: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const [isFiltering, setIsFiltering] = useState<boolean>(false)

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

  const [allActiveCases, allPastCases]: [CaseListEntry[], CaseListEntry[]] =
    useMemo(() => {
      if (!resCases) {
        return [[], []]
      }

      const casesWithoutDeleted = resCases.filter((c: CaseListEntry) => {
        return c.state !== CaseState.DELETED
      })

      return partition(casesWithoutDeleted, (c) => {
        if (isIndictmentCase(c.type) || !isDistrictCourtUser(user)) {
          return !completedCaseStates.includes(c.state)
        } else {
          return !(
            completedCaseStates.includes(c.state) && c.rulingSignatureDate
          )
        }
      })
    }, [resCases, user])

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
    getCaseToOpen(id)
  }

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={styles.logoContainer}>
        <Logo />
        {user && isProsecutionUser(user) ? (
          <CreateCaseButton user={user} />
        ) : null}
      </div>

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
      ) : (
        <>
          <SectionHeading title={formatMessage(m.activeRequests.title)} />
          <Box marginBottom={[5, 5, 12]}>
            {loading || isFiltering ? (
              <TableSkeleton />
            ) : activeCases.length > 0 ? (
              <ActiveCases
                cases={activeCases}
                onRowClick={handleRowClick}
                isDeletingCase={isTransitioningCase || isSendingNotification}
                onDeleteCase={deleteCase}
              />
            ) : (
              <div className={styles.infoContainer}>
                <AlertMessage
                  type="info"
                  title={formatMessage(m.activeRequests.infoContainerTitle)}
                  message={formatMessage(m.activeRequests.infoContainerText)}
                />
              </div>
            )}
          </Box>
        </>
      )}

      <SectionHeading title={formatMessage(tables.completedCasesTitle)} />
      {loading || pastCases.length > 0 ? (
        <PastCasesTable
          cases={pastCases}
          onRowClick={handleRowClick}
          loading={loading || isFiltering}
          testid="pastCasesTable"
        />
      ) : (
        <div className={styles.infoContainer}>
          <AlertMessage
            type="info"
            title={formatMessage(m.pastRequests.infoContainerTitle)}
            message={formatMessage(m.pastRequests.infoContainerText)}
          />
        </div>
      )}
    </SharedPageLayout>
  )
}

export default Cases
