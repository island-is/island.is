import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_COUNTRY_CURRENCIES } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import {
  mapValidityFields,
  ValidityFields,
  ValidityFieldsInput,
} from './customsGeneralUtils'
import { m } from './translation.strings'

type Item = ValidityFields & {
  countryCode: string
  countryName: string
  currencyCode: string
  currencyName: string
}

const CustomsGeneralCountryCurrencies = () => {
  const { formatMessage } = useIntl()
  const [selectedDate] = useState<Date>(new Date())

  const columns = [
    {
      key: 'countryCode' as const,
      label: formatMessage(m.countryCurrencyCountryCode),
    },
    {
      key: 'countryName' as const,
      label: formatMessage(m.countryCurrencyCountryName),
    },
    {
      key: 'currencyCode' as const,
      label: formatMessage(m.countryCurrencyCurrencyCode),
    },
    {
      key: 'currencyName' as const,
      label: formatMessage(m.countryCurrencyCurrencyName),
    },
  ]

  const { data, loading, error } = useQuery(
    GET_CUSTOMS_GENERAL_COUNTRY_CURRENCIES,
    {
      variables: { input: { date: toApiDate(selectedDate) } },
    },
  )

  const items: Item[] = (data?.customsGeneralCountryCurrencies ?? []).map(
    (
      item: {
        countryCode?: string
        countryName?: string
        currencyCode?: string
        currencyName?: string
      } & ValidityFieldsInput,
    ) => ({
      countryCode: item.countryCode ?? '',
      countryName: item.countryName ?? '',
      currencyCode: item.currencyCode ?? '',
      currencyName: item.currencyName ?? '',
      ...mapValidityFields(item),
    }),
  )

  return (
    <CustomsGeneralDateTable
      columns={columns}
      data={items}
      loading={loading}
      error={error}
      dateLabel={formatMessage(m.dateLabel)}
      errorTitle={formatMessage(m.errorTitle)}
    />
  )
}

export default CustomsGeneralCountryCurrencies
