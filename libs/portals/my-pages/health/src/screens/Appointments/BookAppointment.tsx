import {
  Box,
  problemTemplateContainer,
  problemTemplateImg,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  LinkButton,
} from '@island.is/portals/my-pages/core'
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
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirAppointmentsTooltip),
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
        columnGap={[2, 4, 8, 8, 12]}
        rowGap={[7, 7, 7, 0]}
        paddingY={[5, 8]}
        paddingX={[3, 3, 5, 10]}
        className={problemTemplateContainer({ blue: true })}
      >
        <Box
          display="flex"
          flexDirection="column"
          rowGap={2}
          alignItems={['center', 'center', 'center', 'flexStart']}
          justifyContent={['center', 'center', 'center', 'flexStart']}
        >
          <Text variant="h3" as="h2" color="dark400">
            {formatMessage(messages.bookAppointmentStillOnHeilsuveruTitle)}
          </Text>
          <Text whiteSpace="preLine">
            {formatMessage(messages.bookAppointmentStillOnHeilsuveruText)}
          </Text>
          <Box marginTop={2}>
            <LinkButton
              to={formatMessage(messages.bookAppointmentHeilsuveruLink)}
              text={formatMessage(messages.viewBookAppointmentOnHeilsuveru)}
              variant="primary"
              size="small"
              icon="open"
            />
          </Box>
        </Box>
        <img
          src="./assets/images/book-appointment.svg"
          alt=""
          className={problemTemplateImg}
        />
      </Box>
    </IntroWrapper>
  )
}

export default BookAppointment
