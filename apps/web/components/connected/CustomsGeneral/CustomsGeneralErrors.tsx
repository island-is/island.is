import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_ERRORS } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralErrors = () => {
  const { formatMessage } = useIntl()
  const [selectedDate] = useState<Date>(new Date())

  const [system, setSystem] = useState<'I' | 'U'>('I')
  const columns = [
    { key: 'code' as const, label: formatMessage(m.columnCode) },
    { key: 'name' as const, label: formatMessage(m.columnName) },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_ERRORS, {
    variables: { input: { date: toApiDate(selectedDate), system } },
  })

  const items = (data?.customsGeneralErrors ?? []).map(
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
      system={system}
      onSystemChange={setSystem}
    />
  )
}

export default CustomsGeneralErrors
