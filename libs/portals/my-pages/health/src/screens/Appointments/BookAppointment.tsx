import { useLocale, useNamespaces } from '@island.is/localization'
import {
  STAFRAEN_HEILSA_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { RedirectCard } from '../../components/RedirectCard/RedirectCard'
import { messages } from '../../lib/messages'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const BookAppointment = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={messages.bookAppointmentTitle}
      intro={messages.bookAppointmentIntro}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaAppointmentsTooltip),
      }}
    >
      <RedirectCard
        title={formatMessage(messages.bookAppointmentStillOnHeilsuveruTitle)}
        text={formatMessage(messages.bookAppointmentStillOnHeilsuveruText)}
        linkUrl={formatMessage(messages.bookAppointmentHeilsuveruLink)}
        linkText={formatMessage(messages.viewBookAppointmentOnHeilsuveru)}
        imageSrc="./assets/images/book-appointment.svg"
      />
    </IntroWrapper>
  )
}

export default BookAppointment
