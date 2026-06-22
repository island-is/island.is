import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { GET_CUSTOMS_GENERAL_STORAGE_LOCATIONS } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

type Item = {
  nationalId: string
  code: string
  companyName: string
  location: string
}

const CustomsGeneralStorageLocations = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const columns = [
    {
      key: 'nationalId' as const,
      label: formatMessage(m.storageLocationNationalId),
    },
    { key: 'code' as const, label: formatMessage(m.storageLocationCode) },
    {
      key: 'companyName' as const,
      label: formatMessage(m.storageLocationCompanyName),
    },
    {
      key: 'location' as const,
      label: formatMessage(m.storageLocationLocation),
    },
  ]

  const { data, loading, error } = useQuery(
    GET_CUSTOMS_GENERAL_STORAGE_LOCATIONS,
    {
      variables: { input: { date: toApiDate(selectedDate) } },
    },
  )

  const items: Item[] = (data?.customsGeneralStorageLocations ?? []).map(
    (item: {
      nationalId?: string
      code?: string
      companyName?: string
      location?: string
    }) => ({
      nationalId: item.nationalId ?? '',
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

export default CustomsGeneralStorageLocations
