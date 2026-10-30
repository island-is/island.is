import { useLocale, useNamespaces } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { RedirectCard } from '../../components/RedirectCard/RedirectCard'
import { messages } from '../../lib/messages'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const PregnancyRedirect = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={formatMessage(messages.pregnancy)}
      intro={formatMessage(messages.pregnancyRedirectIntro)}
      marginBottom={6}
      serviceProvider={{
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirPregnancyTooltip),
      }}
    >
      <RedirectCard
        title={formatMessage(messages.pregnancyOnHeilsuveruTitle)}
        text={formatMessage(messages.pregnancyOnHeilsuveruText)}
        linkUrl={formatMessage(messages.pregnancyHeilsuveruLink)}
        linkText={formatMessage(messages.loginToHeilsuvera)}
        imageSrc="./assets/images/baby.svg"
      />
    </IntroWrapper>
  )
}

export default PregnancyRedirect
