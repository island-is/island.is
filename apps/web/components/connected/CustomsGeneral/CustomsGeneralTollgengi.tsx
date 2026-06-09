import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_TOLLGENGI } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralTollgengi = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'code' as const, label: formatMessage(m.columnCode) },
    { key: 'name' as const, label: formatMessage(m.columnName) },
    { key: 'rate' as const, label: formatMessage(m.tollgengiRate) },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_TOLLGENGI, {
    variables: { input: { dags: toApiDate(selectedDate), kerfi: 'I' } },
  })

  const items = (data?.customsGeneralTollgengi ?? []).map(
    (item: { code?: string; name?: string; rate?: number }) => ({
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

export default CustomsGeneralTollgengi
