import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_LAND_MYNT } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralLandMynt = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'countryCode' as const, label: formatMessage(m.landMyntCountryCode) },
    { key: 'countryName' as const, label: formatMessage(m.landMyntCountryName) },
    {
      key: 'currencyCode' as const,
      label: formatMessage(m.landMyntCurrencyCode),
    },
    {
      key: 'currencyName' as const,
      label: formatMessage(m.landMyntCurrencyName),
    },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_LAND_MYNT, {
    variables: { input: { dags: toApiDate(selectedDate) } },
  })

  const items = (data?.customsGeneralLandMynt ?? []).map(
    (item: {
      countryCode?: string
      countryName?: string
      currencyCode?: string
      currencyName?: string
    }) => ({
      countryCode: item.countryCode ?? '',
      countryName: item.countryName ?? '',
      currencyCode: item.currencyCode ?? '',
      currencyName: item.currencyName ?? '',
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

export default CustomsGeneralLandMynt
