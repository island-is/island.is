import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_CHARGES } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralCharges = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'code' as const, label: formatMessage(m.columnCode) },
    { key: 'name' as const, label: formatMessage(m.columnName) },
    { key: 'description' as const, label: formatMessage(m.columnDescription) },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_CHARGES, {
    variables: { input: { date: toApiDate(selectedDate), system: 'I' } },
  })

  const items = (data?.customsGeneralCharges ?? []).map(
    (item: { code?: string; name?: string; description?: string }) => ({
      code: item.code ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
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

export default CustomsGeneralCharges
