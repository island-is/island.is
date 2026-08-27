import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_DELIVERY_TERMS } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralDeliveryTerms = () => {
  const { formatMessage } = useIntl()
  const [selectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'code' as const, label: formatMessage(m.columnCode) },
    { key: 'name' as const, label: formatMessage(m.columnName) },
  ]

  const { data, loading, error } = useQuery(
    GET_CUSTOMS_GENERAL_DELIVERY_TERMS,
    {
      variables: { input: { date: toApiDate(selectedDate), system: 'I' } },
    },
  )

  const items = (data?.customsGeneralDeliveryTerms ?? []).map(
    (item: { code?: string; name?: string }) => ({
      code: item.code ?? '',
      name: item.name ?? '',
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

export default CustomsGeneralDeliveryTerms
