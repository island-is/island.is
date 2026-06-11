import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_ADVISORIES } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralAdvisories = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'code' as const, label: formatMessage(m.columnCode) },
    { key: 'description' as const, label: formatMessage(m.columnDescription) },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_ADVISORIES, {
    variables: { input: { date: toApiDate(selectedDate), system: 'I' } },
  })

  const items = (data?.customsGeneralAdvisories ?? []).map(
    (item: { code?: string; description?: string }) => ({
      code: item.code ?? '',
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

export default CustomsGeneralAdvisories
