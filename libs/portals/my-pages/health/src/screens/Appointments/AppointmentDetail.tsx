import {
  HealthDirectorateAppointmentModality,
  HealthDirectorateAppointmentStatus,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  Icon,
  Stack,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  getTime,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'

import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'

import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import {
  useCancelAppointmentMutation,
  useGetAppointmentDetailQuery,
} from './AppointmentDetail.generated'
import { AppointmentDetailCardInfo } from './AppointmentDetailCardInfo'
import { AppointmentDetailInfoLines } from './AppointmentDetailInfoLines'
import { AppointmentVideoCallAlert } from './AppointmentVideoCallAlert'
import CancelAppointmentModal from './components/CancelAppointmentModal'

const AppointmentDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [cancelModalVisible, setCancelModalVisible] = useState(false)

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
  // Only booked (upcoming) appointments get actions
  const isBooked =
    appointment?.status === HealthDirectorateAppointmentStatus.BOOKED

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

          {isBooked && (
            <Box
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              columnGap={2}
              rowGap={2}
            >
              {appointment.canCancel && (
                <Button
                  size="small"
                  variant="utility"
                  icon="calendarCancel"
                  iconType="outline"
                  onClick={() => setCancelModalVisible(true)}
                >
                  {formatMessage(messages.cancelAppointment)}
                </Button>
              )}
              {appointment.canCancel && appointment.canCancelBefore && (
                <Text variant="medium">
                  {formatMessage(messages.cancelDeadlineText, {
                    date: formatDate(appointment.canCancelBefore),
                    time: getTime(appointment.canCancelBefore),
                  })}
                </Text>
              )}
              {!appointment.canCancel && (
                <Box display="flex" alignItems="center" columnGap={1}>
                  <Icon
                    icon="informationCircle"
                    size="small"
                    color="blue400"
                    type="outline"
                  />
                  <Text variant="medium">
                    {formatMessage(messages.cancelNotPossibleOnline)}
                  </Text>
                </Box>
              )}
            </Box>
          )}

          <AppointmentDetailInfoLines appointment={appointment} />
        </Stack>
      )}

      {appointment && (
        <CancelAppointmentModal
          appointment={appointment}
          visible={cancelModalVisible}
          loading={cancelLoading}
          onClose={() => setCancelModalVisible(false)}
          onSubmit={onConfirmCancel}
        />
      )}
    </IntroWrapper>
  )
}

export default AppointmentDetail
