import React, { useState, useEffect } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import sub from 'date-fns/sub'
import { Query } from '@island.is/api/schema'
import {
  GET_CUSTOMER_CHARGETYPE,
  GET_CUSTOMER_RECORDS,
} from '@island.is/service-portal/graphql'
import format from 'date-fns/format'
import FinanceTransactionsTable from '../../components/FinanceTransactionsTable/FinanceTransactionsTable'
import {
  CustomerChargeType,
  CustomerRecords,
} from './FinanceTransactionsData.types'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import { m, DynamicWrapper } from '@island.is/service-portal/core'
import {
  Box,
  Text,
  Stack,
  GridRow,
  GridColumn,
  DatePicker,
  SkeletonLoader,
  AlertBanner,
  Hidden,
  Button,
  Filter,
  FilterInput,
  FilterMultiChoice,
  AccordionItem,
  Accordion,
} from '@island.is/island-ui/core'
import { exportHreyfingarFile } from '../../utils/filesHreyfingar'
import { transactionFilter } from '../../utils/simpleFilter'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from '../Finance.css'

const ALL_CHARGE_TYPES = 'ALL_CHARGE_TYPES'

const FinanceTransactions: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance-transactions')
  const { formatMessage } = useLocale()

  const allChargeTypes = {
    label: formatMessage({
      id: 'sp.finance-transactions:all-selection',
      defaultMessage: 'Allir gjaldflokkar',
    }),
    value: ALL_CHARGE_TYPES,
  }
  const backInTheDay = sub(new Date(), {
    months: 3,
  })
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [q, setQ] = useState<string>('')
  const [chargeTypesEmpty, setChargeTypesEmpty] = useState(false)
  const [dropdownSelect, setDropdownSelect] = useState<string[] | undefined>()
  const [dropdownValue, setDropdownValue] = useState<string>(
    allChargeTypes.value,
  )

  const {
    data: customerChartypeData,
    loading: chargeTypeDataLoading,
    error: chargeTypeDataError,
  } = useQuery<Query>(GET_CUSTOMER_CHARGETYPE, {
    onCompleted: () => {
      if (customerChartypeData?.getCustomerChargeType?.chargeType) {
        onDropdownSelect(allChargeTypes.value)
      } else {
        setChargeTypesEmpty(true)
      }
    },
  })
  const chargeTypeData: CustomerChargeType =
    customerChartypeData?.getCustomerChargeType || {}

  const [loadCustomerRecords, { data, loading, called, error }] = useLazyQuery(
    GET_CUSTOMER_RECORDS,
  )

  useEffect(() => {
    if (toDate && fromDate && dropdownSelect) {
      loadCustomerRecords({
        variables: {
          input: {
            chargeTypeID: dropdownSelect,
            dayFrom: format(fromDate, 'yyyy-MM-dd'),
            dayTo: format(toDate, 'yyyy-MM-dd'),
          },
        },
      })
    }
  }, [toDate, fromDate, dropdownSelect])

  useEffect(() => {
    setFromDate(backInTheDay)
    setToDate(new Date())
  }, [])

  function onDropdownSelect(selection: any) {
    const allChargeTypeValues = chargeTypeData?.chargeType?.map((ct) => ct.id)
    const selectedID =
      selection === ALL_CHARGE_TYPES ? allChargeTypeValues : [selection]
    setDropdownSelect(selectedID)
    setDropdownValue(selection)
  }

  function clearAllFilters() {
    onDropdownSelect(allChargeTypes.value)
    setFromDate(backInTheDay)
    setToDate(new Date())
    setQ('')
  }

  const recordsData: CustomerRecords = data?.getCustomerRecords || {}
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
          <Text variant="h3" as="h1">
            {formatMessage({
              id: 'sp.finance-transactions:title',
              defaultMessage: 'Hreyfingar',
            })}
          </Text>
          <GridRow>
            <GridColumn span={['11/12', '6/12']}>
              <Text variant="default" marginBottom={6}>
                {formatMessage({
                  id: 'sp.finance-transactions:intro',
                  defaultMessage:
                    'Hér er að finna hreyfingar fyrir valin skilyrði. Hreyfingar geta verið gjöld, greiðslur, skuldajöfnuður o.fl.',
                })}
              </Text>
              <Box
                display="flex"
                marginLeft="auto"
                paddingRight={2}
                printHidden
              >
                <Box paddingRight={2}>
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
                </Box>
                <DropdownExport
                  onGetCSV={() => exportHreyfingarFile(recordsDataArray, 'csv')}
                  onGetExcel={() =>
                    exportHreyfingarFile(recordsDataArray, 'xlsx')
                  }
                />
              </Box>
            </GridColumn>
          </GridRow>
          <Hidden print={true}>
            <Box marginTop={[1, 1, 2, 2, 5]}>
              <Filter
                resultCount={0}
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
                    name="rafraen-skjol-input"
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
                    onDropdownSelect(selected[0])
                  }}
                  onClear={() => {
                    onDropdownSelect(allChargeTypes.value)
                  }}
                  categories={[
                    {
                      id: 'flokkur',
                      label: formatMessage(m.transactionsLabel),
                      selected: [dropdownValue] ?? [],
                      filters: [allChargeTypes, ...chargeTypeSelect],
                      inline: false,
                      singleOption: true,
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
                        labelColor="blue400"
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
    </DynamicWrapper>
  )
}

export default FinanceTransactions
