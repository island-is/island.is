import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import {
  Box,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
  ToggleSwitchCheckbox,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  InfoCard,
  LabelValue,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseStatistics,
  ServiceStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import CountAndDays from './components/CountAndDays'
import { FiltersPanel } from './components/FiltersPanel'
import { StatisticsCSVButton } from './components/StatisticsCSVButton'
import { useCaseStatisticsQuery } from './getCaseStatistics.generated'
import { mapServiceStatusTitle } from './helpers'
import { strings } from './Statistics.strings'
import * as styles from './Statistics.css'

const Statistics = () => {
  const [filter, setFilter] = useState(false)
  const [stats, setStats] = useState<CaseStatistics | undefined>()
  const [filters, setFilters] = useState<{
    fromDate?: Date
    toDate?: Date
    institution?: { label: string; value: string }
  }>({})

  const { formatMessage } = useIntl()
  const { districtCourts } = useInstitution()

  const queryVariables = useMemo(() => {
    return filter
      ? {
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          institutionId: filters.institution?.value,
        }
      : {}
  }, [filter, filters])

  const { data, loading } = useCaseStatisticsQuery({
    variables: {
      input: queryVariables,
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data?.caseStatistics) {
      setStats(data.caseStatistics)
    }
  }, [data])

  return (
    <Box className={styles.statisticsPageContainer}>
      <PageHeader title="Tölfræði" />
      <Box className={styles.statisticsContentBox}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={[2, 2, 4, 6, 6]}
        >
          <Text as="h1" variant="h1">
            Tölfræði
          </Text>
          <ToggleSwitchCheckbox
            name="toggleFilter"
            label={<Text>Sía</Text>}
            checked={filter}
            onChange={setFilter}
          />
        </Box>

        <GridRow
          rowGap={3}
          direction={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
        >
          <GridColumn
            span={['12/12', '12/12', '12/12', filter ? '8/12' : '12/12']}
          >
            {loading && !stats ? (
              <SkeletonLoader height={800} />
            ) : (
              <AnimatePresence mode="wait">
                <>
                  {' '}
                  <InfoCard
                    sections={[
                      {
                        id: 'all-cases',
                        items: [
                          {
                            id: 'case-item',
                            title: (
                              <Text variant="h3" marginBottom={2}>
                                {'Öll mál '}
                                <Tooltip
                                  placement="right"
                                  text={formatMessage(
                                    strings.allCasesStatisticsTooltip,
                                  )}
                                />
                              </Text>
                            ),
                            values: [
                              <LabelValue
                                label="Heildarfjöldi"
                                value={stats?.count}
                              />,
                            ],
                          },
                        ],
                      },
                      {
                        id: 'request-cases',
                        items: [
                          {
                            id: 'request-case-item',
                            title: (
                              <Text variant="h3" marginBottom={2}>
                                {'R mál '}
                                <Tooltip
                                  placement="right"
                                  text={formatMessage(
                                    strings.requestCaseStatisticsTooltip,
                                  )}
                                />
                              </Text>
                            ),
                            values: [
                              <Box
                                key="request-cases-statistics-values"
                                display="flex"
                                flexDirection="column"
                                rowGap={1}
                              >
                                <LabelValue
                                  label="Heildarfjöldi"
                                  value={stats?.requestCases.count}
                                />

                                <LabelValue
                                  label="Í vinnslu"
                                  value={stats?.requestCases.inProgressCount}
                                />

                                <LabelValue
                                  label="Lokið"
                                  value={stats?.requestCases.completedCount}
                                />
                              </Box>,
                            ],
                          },
                        ],
                      },
                      {
                        id: 'indictment-cases',
                        items: [
                          {
                            id: 'indictment-case-item',
                            title: (
                              <Text variant="h3" marginBottom={2}>
                                {'S mál '}
                                <Tooltip
                                  placement="right"
                                  text={formatMessage(
                                    strings.indictmentStatisticsTooltip,
                                  )}
                                />
                              </Text>
                            ),
                            values: [
                              <Box
                                key="indictment-statistics-values"
                                display="flex"
                                flexDirection="column"
                                rowGap={1}
                              >
                                <LabelValue
                                  label="Heildarfjöldi"
                                  value={stats?.indictmentCases.count}
                                />
                                <LabelValue
                                  label="Í vinnslu"
                                  value={stats?.indictmentCases.inProgressCount}
                                />
                                <CountAndDays
                                  label="Lokið með dómi"
                                  count={stats?.indictmentCases.rulingCount}
                                  days={
                                    stats?.indictmentCases.averageRulingTimeDays
                                  }
                                />
                              </Box>,
                            ],
                          },
                        ],
                      },
                      {
                        id: 'subpoenas',
                        items: [
                          {
                            id: 'case-stat-item',
                            title: (
                              <Text variant="h3" marginBottom={2}>
                                {'Fyrirköll '}
                                <Tooltip
                                  placement="right"
                                  text={formatMessage(
                                    strings.subpoenaStatisticsTooltip,
                                  )}
                                />
                              </Text>
                            ),
                            values: [
                              <Box
                                key="subpoena-statistics-values"
                                display="flex"
                                flexDirection="column"
                                rowGap={1}
                              >
                                <LabelValue
                                  label="Heildarfjöldi"
                                  value={stats?.subpoenas.count}
                                />
                                {[null, ...Object.values(ServiceStatus)].map(
                                  (status) => {
                                    const stat =
                                      stats?.subpoenas.serviceStatusStatistics.find(
                                        (s) => s.serviceStatus === status,
                                      )
                                    return (
                                      <CountAndDays
                                        key={status ?? 'unserviced'}
                                        label={mapServiceStatusTitle(status)}
                                        count={stat?.count}
                                        days={
                                          status
                                            ? stat?.averageServiceTimeDays
                                            : undefined
                                        }
                                      />
                                    )
                                  },
                                )}
                              </Box>,
                            ],
                          },
                        ],
                      },
                    ]}
                  />
                  <Box display="flex" justifyContent="flexEnd" marginTop={2}>
                    <StatisticsCSVButton
                      stats={stats}
                      fromDate={filter ? filters.fromDate : undefined}
                      toDate={filter ? filters.toDate : undefined}
                      institutionName={
                        filter ? filters.institution?.label : undefined
                      }
                    />
                  </Box>
                </>
              </AnimatePresence>
            )}
          </GridColumn>

          {filter && (
            <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
              <Box display="flex" flexDirection="column" rowGap={3}>
                <FiltersPanel
                  districtCourts={districtCourts}
                  institution={filters.institution}
                  fromDate={filters.fromDate}
                  toDate={filters.toDate}
                  setInstitution={(institution) =>
                    setFilters((prev) => ({ ...prev, institution }))
                  }
                  setFromDate={(fromDate) =>
                    setFilters((prev) => ({ ...prev, fromDate }))
                  }
                  setToDate={(toDate) =>
                    setFilters((prev) => ({ ...prev, toDate }))
                  }
                  onClear={() => setFilters({})}
                />
              </Box>
            </GridColumn>
          )}
        </GridRow>
      </Box>
    </Box>
  )
}

export default Statistics
