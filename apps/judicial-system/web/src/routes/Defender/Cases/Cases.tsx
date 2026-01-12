import { FC, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import partition from 'lodash/partition'

import { AlertMessage, Box, Tabs } from '@island.is/island-ui/core'
import { isCompletedCase } from '@island.is/judicial-system/types'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import {
  CasesLayout,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import SectionHeading from '../../../components/SectionHeading/SectionHeading'
import DefenderCasesTable from './components/DefenderCasesTable'
import FilterCheckboxes from './components/FilterCheckboxes'
import useFilterCases, { Filters } from './hooks/useFilterCases'
import { useDefenderCasesQuery } from './defenderCases.generated'
import { defenderCases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const Cases: FC = () => {
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

  const { data, error, loading } = useDefenderCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const cases = data?.cases

  const [activeCases, completedCases] = useMemo(() => {
    if (!cases) {
      return [[], []]
    }

    return partition(
      cases,
      (c) =>
        !(
          isCompletedCase(c.state) ||
          c.state === CaseState.WAITING_FOR_CANCELLATION
        ),
    )
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
    <CasesLayout>
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
        <SectionHeading
          heading="h1"
          variant="h1"
          title="Málin þín"
          description="Hér er yfirlit yfir mál sem þú átt aðild að í umboði skjólstæðinga."
          marginBottom={5}
        />
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
                    <DefenderCasesTable cases={activeFilteredCases} />
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
    </CasesLayout>
  )
}

export default Cases
