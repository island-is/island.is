import { HealthDirectorateAppointmentStatus } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsQuery } from './Appointments.generated'

const AppointmentsOverview = () => {
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetAppointmentsQuery({
    variables: {
      from: undefined,
      status: [
        HealthDirectorateAppointmentStatus.BOOKED,
        HealthDirectorateAppointmentStatus.PENDING,
        HealthDirectorateAppointmentStatus.WAITLIST,
      ],
    },
  })

  const appointments = data?.healthDirectorateAppointments

  return (
    <IntroWrapper
      title={formatMessage(messages.appointments)}
      intro={formatMessage(messages.appointmentsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
      loading={loading}
    >
      {!loading && error && (
        <Problem type="internal_service_error" noBorder={false} />
      )}

      <Appointments
        data={{ data: appointments, loading, error: error ? true : false }}
        showLinkButton={false}
      />
    </IntroWrapper>
  )
}

export default AppointmentsOverview
