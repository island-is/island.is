import { HealthDirectorateAppointmentModality } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader, IntroWrapper } from '@island.is/portals/my-pages/core'

import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'

import { useGetAppointmentDetailQuery } from './AppointmentDetail.generated'
import { AppointmentDetailCardInfo } from './AppointmentDetailCardInfo'
import { AppointmentDetailInfoLines } from './AppointmentDetailInfoLines'
import { AppointmentVideoCallAlert } from './AppointmentVideoCallAlert'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const AppointmentDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetAppointmentDetailQuery({
    variables: { id: id ?? '' },
    skip: !id,
  })

  const appointment = data?.healthDirectorateAppointment

  return (
    <IntroWrapper
      title={messages.appointmentDetail}
      intro={messages.appointmentsDetailIntro}
      desktopContentSpan="10/12"
      loading={loading}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && !appointment && <CardLoader />}
      {!loading && !error && !appointment && (
        <Problem
          type="no_data"
          title={formatMessage(messages.appointmentNotFound)}
          message={formatMessage(messages.appointmentNotFoundDetail)}
          imgSrc="./assets/images/nodata.svg"
          noBorder={false}
        />
      )}
      {!error && appointment && (
        <Stack space={5}>
          <Box border="standard" borderRadius="large" padding={[2, 2, 3]}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              <Stack space={3}>
                <Text variant="h4" as="h4" color="blue400">
                  {appointment.title}
                </Text>
                <AppointmentDetailCardInfo appointment={appointment} />
              </Stack>
              <Box
                display={['none', 'none', 'block']}
                flexShrink={0}
                marginLeft={3}
                marginRight={6}
              >
                <img src="./assets/images/appointment.svg" alt="" />
              </Box>
            </Box>

            {appointment.modality ===
              HealthDirectorateAppointmentModality.VIDEO && (
              <AppointmentVideoCallAlert links={appointment.links} />
            )}
          </Box>

          <AppointmentDetailInfoLines appointment={appointment} />
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default AppointmentDetail
