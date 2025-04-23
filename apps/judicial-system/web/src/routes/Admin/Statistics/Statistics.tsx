import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'

import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridRow,
  Select,
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
import { useCaseStatisticsQuery } from './getCaseStatistics.generated'
import { strings } from './Statistics.strings'
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

const getServiceStatusStat = (
  status: ServiceStatus | null,
  stats?: CaseStatistics,
) =>
  stats?.subpoenas.serviceStatusStatistics.find(
    (s) => s.serviceStatus === status,
  )

type FiltersPanelProps = {
  districtCourts: { name?: string | null; id?: string | undefined }[]
  institution?: { label: string; value: string }
  fromDate?: Date
  toDate?: Date
  setInstitution: (institution?: { label: string; value: string }) => void
  setFromDate: (date?: Date) => void
  setToDate: (date?: Date) => void
}

const FiltersPanel = ({
  districtCourts,
  institution,
  fromDate,
  toDate,
  setInstitution,
  setFromDate,
  setToDate,
}: FiltersPanelProps) => (
  <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
    <Box display="flex" flexDirection="column" rowGap={3} marginTop={5}>
      <AnimatePresence mode="wait">
        <motion.div
          key="filters"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
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
              onChange={(selectedOption) =>
                setInstitution(selectedOption ?? undefined)
              }
              value={institution ?? null}
            />

            <DatePicker
              name="statisticsDateFrom"
              label="Veldu dagsetningu frá"
              placeholderText="Frá"
              size="sm"
              selected={fromDate}
              maxDate={new Date()}
              handleChange={(date: Date | null) =>
                setFromDate(date ?? undefined)
              }
            />

            <DatePicker
              name="statisticsDateTo"
              label="Veldu dagsetningu til"
              placeholderText="Til"
              size="sm"
              maxDate={new Date()}
              minDate={fromDate}
              selected={toDate}
              handleChange={(date: Date | null) => setToDate(date ?? undefined)}
            />

            <Button
              size="small"
              variant="ghost"
              onClick={() => {
                setFromDate(undefined)
                setToDate(undefined)
                setInstitution(undefined)
              }}
            >
              Hreinsa
            </Button>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  </GridColumn>
)

const Statistics = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>()
  const [toDate, setToDate] = useState<Date | undefined>()
  const [institution, setInstitution] = useState<{
    label: string
    value: string
  }>()
  const [filter, setFilter] = useState(false)
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
    fetchPolicy: 'no-cache',
  })

  const stats = data?.casesStatistics
  const allServiceStatuses = useMemo(
    () => [null, ...Object.values(ServiceStatus)],
    [],
  )

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
            onChange={(isChecked) => {
              setFilter(isChecked)
            }}
          />
        </Box>

        <GridRow
          direction={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
        >
          <GridColumn
            span={['12/12', '12/12', '12/12', filter ? '8/12' : '12/12']}
            paddingTop={5}
          >
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
                            key="stats-count"
                            label="Heildarfjöldi"
                            value={loading ? '' : stats?.count}
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
                              value={
                                loading ? '' : stats?.indictmentCases.count
                              }
                            />
                            <LabelValue
                              label="Í vinnslu"
                              value={
                                loading
                                  ? ''
                                  : stats?.indictmentCases.sentToCourtCount
                              }
                            />
                            <CountAndDays
                              label="Lokið með dómi"
                              count={stats?.indictmentCases.rulingCount ?? 0}
                              days={
                                stats?.indictmentCases.averageRulingTimeDays ??
                                0
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
                              value={loading ? '' : stats?.subpoenas.count}
                            />
                            {allServiceStatuses.map((status) => {
                              const stat = getServiceStatusStat(
                                status,
                                stats ?? undefined,
                              )
                              return (
                                <CountAndDays
                                  key={status ?? 'UNDEFINED'}
                                  label={mapServiceStatusTitle(status)}
                                  count={stat?.count ?? 0}
                                  days={stat?.averageServiceTimeDays ?? 0}
                                />
                              )
                            })}
                          </Box>,
                        ],
                      },
                    ],
                  },
                ]}
              />
            </AnimatePresence>
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
