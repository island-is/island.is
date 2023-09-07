import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import {
  useGetDentistStatusQuery,
  useGetPaginatedDentistsQuery,
} from './DentistOverview.generated'
import { CardLoader } from '@island.is/service-portal/core'
import { IntroHeader } from '@island.is/portals/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { messages } from '../../lib/messages'

export const DentistRegistration = () => {
  useNamespaces('sp.health')
  const { data, loading, error } = useGetDentistStatusQuery()
  const {
    data: dentistsData,
    loading: dentistsLoading,
    error: denstitsError,
  } = useGetPaginatedDentistsQuery()

  const { formatMessage } = useLocale()

  const canRegister = data?.rightsPortalDentistStatus?.canRegister ?? false

  console.log(dentistsData?.rightsPortalPaginatedDentists)

  if (!canRegister && !loading && !error)
    return (
      <AlertMessage
        type="error"
        title={formatMessage(messages.dentistRegisterForbiddenTitle)}
        message={formatMessage(messages.dentistRegisterForbiddenInfo)}
      />
    )

  if (loading)
    return (
      <Box paddingY={2}>
        <Stack space={4}>
          <CardLoader />
          <SkeletonLoader
            borderRadius="large"
            space={2}
            height={40}
            repeat={3}
          />
        </Stack>
      </Box>
    )

  return (
    <Box paddingY={2}>
      <IntroHeader
        title={formatMessage(messages.dentistRegisterationPageTitle)}
        intro={formatMessage(messages.healthCenterRegistrationInfo)}
      />
    </Box>
  )
}

export default DentistRegistration
