import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_EXCHANGE_RATES } from '@island.is/web/screens/queries/CustomsGeneral'

import { CurrencyFlag } from './CurrencyFlag'
import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralExchangeRates = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    {
      key: 'flag' as const,
      label: '',
      sortable: false,
      render: (_value: string, row: { code: string }) => (
        <CurrencyFlag currencyCode={row.code} />
      ),
    },
    { key: 'code' as const, label: formatMessage(m.columnCode) },
    { key: 'name' as const, label: formatMessage(m.columnName) },
    { key: 'rate' as const, label: formatMessage(m.exchangeRateRate) },
  ]

  const { data, loading, error } = useQuery(
    GET_CUSTOMS_GENERAL_EXCHANGE_RATES,
    {
      variables: { input: { date: toApiDate(selectedDate), system: 'I' } },
    },
  )

  const items = (data?.customsGeneralExchangeRates ?? []).map(
    (item: { code?: string; name?: string; rate?: number }) => ({
      flag: '',
      code: item.code ?? '',
      name: item.name ?? '',
      rate: item.rate?.toString() ?? '',
    }),
  )

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
