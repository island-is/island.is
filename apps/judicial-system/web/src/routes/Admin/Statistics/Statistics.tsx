import { useEffect, useState } from 'react'
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

import CountAndDays from './CountAndDays'
import { FiltersPanel } from './FiltersPanel'
import { useCaseStatisticsQuery } from './getCaseStatistics.generated'
import { mapServiceStatusTitle } from './helpers'
import { StatisticsCSVButton } from './StatisticsCSVButton'
import { strings } from './Statistics.strings'
import * as styles from './Statistics.css'

const Statistics = () => {
  const [filter, setFilter] = useState(false)
  const [stats, setStats] = useState<CaseStatistics | undefined>()
  const [fromDate, setFromDate] = useState<Date | undefined>()
  const [toDate, setToDate] = useState<Date | undefined>()
  const [institution, setInstitution] = useState<{
    label: string
    value: string
  }>()
  const { formatMessage } = useIntl()
  const { districtCourts } = useInstitution()

  const { data, loading } = useCaseStatisticsQuery({
    variables: {
      input: filter
        ? {
            fromDate,
            toDate,
            institutionId: institution?.value,
          }
        : {},
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data?.casesStatistics) {
      setStats(data.casesStatistics)
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
          marginBottom={[2, 2, 4, 4, 6]}
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
                      id: 'indictment-cases',
                      items: [
                        {
                          id: 'indictment-case-item',
                          title: (
                            <Text variant="h3" marginBottom={2}>
                              {'Ákærur '}
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
                                label="Sent til dómstóls"
                                value={stats?.indictmentCases.sentToCourtCount}
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
                    fromDate={filter ? fromDate : undefined}
                    toDate={filter ? toDate : undefined}
                    institutionName={filter ? institution?.label : undefined}
                  />
                </Box>
              </AnimatePresence>
            )}
          </GridColumn>

          {filter && (
            <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
              <Box display="flex" flexDirection="column" rowGap={3}>
                <FiltersPanel
                  districtCourts={districtCourts}
                  institution={institution}
                  fromDate={fromDate}
                  toDate={toDate}
                  setInstitution={setInstitution}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
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
