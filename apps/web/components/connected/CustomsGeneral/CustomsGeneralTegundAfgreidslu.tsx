import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_TEGUND_AFGREIDSLU } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

const CustomsGeneralTegundAfgreidslu = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [kerfi, setKerfi] = useState<'I' | 'U'>('I')
  const columns = [
    { key: 'code' as const, label: formatMessage(m.columnCode) },
    { key: 'description' as const, label: formatMessage(m.columnDescription) },
  ]

  const { data, loading, error } = useQuery(
    GET_CUSTOMS_GENERAL_TEGUND_AFGREIDSLU,
    {
      variables: { input: { dags: toApiDate(selectedDate), kerfi } },
    },
  )

  const items = (data?.customsGeneralTegundAfgreidslu ?? []).map(
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
      kerfi={kerfi}
      onKerfiChange={setKerfi}
    />
  )
}

export default CustomsGeneralTegundAfgreidslu
