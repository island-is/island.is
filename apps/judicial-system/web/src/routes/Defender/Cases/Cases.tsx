import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import partition from 'lodash/partition'
import { useQuery } from '@apollo/client'

import { AlertMessage, Box, Tabs, Text } from '@island.is/island-ui/core'
import {
  CaseListEntry,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import { PageHeader } from '@island.is/judicial-system-web/src/components'
import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'

import DefenderCasesTable from './components/DefenderCasesTable'
import FilterCheckboxes from './components/FilterCheckboxes'
import useFilterCases, { Filters } from './hooks/useFilterCases'
import { defenderCases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const Cases: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { formatMessage } = useIntl()

  const availableTabs = ['active', 'completed']

  const [activeTab, setActiveTab] = useState<string>(() => {
    const selectedTab = localStorage.getItem('CASE_ACTIVE_TAB')
    return selectedTab && availableTabs.includes(selectedTab)
      ? selectedTab
      : availableTabs[0]
  })
  useEffect(() => {
    window.localStorage.setItem('CASE_ACTIVE_TAB', activeTab)
  }, [activeTab])

  const { data, error, loading } = useQuery<{
    cases?: CaseListEntry[]
  }>(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const cases = data?.cases

  const [activeCases, completedCases]: [CaseListEntry[], CaseListEntry[]] =
    useMemo(() => {
      if (!cases) {
        return [[], []]
      }

      return partition(cases, (c) => !completedCaseStates.includes(c.state))
    }, [cases])

  const {
    filteredCases: activeFilteredCases,
    filters,
    toggleFilter: toggleActiveFilter,
  } = useFilterCases(activeCases)
  const {
    filteredCases: completedFilteredCases,
    toggleFilter: toggleCompletedFilter,
  } = useFilterCases(completedCases)

  // We want to toggle both tables so that when we switch tabs, the filters are the same
  const toggleFilters = (filter: keyof Filters) => {
    toggleActiveFilter(filter)
    toggleCompletedFilter(filter)
  }

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.defender.cases)} />
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
        <Box marginBottom={5}>
          <Text as="h1" variant="h1" marginBottom={1}>
            {formatMessage(m.casesTitle)}
          </Text>
          <Text as="h4"> {formatMessage(m.casesSubtitle)}</Text>
        </Box>
      )}

      <Tabs
        size="md"
        contentBackground="white"
        selected={activeTab}
        label=""
        onChange={(tabId) => {
          setActiveTab(tabId)
        }}
        tabs={[
          {
            id: 'active',
            label: formatMessage(m.activeCasesTabLabel),
            content: (
              <div>
                {activeCases.length > 0 || loading ? (
                  <Box>
                    <FilterCheckboxes
                      filters={filters}
                      toggleFilter={toggleFilters}
                    />
                    <DefenderCasesTable
                      cases={activeFilteredCases}
                      loading={loading}
                    />
                  </Box>
                ) : (
                  <Box className={styles.infoContainer} marginTop={3}>
                    <AlertMessage
                      type="info"
                      message={formatMessage(m.noActiveCases)}
                    />
                  </Box>
                )}
              </div>
            ),
          },
          {
            id: 'completed',
            label: formatMessage(m.completedCasesTabLabel),
            content: (
              <div>
                {completedCases.length > 0 || loading ? (
                  <Box>
                    <FilterCheckboxes
                      filters={filters}
                      toggleFilter={toggleFilters}
                    />
                    <DefenderCasesTable
                      cases={completedFilteredCases}
                      showingCompletedCases={true}
                      loading={loading}
                    />
                  </Box>
                ) : (
                  <Box className={styles.infoContainer} marginTop={3}>
                    <AlertMessage
                      type="info"
                      message={formatMessage(m.noCompletedCases)}
                    />
                  </Box>
                )}
              </div>
            ),
          },
        ]}
      />
    </SharedPageLayout>
  )
}

export default Cases
