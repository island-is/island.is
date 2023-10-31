import format from 'date-fns/format'
import sub from 'date-fns/sub'
import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AlertBanner,
  Box,
  Button,
  DatePicker,
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

import DropdownExport from '../../components/DropdownExport/DropdownExport'
import FinanceTransactionsTable from '../../components/FinanceTransactionsTable/FinanceTransactionsTable'
import { exportHreyfingarFile } from '../../utils/filesHreyfingar'
import { transactionFilter } from '../../utils/simpleFilter'
import * as styles from '../Finance.css'
import {
  CustomerChargeType,
  CustomerRecords,
} from './FinanceTransactionsData.types'
import FinanceIntro from '../../components/FinanceIntro'
import {
  useGetCustomerChargeTypeQuery,
  useGetCustomerRecordsLazyQuery,
} from './FinanceTransactions.generated'

const FinanceTransactions = () => {
  useNamespaces('sp.finance-transactions')
  const { formatMessage } = useLocale()
  const backInTheDay = sub(new Date(), {
    months: 3,
  })
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [q, setQ] = useState<string>('')
  const [chargeTypesEmpty, setChargeTypesEmpty] = useState(false)
  const [dropdownSelect, setDropdownSelect] = useState<string[] | undefined>()

  const {
    data: customerChartypeData,
    loading: chargeTypeDataLoading,
    error: chargeTypeDataError,
  } = useGetCustomerChargeTypeQuery({
    onCompleted: (data) => {
      if (data?.getCustomerChargeType?.chargeType) {
        setEmptyChargeTypes()
      } else {
        setChargeTypesEmpty(true)
      }
    },
  })

  const chargeTypeData: CustomerChargeType =
    customerChartypeData?.getCustomerChargeType || {}

  const [loadCustomerRecords, { data, loading, called, error }] =
    useGetCustomerRecordsLazyQuery()

  useEffect(() => {
    if (toDate && fromDate && dropdownSelect) {
      loadCustomerRecords({
        variables: {
          input: {
            chargeTypeID:
              dropdownSelect.length === 0
                ? getAllChargeTypes()
                : dropdownSelect,
            dayFrom: format(fromDate, 'yyyy-MM-dd'),
            dayTo: format(toDate, 'yyyy-MM-dd'),
          },
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toDate, fromDate, dropdownSelect])

  useEffect(() => {
    setFromDate(backInTheDay)
    setToDate(new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getAllChargeTypes() {
    const allChargeTypeValues = chargeTypeData?.chargeType?.map((ct) => ct.id)
    return allChargeTypeValues ?? []
  }

  function setEmptyChargeTypes() {
    setDropdownSelect([])
  }

  function clearAllFilters() {
    setEmptyChargeTypes()
    setFromDate(backInTheDay)
    setToDate(new Date())
    setQ('')
  }

  const recordsData = (data?.getCustomerRecords || {}) as CustomerRecords
  const recordsDataArray =
    (recordsData?.records && transactionFilter(recordsData?.records, q)) || []
  const chargeTypeSelect = (chargeTypeData?.chargeType || []).map((item) => ({
    label: item.name,
    value: item.id,
  }))

  return (
    <DynamicWrapper>
      <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
        <FinanceIntro
          text={formatMessage({
            id: 'sp.finance-transactions:intro',
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
                    name="finance-transaction-input"
                    value={q}
                    onChange={(e) => setQ(e)}
                    backgroundColor="blue"
                  />
                }
                additionalFilters={
                  <>
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
                    <DropdownExport
                      onGetCSV={() =>
                        exportHreyfingarFile(recordsDataArray, 'csv')
                      }
                      onGetExcel={() =>
                        exportHreyfingarFile(recordsDataArray, 'xlsx')
                      }
                    />
                  </>
                }
                onFilterClear={clearAllFilters}
              >
                <FilterMultiChoice
                  labelClear={formatMessage(m.clearSelected)}
                  singleExpand={true}
                  onChange={({ selected }) => {
                    setDropdownSelect(selected)
                  }}
                  onClear={() => {
                    setEmptyChargeTypes()
                  }}
                  categories={[
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
                <Box className={styles.dateFilter} paddingX={3}>
                  <Box
                    borderBottomWidth="standard"
                    borderColor="blue200"
                    width="full"
                  />
                  <Box marginTop={1}>
                    <Accordion
                      dividerOnBottom={false}
                      dividerOnTop={false}
                      singleExpand={false}
                    >
                      <AccordionItem
                        key="date-accordion-item"
                        id="date-accordion-item"
                        label={formatMessage(m.datesLabel)}
                        labelColor="dark400"
                        labelUse="h5"
                        labelVariant="h5"
                        iconVariant="small"
                      >
                        <Box
                          className={styles.accordionBox}
                          display="flex"
                          flexDirection="column"
                        >
                          <DatePicker
                            label={formatMessage(m.datepickerFromLabel)}
                            placeholderText={formatMessage(m.datepickLabel)}
                            locale="is"
                            backgroundColor="blue"
                            size="xs"
                            handleChange={(d) => setFromDate(d)}
                            selected={fromDate}
                            appearInline
                          />
                          <Box marginTop={3}>
                            <DatePicker
                              label={formatMessage(m.datepickerToLabel)}
                              placeholderText={formatMessage(m.datepickLabel)}
                              locale="is"
                              backgroundColor="blue"
                              size="xs"
                              handleChange={(d) => setToDate(d)}
                              selected={toDate}
                              appearInline
                            />
                          </Box>
                        </Box>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </Box>
              </Filter>
            </Box>
          </Hidden>

          <Box marginTop={2}>
            {(error || chargeTypeDataError) && (
              <AlertBanner
                description={formatMessage(m.errorFetch)}
                variant="error"
              />
            )}
            {(loading || chargeTypeDataLoading || !called) &&
              !chargeTypesEmpty &&
              !chargeTypeDataError &&
              !error && (
                <Box padding={3}>
                  <SkeletonLoader space={1} height={40} repeat={5} />
                </Box>
              )}
            {((recordsDataArray.length === 0 && called && !loading && !error) ||
              chargeTypesEmpty) && (
              <AlertBanner
                description={formatMessage(m.noResultsTryAgain)}
                variant="warning"
              />
            )}
            {recordsDataArray.length > 0 ? (
              <FinanceTransactionsTable recordsArray={recordsDataArray} />
            ) : null}
          </Box>
        </Stack>
      </Box>
      <FootNote serviceProviderID={FJARSYSLAN_ID} />
    </DynamicWrapper>
  )
}

export default FinanceTransactions
