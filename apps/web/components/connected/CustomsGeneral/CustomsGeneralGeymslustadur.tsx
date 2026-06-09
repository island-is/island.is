import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_GEYMSLUSTADUR } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

type Item = {
  kennitala: string
  code: string
  companyName: string
  location: string
}

const CustomsGeneralGeymslustadur = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'kennitala' as const, label: formatMessage(m.geymslustadurKennitala) },
    { key: 'code' as const, label: formatMessage(m.geymslustadurCode) },
    { key: 'companyName' as const, label: formatMessage(m.geymslustadurCompanyName) },
    { key: 'location' as const, label: formatMessage(m.geymslustadurLocation) },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_GEYMSLUSTADUR, {
    variables: { input: { dags: toApiDate(selectedDate) } },
  })

  const items: Item[] = (data?.customsGeneralGeymslustadur ?? []).map(
    (item: { kennitala?: string; code?: string; companyName?: string; location?: string }) => ({
      kennitala: item.kennitala ?? '',
      code: item.code ?? '',
      companyName: item.companyName ?? '',
      location: item.location ?? '',
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

export default CustomsGeneralGeymslustadur
