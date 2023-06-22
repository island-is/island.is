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
import PastCasesTable from '@island.is/judicial-system-web/src/components/Table/PastCasesTable/PastCasesTable'

import { FilterOption, useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'
import TableSkeleton from '@island.is/judicial-system-web/src/components/Table/TableSkeleton/TableSkeleton'

export const PrisonCases: React.FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const [isFiltering, setIsFiltering] = useState<boolean>(false)

  const isPrisonAdminUser =
    user?.institution?.type === InstitutionType.PRISON_ADMIN
  const isPrisonUser = user?.institution?.type === InstitutionType.PRISON

  const { getCaseToOpen } = useCase()

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
              <PastCasesTable cases={activeCases} onRowClick={handleRowClick} />
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

      {loading || pastCases.length > 0 ? (
        <PastCasesTable
          cases={pastCases}
          onRowClick={handleRowClick}
          loading={loading}
          testid="pastCasesTable"
        />
      ) : (
        <div className={styles.infoContainer}>
          <AlertMessage
            type="info"
            title={formatMessage(
              m.activeRequests.prisonStaffUsers.infoContainerTitle,
            )}
            message={formatMessage(
              m.activeRequests.prisonStaffUsers.infoContainerText,
            )}
          />
        </div>
      )}
    </SharedPageLayout>
  )
}

export default PrisonCases
