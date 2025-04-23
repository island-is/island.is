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

import CountAndDays from './CountAndDays'
import { FiltersPanel } from './FiltersPanel'
import { useCaseStatisticsQuery } from './getCaseStatistics.generated'
import { strings } from './Statistics.strings'
import * as styles from './Statistics.css'

const serviceStatusLabels: Record<ServiceStatus, string> = {
  [ServiceStatus.DEFENDER]: 'Birt verjanda',
  [ServiceStatus.ELECTRONICALLY]: 'Birt rafrænt',
  [ServiceStatus.IN_PERSON]: 'Birt persónulega',
  [ServiceStatus.EXPIRED]: 'Rann út á tíma',
  [ServiceStatus.FAILED]: 'Árangurslaus birting',
}

const mapServiceStatusTitle = (status?: ServiceStatus | null): string =>
  status ? serviceStatusLabels[status] ?? 'Óbirt' : 'Óbirt'

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
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
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
          direction={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
        >
          <GridColumn
            span={['12/12', '12/12', '12/12', filter ? '8/12' : '12/12']}
            paddingTop={5}
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
                                label="Í vinnslu"
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
              </AnimatePresence>
            )}
          </GridColumn>

          {filter && (
            <FiltersPanel
              districtCourts={districtCourts}
              institution={institution}
              fromDate={fromDate}
              toDate={toDate}
              setInstitution={setInstitution}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />
          )}
        </GridRow>
      </Box>
    </Box>
  )
}

export default Statistics
