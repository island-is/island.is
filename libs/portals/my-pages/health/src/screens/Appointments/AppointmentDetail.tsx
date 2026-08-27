import {
  HealthDirectorateAppointmentModality,
  HealthDirectorateAppointmentStatus,
} from '@island.is/api/schema'
import { Box, Button, Stack, Tag, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader, IntroWrapper } from '@island.is/portals/my-pages/core'

import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'

import {
  useCancelAppointmentMutation,
  useGetAppointmentDetailQuery,
} from './AppointmentDetail.generated'
import { AppointmentDetailCardInfo } from './AppointmentDetailCardInfo'
import { AppointmentDetailInfoLines } from './AppointmentDetailInfoLines'
import { AppointmentVideoCallAlert } from './AppointmentVideoCallAlert'
import CancelAppointmentModal from './components/CancelAppointmentModal'
import CancelAppointmentNotAllowedModal from './components/CancelAppointmentNotAllowedModal'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const AppointmentDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [notAllowedModalVisible, setNotAllowedModalVisible] = useState(false)

  const { data, loading, error } = useGetAppointmentDetailQuery({
    fetchPolicy: 'network-only',
    variables: { id: id ?? '' },
    skip: !id,
  })

  const [cancelAppointment, { loading: cancelLoading }] =
    useCancelAppointmentMutation()

  const appointment = data?.healthDirectorateAppointment
  const isCancelled =
    appointment?.status === HealthDirectorateAppointmentStatus.CANCELLED

  const onCancelButtonClick = () => {
    if (appointment?.canCancel) {
      setCancelModalVisible(true)
    } else {
      setNotAllowedModalVisible(true)
    }
  }

  const onConfirmCancel = () => {
    if (!id) {
      return
    }
    cancelAppointment({ variables: { id } })
      .then((response) => {
        if (response.data?.healthDirectorateCancelAppointment) {
          toast.success(formatMessage(messages.cancelAppointmentSuccess))
          setCancelModalVisible(false)
          navigate(HealthPaths.HealthAppointments, { replace: true })
        } else {
          toast.error(formatMessage(messages.cancelAppointmentError))
        }
      })
      .catch(() => {
        toast.error(formatMessage(messages.cancelAppointmentError))
      })
  }

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
          {!isCancelled && (
            <Box display="flex" columnGap={2}>
              <Button
                size="small"
                variant="utility"
                icon="calendarCancel"
                iconType="outline"
                onClick={onCancelButtonClick}
              >
                {formatMessage(messages.cancelAppointment)}
              </Button>
            </Box>
          )}

          <Box border="standard" borderRadius="large" padding={[2, 2, 3]}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              <Stack space={3}>
                <Box display="flex" alignItems="center" columnGap={2}>
                  <Text variant="h4" as="h4" color="blue400">
                    {appointment.title}
                  </Text>
                  {isCancelled && (
                    <Tag variant="red" outlined disabled>
                      {formatMessage(messages.appointmentCancelledStatus)}
                    </Tag>
                  )}
                </Box>
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

      {appointment && (
        <>
          <CancelAppointmentModal
            appointment={appointment}
            visible={cancelModalVisible}
            loading={cancelLoading}
            onClose={() => setCancelModalVisible(false)}
            onSubmit={onConfirmCancel}
          />

          <CancelAppointmentNotAllowedModal
            visible={notAllowedModalVisible}
            reason={appointment.cancelBlockedReason ?? undefined}
            onClose={() => setNotAllowedModalVisible(false)}
          />
        </>
      )}
    </IntroWrapper>
  )
}

export default AppointmentDetail
