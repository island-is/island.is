import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  DatePicker,
  Filter,
  FilterInput,
  FilterMultiChoice,
  Hidden,
  Inline,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DynamicWrapper,
  FJARSYSLAN_SLUG,
  FootNote,
  m,
} from '@island.is/portals/my-pages/core'
import format from 'date-fns/format'
import sub from 'date-fns/sub'
import { useEffect, useState } from 'react'
import { m as messages } from '../../lib/messages'

import { Problem } from '@island.is/react-spa/shared'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import FinanceTransactionsTable from '../../components/FinanceTransactionsTable/FinanceTransactionsTable'
import { exportHreyfingarFile } from '../../utils/filesHreyfingar'
import { transactionFilter } from '../../utils/simpleFilter'
import * as styles from '../Finance.css'
import {
  useGetCustomerChargeTypeQuery,
  useGetCustomerRecordsLazyQuery,
} from './FinanceTransactions.generated'
import { useFinanceSwapHook } from '../../utils/financeSwapHook'
import { CustomerChargeType, CustomerRecords } from '../../lib/types'

const FinanceTransactions = () => {
  useNamespaces('sp.finance-transactions')
  useFinanceSwapHook()
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
  const getAllChargeTypes = () => {
    const allChargeTypeValues = chargeTypeData?.chargeType?.map((ct) => ct.id)
    return allChargeTypeValues ?? []
  }

  const setEmptyChargeTypes = () => {
    setDropdownSelect([])
  }

  const clearAllFilters = () => {
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
      <Box marginBottom={[6, 6, 10]}>
        <Stack space={2}>
          <Hidden print={true}>
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
                    name="finance-transaction-input"
                    value={q}
                    onChange={(e) => setQ(e)}
                    backgroundColor="blue"
                  />
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
                      label: formatMessage(messages.transactionsLabel),
                      labelAs: 'h2',
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
                            label={formatMessage(m.datepickPeriod)}
                            placeholderText={formatMessage(
                              m.datepickPeriodLabel,
                            )}
                            locale="is"
                            backgroundColor="blue"
                            size="xs"
                            handleChange={(d, e) => {
                              setFromDate(d)
                              setToDate(e)
                            }}
                            selected={fromDate}
                            appearInline
                            range
                          />
                        </Box>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </Box>
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
              <DropdownExport
                onGetCSV={() => exportHreyfingarFile(recordsDataArray, 'csv')}
                onGetExcel={() =>
                  exportHreyfingarFile(recordsDataArray, 'xlsx')
                }
              />
            </Inline>
          </Hidden>

          <Box marginTop={2}>
            {(error || chargeTypeDataError) && (
              <Problem error={error || chargeTypeDataError} noBorder={false} />
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
              <Problem
                type="no_data"
                noBorder={false}
                title={formatMessage(m.noData)}
                message={formatMessage(m.noTransactionFound)}
                imgSrc="./assets/images/sofa.svg"
                imgAlt=""
              />
            )}
            {recordsDataArray.length > 0 ? (
              <FinanceTransactionsTable recordsArray={recordsDataArray} />
            ) : null}
          </Box>
        </Stack>
      </Box>
      <FootNote serviceProviderSlug={FJARSYSLAN_SLUG} />
    </DynamicWrapper>
  )
}

export default FinanceTransactions
