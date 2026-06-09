import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_UPPRUNI } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralUppruni = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'name' as const, label: formatMessage(m.columnName) },
    { key: 'description' as const, label: formatMessage(m.columnDescription) },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_UPPRUNI, {
    variables: { input: { dags: toApiDate(selectedDate) } },
  })

  const items = (data?.customsGeneralUppruni ?? []).map(
    (item: { name?: string; description?: string }) => ({
      name: item.name ?? '',
      description: item.description ?? '',
    }),
  )

  return (
    <>
      <span>asdf</span>
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
    </>
  )
}

export default CustomsGeneralUppruni
