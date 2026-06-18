import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import { SortableTable } from '@island.is/web/components'
import { GET_CUSTOMS_GENERAL_ASSESSMENT_LOCATIONS } from '@island.is/web/screens/queries/CustomsGeneral'

import { m } from './translation.strings'

const CustomsGeneralAssessmentLocations = () => {
  const { formatMessage } = useIntl()

  const columns = [
    {
      key: 'location' as const,
      label: formatMessage(m.assessmentLocationLocation),
    },
    {
      key: 'locationName' as const,
      label: formatMessage(m.assessmentLocationLocationName),
    },
  ]

  const { data, loading, error } = useQuery(
    GET_CUSTOMS_GENERAL_ASSESSMENT_LOCATIONS,
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

  const items = (data?.customsGeneralAssessmentLocations ?? []).map(
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

export default CustomsGeneralAssessmentLocations
