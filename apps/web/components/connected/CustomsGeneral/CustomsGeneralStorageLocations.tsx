import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { AlertMessage, Box, LoadingDots } from '@island.is/island-ui/core'
import { GET_CUSTOMS_GENERAL_STORAGE_LOCATIONS } from '@island.is/web/screens/queries/CustomsGeneral'

import { SortableTable } from '../../SortableTable/SortableTable'
import { toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'

type Item = {
  nationalId: string
  code: string
  companyName: string
  location: string
}

const CustomsGeneralStorageLocations = () => {
  const { formatMessage } = useIntl()
  const [selectedDate] = useState<Date>(new Date())

  const columns = [
    { key: 'code' as const, label: formatMessage(m.storageLocationCode) },
    {
      key: 'companyName' as const,
      label: formatMessage(m.storageLocationCompanyName),
    },
    {
      key: 'nationalId' as const,
      label: formatMessage(m.storageLocationNationalId),
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <LoadingDots />
      </Box>
    )
  }

  if (error) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(m.errorTitle)}
        message={formatMessage(m.errorMessage)}
      />
    )
  }

  return <SortableTable columns={columns} data={items} />
}

export default CustomsGeneralStorageLocations
