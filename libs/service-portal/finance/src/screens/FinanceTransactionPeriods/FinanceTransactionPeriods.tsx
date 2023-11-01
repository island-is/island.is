import { useEffect, useState } from 'react'
import {
  AlertBanner,
  Box,
  Button,
  FilterInput,
  FilterMultiChoice,
  Hidden,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DynamicWrapper,
  FJARSYSLAN_ID,
  FootNote,
  m,
  Filter,
} from '@island.is/service-portal/core'

import FinanceIntro from '../../components/FinanceIntro'
import {
  GetChargeTypesByYearQuery,
  GetChargeTypesDetailsByYearQuery,
  useGetAssessmentYearsQuery,
  useGetChargeTypesByYearLazyQuery,
  useGetChargeTypesDetailsByYearLazyQuery,
} from './FinanceTransactionPeriods.generated'
import FinanceTransactionsPeriodsTable from '../../components/FinanceTransactionsPeriodsTable/FinanceTransactionsPeriodsTable'
import { transactionPeriodFilter } from '../../utils/simpleFilter'

const FinanceTransactionPeriods = () => {
  useNamespaces('sp.finance-transaction-periods')
  const { formatMessage } = useLocale()

  const [activeYear, setActiveYear] = useState<string>('')
  const [assessmentYears, setAssessmentYears] = useState<
    { label: string; value: string }[]
  >([])

  const [chargeTypes, setChargeTypes] =
    useState<GetChargeTypesByYearQuery['getChargeTypesByYear']>()
  const [activeChargeType, setActiveChargeType] = useState<string>('**')

  const [chargeTypeDetails, setChargeTypeDetails] =
    useState<GetChargeTypesDetailsByYearQuery['getChargeTypesDetailsByYear']>()

  const [q, setQ] = useState<string>('')
  const [dropdownSelect, setDropdownSelect] = useState<string[]>([])

  const { data: assessmentYearsData, error: assessmentYearsError } =
    useGetAssessmentYearsQuery()

  const [getChargeTypesByYear] = useGetChargeTypesByYearLazyQuery()
  const [
    getChargeTypesDetailsByYear,
    {
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
      setActiveYear(years[0].value)
    }
  }

  useEffect(() => {
    if (activeYear) {
      getChargeTypesByYear({
        variables: {
          input: { year: activeYear },
        },
        onCompleted: (data) => {
          setChargeTypes(data.getChargeTypesByYear)
        },
      })

      getChargeTypesDetailsByYear({
        variables: {
          input: { year: activeYear, typeId: activeChargeType },
        },
        onCompleted: (data) => {
          setChargeTypeDetails(data.getChargeTypesDetailsByYear)
        },
      })
    } else {
      setChargeTypes(undefined)
      setChargeTypeDetails(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeYear, activeChargeType])

  function clearFilter() {
    setDropdownSelect([])
    setActiveChargeType('**')
    setActiveYear(assessmentYears[0].value)
  }

  function clearAllFilters() {
    clearFilter()
    setQ('')
  }

  console.log(chargeTypeDetails?.chargeType)

  const recordsDataArray =
    transactionPeriodFilter(
      chargeTypeDetails?.chargeType ?? [],
      q,
      dropdownSelect,
    ) || []

  const chargeTypeSelect = (chargeTypes?.chargeType || []).map((item) => ({
    label: item.name,
    value: item.name,
  }))

  return (
    <DynamicWrapper>
      <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
        <FinanceIntro
          text={formatMessage({
            id: 'sp.finance-transaction-periods:intro',
            defaultMessage:
              'Hér er að finna hreyfingar fyrir valin skilyrði. Hreyfingar geta verið gjöld, greiðslur, skuldajöfnuður o.fl.',
          })}
        />
        <Stack space={2}>
          <Hidden print={true}>
            <Box marginTop={[1, 1, 2, 2, 5]}>
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
                    value={q}
                    onChange={(e) => setQ(e)}
                    backgroundColor="blue"
                  />
                }
                additionalFilters={
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
                }
                onFilterClear={clearAllFilters}
              >
                <FilterMultiChoice
                  labelClear={formatMessage(m.clearSelected)}
                  singleExpand={true}
                  onChange={({ categoryId, selected }) => {
                    if (categoryId === 'years') {
                      setActiveYear(selected[0])
                    }
                    if (categoryId === 'flokkur') {
                      setDropdownSelect(selected)
                    }
                  }}
                  onClear={clearFilter}
                  categories={[
                    {
                      id: 'years',
                      label: formatMessage(m.yearAndSeason),
                      selected: activeYear ? [activeYear] : [],
                      filters: assessmentYears,
                      inline: false,
                      singleOption: true,
                    },
                    {
                      id: 'flokkur',
                      label: formatMessage(m.transactionsLabel),
                      selected: dropdownSelect ? [...dropdownSelect] : [],
                      filters: chargeTypeSelect,
                      inline: false,
                      singleOption: false,
                    },
                  ]}
                />
              </Filter>
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
              <FinanceTransactionsPeriodsTable
                records={recordsDataArray}
                year={activeYear}
              />
            ) : null}
          </Box>
        </Stack>
      </Box>
      <FootNote serviceProviderID={FJARSYSLAN_ID} />
    </DynamicWrapper>
  )
}

export default FinanceTransactionPeriods
