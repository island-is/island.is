import {
  AlertBanner,
  Box,
  Button,
  Filter,
  FilterInput,
  FilterMultiChoice,
  FilterMultiChoiceProps,
  Hidden,
  Inline,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DownloadFileButtons, m } from '@island.is/portals/my-pages/core'
import { useEffect, useRef, useState } from 'react'
import { exportPeriodBreakdownFile } from '../../utils/filesPeriodBreakdown'

import { useFinanceTransactionPeriodsState } from '../../components/FinanceTransactionPeriods/FinanceTransactionPeriodsContext'
import { m as messages } from '../../lib/messages'
import {
  useGetAssessmentYearsQuery,
  useGetChargeTypesByYearLazyQuery,
  useGetChargeTypesDetailsByYearLazyQuery,
} from '../../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'
import { transactionPeriodFilter } from '../../utils/simpleFilter'
import FinanceTransactionPeriodsTable from './FinanceTransactionPeriodsTable'
import {
  ChargeTypesByYear,
  ChargeTypesDetailsByYear,
} from './FinanceTransactionPeriodsTypes'
import FinanceTransactionSelectedPeriod from './FinanceTransactionSelectedPeriod'

const DEFAULT_CHARGE_TYPE = '**' // ** finds all charge types

const FinanceTransactionPeriodsFilter = () => {
  const { formatMessage } = useLocale()
  const selectedPeriodsRef = useRef<HTMLElement>(null)

  const { financeTransactionPeriodsState, setFinanceTransactionPeriodsState } =
    useFinanceTransactionPeriodsState()

  const [assessmentYears, setAssessmentYears] = useState<
    FilterMultiChoiceProps['categories'][0]['filters']
  >([])

  const [chargeTypes, setChargeTypes] = useState<ChargeTypesByYear>()
  const [activeChargeType, setActiveChargeType] =
    useState<string>(DEFAULT_CHARGE_TYPE)

  const [chargeTypeDetails, setChargeTypeDetails] =
    useState<ChargeTypesDetailsByYear>()

  const [dropdownSelect, setDropdownSelect] = useState<string[]>([])

  const [selectedPeriodsActive, setSelectedPeriodsActive] = useState(false)

  const { data: assessmentYearsData, error: assessmentYearsError } =
    useGetAssessmentYearsQuery()

  const [getChargeTypesByYear, { data: chargeTypesData }] =
    useGetChargeTypesByYearLazyQuery()

  const [
    getChargeTypesDetailsByYear,
    {
      data: chargeTypesDetailsData,
      loading: chargeTypesDetailsLoading,
      called: chargeTypesDetailsCalled,
      error: chargeTypesDetailsError,
    },
  ] = useGetChargeTypesDetailsByYearLazyQuery()

  if (assessmentYearsData && !assessmentYears.length) {
    const years = [...(assessmentYearsData?.getAssessmentYears.year ?? [])]
      .reverse()
      .map((y) => {
        return { label: y, value: y }
      })

    if (years.length) {
      setAssessmentYears(years)
    }
  }

  useEffect(() => {
    if (assessmentYears.length) {
      setFinanceTransactionPeriodsState({ year: assessmentYears[0].value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentYears])

  useEffect(() => {
    setSelectedPeriodsActive(false)
    setFinanceTransactionPeriodsState({ selectedPeriods: [] })

    if (financeTransactionPeriodsState.year) {
      getChargeTypesByYear({
        variables: {
          input: { year: financeTransactionPeriodsState.year },
        },
      })

      getChargeTypesDetailsByYear({
        variables: {
          input: {
            year: financeTransactionPeriodsState.year,
            typeId: activeChargeType,
          },
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [financeTransactionPeriodsState.year, activeChargeType])

  useEffect(() => {
    setChargeTypes(chargeTypesData?.getChargeTypesByYear)
    setChargeTypeDetails(chargeTypesDetailsData?.getChargeTypesDetailsByYear)
  }, [chargeTypesData, chargeTypesDetailsData])

  function clearFilter() {
    setDropdownSelect([])
    setActiveChargeType(DEFAULT_CHARGE_TYPE)
    setFinanceTransactionPeriodsState({ year: assessmentYears[0].value })
  }

  function clearAllFilters() {
    clearFilter()
    setFinanceTransactionPeriodsState({ searchQuery: '' })
  }

  const recordsDataArray =
    transactionPeriodFilter(
      chargeTypeDetails?.chargeType ?? [],
      financeTransactionPeriodsState.searchQuery ?? '',
      dropdownSelect,
    ) || []

  const chargeTypeSelect = (chargeTypes?.chargeType || []).map((item) => ({
    label: item.name,
    value: item.name,
  }))

  return (
    <Stack space={2}>
      <Hidden print={true}>
        <Box marginTop={[1, 1, 2, 2, 5]}>
          <Inline space={2}>
            <Filter
              variant="popover"
              align="left"
              reverse
              labelClear={formatMessage(m.clearFilter)}
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelOpen={formatMessage(m.openFilter)}
              labelClose={formatMessage(m.closeFilter)}
              filterInput={
                <FilterInput
                  placeholder={formatMessage(m.searchPlaceholder)}
                  name="finance-transaction-periods-input"
                  value={financeTransactionPeriodsState.searchQuery ?? ''}
                  onChange={(e) =>
                    setFinanceTransactionPeriodsState({ searchQuery: e })
                  }
                  backgroundColor="blue"
                />
              }
              onFilterClear={clearAllFilters}
            >
              <FilterMultiChoice
                labelClear={formatMessage(m.clearSelected)}
                singleExpand={true}
                onChange={({ categoryId, selected }) => {
                  if (categoryId === 'years') {
                    setFinanceTransactionPeriodsState({ year: selected[0] })
                  }
                  if (categoryId === 'flokkur') {
                    setDropdownSelect(selected)
                  }
                }}
                onClear={clearFilter}
                categories={[
                  {
                    id: 'years',
                    label: formatMessage(messages.transactionsYear),
                    selected: financeTransactionPeriodsState.year
                      ? [financeTransactionPeriodsState.year]
                      : [],
                    filters: assessmentYears,
                    inline: false,
                    singleOption: true,
                  },
                  {
                    id: 'flokkur',
                    label: formatMessage(messages.transactionsLabel),
                    selected: dropdownSelect ? [...dropdownSelect] : [],
                    filters: chargeTypeSelect,
                    inline: false,
                    singleOption: false,
                  },
                ]}
              />
            </Filter>

            <Button
              colorScheme="default"
              icon="print"
              iconType="filled"
              onClick={() => window.print()}
              preTextIconType="filled"
              size="default"
              type="button"
              variant="utility"
            >
              {formatMessage(m.print)}
            </Button>
          </Inline>
        </Box>
      </Hidden>

      <Box marginTop={2}>
        {(chargeTypesDetailsError || assessmentYearsError) && (
          <AlertBanner
            description={formatMessage(m.errorFetch)}
            variant="error"
          />
        )}
        {(chargeTypesDetailsLoading || !chargeTypesDetailsCalled) &&
          !chargeTypeDetails?.chargeType?.length &&
          !chargeTypesDetailsError && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
        {!chargeTypeDetails?.chargeType?.length &&
          chargeTypesDetailsCalled &&
          !chargeTypesDetailsLoading &&
          !chargeTypesDetailsError && (
            <AlertBanner
              description={formatMessage(m.noResultsTryAgain)}
              variant="warning"
            />
          )}
        {chargeTypeDetails?.chargeType?.length ? (
          <FinanceTransactionPeriodsTable records={recordsDataArray} />
        ) : null}
      </Box>

      {chargeTypeDetails?.chargeType?.length ? (
        <Box paddingTop={2}>
          <Box justifyContent="flexEnd" display="flex">
            <Button
              disabled={
                !financeTransactionPeriodsState.selectedPeriods?.length ||
                selectedPeriodsActive
              }
              colorScheme="default"
              icon="playCircle"
              iconType="filled"
              onClick={() => {
                setSelectedPeriodsActive(true)
                setTimeout(() => {
                  selectedPeriodsRef.current?.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                  })
                }, 250)
              }}
              preTextIconType="filled"
              size="default"
              type="button"
              variant="utility"
            >
              {formatMessage(messages.displaySelectedPeriods)}
            </Button>
          </Box>
          {selectedPeriodsActive && (
            <Box ref={selectedPeriodsRef}>
              <Text
                as="h2"
                fontWeight="semiBold"
                variant="h3"
                paddingBottom={2}
              >
                {formatMessage(messages.selectedPeriods)}
              </Text>
              {financeTransactionPeriodsState.selectedPeriods?.map(
                (period, i) => {
                  return (
                    <FinanceTransactionSelectedPeriod
                      key={`${period.period}-${period.subject}-${period.typeId}`}
                      period={period}
                      index={i}
                    />
                  )
                },
              )}
              {financeTransactionPeriodsState.selectedPeriods?.length ? (
                <DownloadFileButtons
                  BoxProps={{
                    paddingBottom: 4,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flexEnd',
                  }}
                  buttons={[
                    {
                      text: formatMessage(m.getAsExcel),
                      onClick: () =>
                        exportPeriodBreakdownFile(
                          financeTransactionPeriodsState.selectedPeriods ?? [],
                          'ValinTimabil',
                          'xlsx',
                        ),
                    },
                    {
                      text: formatMessage(m.getAsCsv),
                      onClick: () =>
                        exportPeriodBreakdownFile(
                          financeTransactionPeriodsState.selectedPeriods ?? [],
                          'ValinTimabil',
                          'csv',
                        ),
                    },
                  ]}
                />
              ) : null}
            </Box>
          )}
        </Box>
      ) : null}
    </Stack>
  )
}

export default FinanceTransactionPeriodsFilter
