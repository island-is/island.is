import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import { SortableTable } from '@island.is/web/components'
import { GET_CUSTOMS_GENERAL_AKVORDUNARSTADIR } from '@island.is/web/screens/queries/CustomsGeneral'

import { m } from './translation.strings'

interface Props {
  landakodi: string
}

const CustomsGeneralAkvordunarstadir = ({ landakodi }: Props) => {
  const { formatMessage } = useIntl()

  const columns = [
    {
      key: 'location' as const,
      label: formatMessage(m.akvordunarstadirLocation),
    },
    {
      key: 'locationName' as const,
      label: formatMessage(m.akvordunarstadirLocationName),
    },
  ]

  const { data, loading, error } = useQuery(
    GET_CUSTOMS_GENERAL_AKVORDUNARSTADIR,
    {
      variables: { input: { landakodi } },
    },
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
        message={error.message}
      />
    )
  }

  const items = (data?.customsGeneralAkvordunarstadir ?? []).map(
    (item: {
      countryCode?: string
      location?: string
      locationName?: string
    }) => ({
      countryCode: item.countryCode ?? '',
      location: item.location ?? '',
      locationName: item.locationName ?? '',
    }),
  )

  return (
    <Stack space={3}>
      <SortableTable columns={columns} data={items} />
    </Stack>
  )
}

export default CustomsGeneralAkvordunarstadir
