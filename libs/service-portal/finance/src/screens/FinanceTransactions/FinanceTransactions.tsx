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
import { m } from '@island.is/service-portal/core'
import {
  Box,
  Text,
  Columns,
  Column,
  Stack,
  GridRow,
  GridColumn,
  DatePicker,
  SkeletonLoader,
  Select,
  AlertBanner,
  Hidden,
  Input,
  Button,
} from '@island.is/island-ui/core'
import { exportHreyfingarFile } from '../../utils/filesHreyfingar'
import { transactionFilter } from '../../utils/simpleFilter'
import { useLocale, useNamespaces } from '@island.is/localization'

const ALL_CHARGE_TYPES = 'ALL_CHARGE_TYPES'

const FinanceTransactions: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.finance-transactions')
  const { formatMessage } = useLocale()

  const allChargeTypes = {
    label: formatMessage({
      id: 'sp.finance-transactions:all-selection',
      defaultMessage: 'Allir gjaldflokkar',
    }),
    value: ALL_CHARGE_TYPES,
  }
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [q, setQ] = useState<string>('')
  const [dropdownSelect, setDropdownSelect] = useState<string[] | undefined>()

  const { data: customerChartypeData } = useQuery<Query>(
    GET_CUSTOMER_CHARGETYPE,
    {
      onCompleted: () => {
        if (customerChartypeData?.getCustomerChargeType?.chargeType) {
          onDropdownSelect(allChargeTypes)
        }
      },
    },
  )
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
    const backInTheDay = sub(new Date(), {
      months: 3,
    })
    setFromDate(backInTheDay)
    setToDate(new Date())
  }, [])

  function onDropdownSelect(selection: any) {
    const allChargeTypeValues = chargeTypeData?.chargeType?.map((ct) => ct.id)
    const selectedID =
      selection.value === ALL_CHARGE_TYPES
        ? allChargeTypeValues
        : [selection.value]
    setDropdownSelect(selectedID)
  }

  const recordsData: CustomerRecords = data?.getCustomerRecords || {}
  const recordsDataArray =
    (recordsData?.records && transactionFilter(recordsData?.records, q)) || []
  const chargeTypeSelect = (chargeTypeData?.chargeType || []).map((item) => ({
    label: item.name,
    value: item.id,
  }))

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'sp.finance-transactions:title',
            defaultMessage: 'Hreyfingar',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'sp.finance-transactions:intro',
                defaultMessage:
                  'Hér er að finna hreyfingar fyrir valin skilyrði. Hreyfingar geta verið gjöld, greiðslur, skuldajöfnuður o.fl.',
              })}
            </Text>
          </Column>
        </Columns>
        <Hidden print={true}>
          <Box marginTop={[1, 1, 2, 2, 5]}>
            {recordsDataArray.length > 0 ? (
              <GridRow>
                <GridColumn paddingBottom={2} span={['1/1', '12/12']}>
                  <Columns space="p2" align="right">
                    <Column width="content">
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
                    </Column>
                    <Column width="content">
                      <DropdownExport
                        onGetCSV={() =>
                          exportHreyfingarFile(recordsDataArray, 'csv')
                        }
                        onGetExcel={() =>
                          exportHreyfingarFile(recordsDataArray, 'xlsx')
                        }
                      />
                    </Column>
                  </Columns>
                </GridColumn>
              </GridRow>
            ) : null}
            <GridRow>
              <GridColumn
                paddingBottom={[1, 0]}
                span={['1/1', '1/1', '1/1', '1/1', '4/12']}
              >
                <Select
                  name="faerslur"
                  backgroundColor="blue"
                  placeholder={formatMessage(m.transactions)}
                  label={formatMessage(m.transactionsLabel)}
                  defaultValue={allChargeTypes}
                  size="sm"
                  options={[allChargeTypes, ...chargeTypeSelect]}
                  onChange={(sel) => onDropdownSelect(sel)}
                />
              </GridColumn>
              <GridColumn
                paddingTop={[2, 2, 2, 2, 0]}
                span={['1/1', '6/12', '6/12', '6/12', '4/12']}
              >
                <DatePicker
                  backgroundColor="blue"
                  handleChange={(d) => setFromDate(d)}
                  selected={fromDate}
                  icon="calendar"
                  iconType="outline"
                  size="sm"
                  label={formatMessage(m.dateFrom)}
                  locale="is"
                  placeholderText={formatMessage(m.chooseDate)}
                />
              </GridColumn>
              <GridColumn
                paddingTop={[2, 2, 2, 2, 0]}
                span={['1/1', '6/12', '6/12', '6/12', '4/12']}
              >
                <DatePicker
                  backgroundColor="blue"
                  handleChange={(d) => setToDate(d)}
                  selected={toDate}
                  icon="calendar"
                  iconType="outline"
                  size="sm"
                  label={formatMessage(m.dateTo)}
                  locale="is"
                  placeholderText={formatMessage(m.chooseDate)}
                />
              </GridColumn>
            </GridRow>
            <Box marginTop={3}>
              <Input
                label="Leit"
                name="Search"
                placeholder={formatMessage(m.searchPlaceholder)}
                size="sm"
                onChange={(e) => setQ(e.target.value)}
                value={q}
              />
            </Box>
          </Box>
        </Hidden>
        <Box marginTop={2}>
          {error && (
            <AlertBanner
              description={formatMessage(m.errorFetch)}
              variant="error"
            />
          )}
          {(loading || !called) && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
          {recordsDataArray.length === 0 && called && !loading && !error && (
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
  )
}

export default FinanceTransactions
