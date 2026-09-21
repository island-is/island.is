import { useLocale, useNamespaces } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { RedirectCard } from '../../components/RedirectCard/RedirectCard'
import { messages } from '../../lib/messages'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const OldPregnancies = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={formatMessage(messages.oldPregnanciesTitle)}
      intro={formatMessage(messages.oldPregnanciesIntro)}
      marginBottom={6}
      serviceProvider={{
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirOldPregnanciesTooltip),
      }}
    >
      <RedirectCard
        title={formatMessage(messages.oldPregnanciesOnHeilsuveruTitle)}
        text={formatMessage(messages.oldPregnanciesOnHeilsuveruText)}
        linkUrl={formatMessage(messages.oldPregnanciesHeilsuveruLink)}
        linkText={formatMessage(messages.loginToHeilsuvera)}
        imageSrc="./assets/images/digitalServices.svg"
      />
    </IntroWrapper>
  )
}

export default OldPregnancies
