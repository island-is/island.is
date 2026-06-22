import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_TARIFFS } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralTariffs = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'name' as const, label: formatMessage(m.columnName) },
    { key: 'description' as const, label: formatMessage(m.columnDescription) },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_TARIFFS, {
    variables: { input: { date: toApiDate(selectedDate), system: 'U' } },
  })

  const items = (data?.customsGeneralTariffs ?? []).map(
    (item: { name?: string; description?: string }) => ({
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

export default CustomsGeneralTariffs
