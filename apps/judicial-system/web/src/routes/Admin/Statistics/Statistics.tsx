import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import {
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Select,
  SkeletonLoader,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import {
  InfoCard,
  LabelValue,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import { ServiceStatus } from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import {
  useCaseStatisticsLazyQuery,
  useCaseStatisticsQuery,
} from './getCaseStatistics.generated'
import ServiceStatusItem from './ServiceStatusItem'
import * as styles from './Statistics.css'

const mapServiceStatusTitle = (
  serviceStatus?: ServiceStatus | null,
): string => {
  switch (serviceStatus) {
    case ServiceStatus.DEFENDER:
      return 'Birt verjanda'
    case ServiceStatus.ELECTRONICALLY:
      return 'Birt rafrænt'
    case ServiceStatus.IN_PERSON:
      return 'Birt persónulega'
    case ServiceStatus.EXPIRED:
      return 'Rann út á tíma'
    case ServiceStatus.FAILED:
      return 'Árangurslaus birting'
    default:
      return 'Óbirt'
  }
}

export const Statistics = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [institution, setInstitution] = useState<{
    label: string
    value: string
  }>()
  const [filter, setFilter] = useState(false)

  const { districtCourts } = useInstitution()

  const { data, loading } = useCaseStatisticsQuery({
    variables: {
      input: {
        fromDate,
        toDate,
        institutionId: institution?.value,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const stats = data?.casesStatistics

  return (
    <Box className={styles.statisticsPageContainer}>
      <PageHeader title="Tölfræði" />
      <Box className={styles.statisticsContentBox}>
        <Box
          display="flex"
          flexDirection={['row']}
          justifyContent="spaceBetween"
          alignItems={['center']}
          rowGap={2}
        >
          <Text as="h1" variant="h1">
            Tölfræði
          </Text>

          <ToggleSwitchCheckbox
            name="toggleFilter"
            label={<Text>Sía</Text>}
            checked={filter}
            onChange={(isChecked) => {
              setFilter(isChecked)
              if (!isChecked) {
                setInstitution(undefined)
                setFromDate(undefined)
                setToDate(undefined)
              }
            }}
          />
        </Box>

        <GridRow
          direction={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
        >
          <GridColumn
            span={['12/12', '12/12', '12/12', filter ? '8/12' : '12/12']}
            paddingTop={[3, 3, 3, 5]}
          >
            {loading ? (
              <SkeletonLoader height={320} borderRadius="standard" />
            ) : (
              stats && (
                <InfoCard
                  sections={[
                    {
                      id: 'all-cases',
                      items: [
                        {
                          id: 'case-item',
                          title: (
                            <Text variant="h3" marginBottom={2}>
                              Öll mál
                            </Text>
                          ),
                          values: [
                            <LabelValue
                              label="Heildarfjöldi"
                              value={stats.count}
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
                              Ákærur
                            </Text>
                          ),
                          values: [
                            <LabelValue
                              label="Heildarfjöldi"
                              value={stats.indictmentCases.count}
                            />,
                            <LabelValue
                              label="Meðal afgreiðslutími"
                              value={`${stats.indictmentCases.averageRulingTimeDays} dagar`}
                            />,
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
                              Fyrirköll
                            </Text>
                          ),
                          values: [
                            <Box
                              display="flex"
                              flexDirection="column"
                              rowGap={1}
                            >
                              <LabelValue
                                label="Heildarfjöldi"
                                value={stats.indictmentCases.count}
                              />
                              {stats.subpoenas.serviceStatusStatistics.map(
                                (status) => (
                                  <ServiceStatusItem
                                    key={status.serviceStatus ?? 'unserviced'}
                                    title={mapServiceStatusTitle(
                                      status.serviceStatus,
                                    )}
                                    count={status.count}
                                    averageDays={status.averageServiceTimeDays}
                                  />
                                ),
                              )}
                            </Box>,
                          ],
                        },
                      ],
                    },
                  ]}
                />
              )
            )}
          </GridColumn>
          {filter && (
            <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
              <Box
                display="flex"
                flexDirection="column"
                rowGap={3}
                marginTop={5}
              >
                <AnimatePresence mode="wait">
                  {filter && (
                    <motion.div
                      key="filters"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                      <Box display="flex" flexDirection="column" rowGap={2}>
                        <Box display="flex" flexDirection="column" rowGap={2}>
                          <Select
                            name="court"
                            label="Veldu dómstól"
                            placeholder="Dómstóll"
                            size="sm"
                            options={districtCourts.map((court) => ({
                              label: court.name ?? '',
                              value: court.id ?? '',
                            }))}
                            onChange={(selectedOption) => {
                              setInstitution(
                                selectedOption as {
                                  label: string
                                  value: string
                                },
                              )
                            }}
                            value={institution}
                          />

                          <DatePicker
                            name="statisticsDateFrom"
                            label="Veldu dagsetningu frá"
                            placeholderText="Frá"
                            size="sm"
                            selected={fromDate ? new Date(fromDate) : undefined}
                            handleChange={(date: Date | null) => {
                              setFromDate(date ?? undefined)
                            }}
                          />

                          <DatePicker
                            name="statisticsDateTo"
                            label="Veldu dagsetningu til"
                            placeholderText="Til"
                            size="sm"
                            maxDate={new Date()}
                            selected={toDate ? new Date(toDate) : undefined}
                            handleChange={(date: Date | null) => {
                              setToDate(date ?? undefined)
                            }}
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </GridColumn>
          )}
        </GridRow>
      </Box>
    </Box>
  )
}

export default Statistics
