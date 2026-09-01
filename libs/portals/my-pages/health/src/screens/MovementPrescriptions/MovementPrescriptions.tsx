import {
  Box,
  Text,
  problemTemplateContainer,
  problemTemplateImg,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapper, LinkButton } from '@island.is/portals/my-pages/core'
import { useWindowSize } from 'react-use'
import { messages } from '../../lib/messages'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const MovementPrescriptions = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isStacked = width == null || width < theme.breakpoints.lg

  return (
    <IntroWrapper
      title={formatMessage(messages.movementPrescriptionsTitle)}
      intro={formatMessage(messages.movementPrescriptionsIntro)}
      marginBottom={6}
      buttonGroup={{
        actions: [
          <LinkButton
            key="movement-prescriptions-read-more"
            to={formatMessage(messages.movementPrescriptionsLink)}
            text={formatMessage(messages.readAboutMovementPrescriptions)}
            variant="utility"
            icon="open"
          />,
        ],
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection={[
          'columnReverse',
          'columnReverse',
          'columnReverse',
          'row',
        ]}
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
          <Text
            variant="h3"
            as="h2"
            color="dark400"
            textAlign={isStacked ? 'center' : 'left'}
          >
            {formatMessage(
              messages.movementPrescriptionsStillOnHeilsuveruTitle,
            )}
          </Text>
          <Text whiteSpace="preLine" textAlign={isStacked ? 'center' : 'left'}>
            {formatMessage(messages.movementPrescriptionsStillOnHeilsuveruText)}
          </Text>
          <Box marginTop={2}>
            <LinkButton
              to={formatMessage(messages.movementPrescriptionsHeilsuveruLink)}
              text={formatMessage(
                messages.viewMovementPrescriptionsOnHeilsuveru,
              )}
              variant="primary"
              size="small"
              icon="open"
            />
          </Box>
        </Box>
        <img
          src="./assets/images/autumn2.svg"
          alt=""
          className={problemTemplateImg}
        />
      </Box>
    </IntroWrapper>
  )
}

export default MovementPrescriptions
