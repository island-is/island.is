import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { Stack } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'
const References: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={formatMessage(messages.references)}
      intro={formatMessage(messages.referencesIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirVaccinationsTooltip,
      )}
    >
      <Stack space={2}>
        <ActionCard
          heading="Sjúkraþjálfun"
          text="Gildir til: 03.04.2025"
          tag={{ label: 'Virk tilvísun', outlined: false, variant: 'blue' }}
          cta={{
            url: HealthPaths.HealthReferencesDetail.replace(
              ':type',
              'sjukratjalfun',
            ),
            label: formatMessage(messages.seeMore),
            centered: true,
            variant: 'text',
          }}
        />
        <ActionCard
          heading="Heimilislækningar"
          text="Gildir til: 12.08.2025"
          tag={{ label: 'Virk tilvísun', outlined: false, variant: 'blue' }}
          cta={{
            url: HealthPaths.HealthReferencesDetail.replace(
              ':type',
              'heimilislaekningar',
            ),
            label: formatMessage(messages.seeMore),
            centered: true,
            variant: 'text',
          }}
        />
      </Stack>
    </IntroWrapper>
  )
}

export default References
