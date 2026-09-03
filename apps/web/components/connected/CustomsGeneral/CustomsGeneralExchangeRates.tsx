import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { SortableTableColumn } from '@island.is/web/components'
import {
  CustomsGeneralExchangeRatesQuery,
  CustomsGeneralExchangeRatesQueryVariables,
} from '@island.is/web/graphql/schema'
import { GET_CUSTOMS_GENERAL_EXCHANGE_RATES } from '@island.is/web/screens/queries/CustomsGeneral'

import { CurrencyFlag } from './CurrencyFlag'
import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { mapValidityFields, ValidityFields } from './customsGeneralUtils'
import { m } from './translation.strings'

interface ExchangeRateRow extends ValidityFields {
  flag: string
  code: string
  name: string
  rate: string
}

const CustomsGeneralExchangeRates = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns: SortableTableColumn<ExchangeRateRow>[] = [
    {
      key: 'flag',
      label: '',
      sortable: false,
      render: (_value, row) => <CurrencyFlag currencyCode={row.code} />,
    },
    { key: 'code', label: formatMessage(m.columnCode) },
    { key: 'name', label: formatMessage(m.columnName) },
    { key: 'rate', label: formatMessage(m.exchangeRateRate) },
  ]

  const { data, loading, error } = useQuery<
    CustomsGeneralExchangeRatesQuery,
    CustomsGeneralExchangeRatesQueryVariables
  >(GET_CUSTOMS_GENERAL_EXCHANGE_RATES, {
    variables: { input: { date: toApiDate(selectedDate), system: 'I' } },
  })

  const items: ExchangeRateRow[] = (
    data?.customsGeneralExchangeRates ?? []
  ).map((item) => ({
    flag: '',
    code: item.code ?? '',
    name: item.name ?? '',
    rate: item.rate ?? '',
    ...mapValidityFields(item),
  }))

  return (
    <CustomsGeneralDateTable
      columns={columns}
      data={items}
      loading={loading}
      error={error}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      dateLabel={formatMessage(m.dateLabel)}
      errorTitle={formatMessage(m.errorTitle)}
    />
  )
}

export default CustomsGeneralExchangeRates
