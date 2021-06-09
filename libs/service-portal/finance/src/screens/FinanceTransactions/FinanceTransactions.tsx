import React, { useState, useEffect } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import format from 'date-fns/format'
import FinanceTransactionsTable from '../../components/FinanceTransactionsTable/FinanceTransactionsTable'
import {
  CustomerChargeType,
  CustomerRecords,
} from './FinanceTransactionsData.types'
import {
  Box,
  Text,
  Columns,
  Column,
  Stack,
  GridRow,
  GridColumn,
  DatePicker,
  LoadingDots,
  Select,
  AlertBanner,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

const ALL_CHARGE_TYPES = 'ALL_CHARGE_TYPES'

const GetCustomerChargeTypeQuery = gql`
  query GetCustomerChargeTypeQuery {
    getCustomerChargeType {
      chargeType {
        id
        name
      }
    }
  }
`

const GetCustomerRecordsQuery = gql`
  query GetCustomerRecordsQuery($input: GetCustomerRecordsInput!) {
    getCustomerRecords(input: $input) {
      records {
        createDate
        createTime
        valueDate
        performingOrganization
        collectingOrganization
        chargeType
        itemCode
        chargeItemSubject
        periodType
        period
        amount
        category
        subCategory
        actionCategory
        reference
        referenceToLevy
        accountReference
      }
    }
  }
`

const FinanceTransactions = () => {
  useNamespaces('sp.finance-transactions')
  const { formatMessage } = useLocale()

  const [fromDate, setFromDate] = useState<string>()
  const [toDate, setToDate] = useState<string>()
  const [dropdownSelect, setDropdownSelect] = useState<string[] | undefined>([])

  const { data: customerChartypeData } = useQuery<Query>(
    GetCustomerChargeTypeQuery,
  )
  const chargeTypeData: CustomerChargeType =
    customerChartypeData?.getCustomerChargeType || {}

  const [loadCustomerRecords, { data, loading, called }] = useLazyQuery(
    GetCustomerRecordsQuery,
  )

  useEffect(() => {
    if (toDate && fromDate && dropdownSelect) {
      loadCustomerRecords({
        variables: {
          input: {
            chargeTypeID: dropdownSelect,
            dayFrom: fromDate,
            dayTo: toDate,
          },
        },
      })
    }
  }, [toDate, fromDate, dropdownSelect])

  function onDropdownSelect(selection: any) {
    const allChargeTypeValues = chargeTypeData?.chargeType?.map((ct) => ct.id)
    const selectedID =
      selection.value === ALL_CHARGE_TYPES
        ? allChargeTypeValues
        : [selection.value]
    setDropdownSelect(selectedID)
  }

  const recordsData: CustomerRecords = data?.getCustomerRecords || {}
  const recordsDataArray = recordsData?.records || []

  const allChargeTypes = { label: 'Allar færslur', value: ALL_CHARGE_TYPES }
  const chargeTypeSelect = (chargeTypeData?.chargeType || []).map((item) => ({
    label: item.name,
    value: item.id,
  }))

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:finance-transactions-title',
            defaultMessage: 'Hreyfingar',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'service.portal:finance-transactions-intro',
                defaultMessage:
                  'Hafið samband við viðeigandi umsjónarmann til að fá frekari upplýsingar um stöðu og innheimtu.',
              })}
            </Text>
          </Column>
        </Columns>
        <Box marginTop={[1, 1, 2, 2, 5]}>
          <GridRow>
            <GridColumn paddingBottom={[1, 0]} span={['1/1', '4/12']}>
              <Select
                name="faerslur"
                backgroundColor="blue"
                placeholder="Færslur"
                label="Veldu tegund færslu"
                size="sm"
                options={[allChargeTypes, ...chargeTypeSelect]}
                onChange={(sel) => onDropdownSelect(sel)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '4/12']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={(d) => {
                  const date = format(d, 'yyyy-MM-dd')
                  setFromDate(date)
                }}
                icon="calendar"
                iconType="outline"
                size="sm"
                label="Dagsetning frá"
                locale="is"
                placeholderText="Veldu dagsetningu"
              />
            </GridColumn>
            <GridColumn span={['1/1', '4/12']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={(d) => {
                  const date = format(d, 'yyyy-MM-dd')
                  setToDate(date)
                }}
                icon="calendar"
                iconType="outline"
                size="sm"
                label="Dagsetning til"
                locale="is"
                placeholderText="Veldu dagsetningu"
              />
            </GridColumn>
          </GridRow>
        </Box>
        <Box marginTop={2}>
          {!called && !loading && (
            <AlertBanner
              description="Veldu öll leitarskilyrði til að fá niðurstöður"
              variant="info"
            />
          )}
          {loading && <LoadingDots large color="gradient" />}
          {recordsDataArray.length === 0 && called && !loading && (
            <AlertBanner
              description="Leit skilaði engum niðurstöðum. Vinsamlegast leitaðu aftur."
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
