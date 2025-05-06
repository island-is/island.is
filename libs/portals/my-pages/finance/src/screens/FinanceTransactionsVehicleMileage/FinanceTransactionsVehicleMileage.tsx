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
  LinkButton,
  m,
} from '@island.is/portals/my-pages/core'
import { m as messages } from '../../lib/messages'

import format from 'date-fns/format'
import sub from 'date-fns/sub'
import { useEffect, useMemo, useState } from 'react'

import { Problem } from '@island.is/react-spa/shared'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import FinanceTransactionsTable from '../../components/FinanceTransactionsTable/FinanceTransactionsTable'
import { exportHreyfingarFile } from '../../utils/filesHreyfingar'
import { transactionFilter } from '../../utils/simpleFilter'
import * as styles from '../Finance.css'
import * as extraStyles from './FinanceTransactionsVehicleMileage.css'

import { useFinanceSwapHook } from '../../utils/financeSwapHook'
import { CustomerRecords } from '../../lib/types'
import { useGetCustomerRecordsLazyQuery } from './FinanceTransactionsVehicleMileage.generated'
import { FinancePaths } from '../../lib/paths'

const VEHICLE_MILEAGE_CHARGE_TYPE = 'BM'

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
  const [dropdownSelect, setDropdownSelect] = useState<string[]>()

  const [loadCustomerRecords, { data, loading, called, error }] =
    useGetCustomerRecordsLazyQuery()

  useEffect(() => {
    if (toDate && fromDate) {
      loadCustomerRecords({
        variables: {
          input: {
            chargeTypeID: [VEHICLE_MILEAGE_CHARGE_TYPE],
            dayFrom: format(fromDate, 'yyyy-MM-dd'),
            dayTo: format(toDate, 'yyyy-MM-dd'),
          },
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toDate, fromDate])

  useEffect(() => {
    setFromDate(backInTheDay)
    setToDate(new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearAllFilters = () => {
    setFromDate(backInTheDay)
    setToDate(new Date())
    setQ('')
  }

  const filters = useMemo(() => {
    const customerRecords = data?.getCustomerRecords
    if (customerRecords) {
      return Array.from(
        new Set(customerRecords.records?.map((r) => r.chargeItemSubject)),
      ).map((s) => ({
        label: s,
        value: s,
      }))
    }
  }, [data])

  const recordsDataArray = useMemo(() => {
    const recordsData = (data?.getCustomerRecords || {}) as CustomerRecords
    const array =
      (recordsData?.records && transactionFilter(recordsData?.records, q)) || []

    return (dropdownSelect?.length ?? 0) > 0
      ? array.filter((a) => dropdownSelect?.includes(a.chargeItemSubject))
      : array
  }, [data?.getCustomerRecords, q, dropdownSelect])

  return (
    <>
      <Box className={extraStyles.header} marginBottom={3}>
        <LinkButton
          to={formatMessage(messages.mileageFeeLink)}
          text={formatMessage(messages.mileageFeeLinkLabel)}
          variant="text"
        />
      </Box>
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
                      name="finance-transaction-vehicle-mileage-input"
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
                      setDropdownSelect([])
                    }}
                    categories={[
                      {
                        id: 'flokkur',
                        label: formatMessage(messages.transactionsVehicleLabel),
                        labelAs: 'h2',
                        selected: dropdownSelect ? [...dropdownSelect] : [],
                        filters: filters ?? [],
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

                <LinkButton
                  to={FinancePaths.LinkAssetsVehiclesBulkMileage}
                  variant="utility"
                  icon="pencil"
                  size="medium"
                  text={formatMessage(messages.submitMileage)}
                />

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
                  label={formatMessage(messages.actions)}
                  onGetCSV={() => exportHreyfingarFile(recordsDataArray, 'csv')}
                  onGetExcel={() =>
                    exportHreyfingarFile(recordsDataArray, 'xlsx')
                  }
                />
              </Inline>
            </Hidden>

            <Box marginTop={2}>
              {error && <Problem error={error} noBorder={false} />}
              {(loading || !called) && !error && (
                <Box padding={3}>
                  <SkeletonLoader space={1} height={40} repeat={5} />
                </Box>
              )}
              {recordsDataArray.length === 0 &&
                called &&
                !loading &&
                !error && (
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
    </>
  )
}

export default FinanceTransactions
