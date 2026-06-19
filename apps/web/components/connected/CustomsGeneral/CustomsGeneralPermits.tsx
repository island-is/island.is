import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_PERMITS } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralPermits = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [system, setSystem] = useState<'I' | 'U'>('I')

  const columns = [
    { key: 'code' as const, label: formatMessage(m.columnCode) },
    { key: 'name' as const, label: formatMessage(m.columnName) },
    { key: 'description' as const, label: formatMessage(m.columnDescription) },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_PERMITS, {
    variables: { input: { date: toApiDate(selectedDate), system } },
  })

  const items = (data?.customsGeneralPermits ?? []).map(
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
      system={system}
      onSystemChange={setSystem}
    />
  )
}

export default CustomsGeneralPermits
