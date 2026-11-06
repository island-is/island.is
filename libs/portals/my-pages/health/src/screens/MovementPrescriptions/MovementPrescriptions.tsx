import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapper, LinkButton } from '@island.is/portals/my-pages/core'
import { RedirectCard } from '../../components/RedirectCard/RedirectCard'
import { messages } from '../../lib/messages'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const MovementPrescriptions = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()
  const { formatMessage } = useLocale()

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
      <RedirectCard
        title={formatMessage(
          messages.movementPrescriptionsStillOnHeilsuveruTitle,
        )}
        text={formatMessage(
          messages.movementPrescriptionsStillOnHeilsuveruText,
        )}
        linkUrl={formatMessage(messages.movementPrescriptionsHeilsuveruLink)}
        linkText={formatMessage(messages.viewMovementPrescriptionsOnHeilsuveru)}
        imageSrc="./assets/images/autumn2.svg"
      />
    </IntroWrapper>
  )
}

export default MovementPrescriptions
