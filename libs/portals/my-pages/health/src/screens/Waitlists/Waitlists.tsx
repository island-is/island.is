import { Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'

const Waitlists: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={formatMessage(messages.waitlists)}
      intro={formatMessage(messages.waitlistsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirVaccinationsTooltip,
      )}
    >
      <Stack space={2}>
        <ActionCard
          heading="Liðskiptaaðgerð á hné"
          text="Staða síðast uppfærð 23.11.2023"
          eyebrow="Landspítalinn"
          tag={{
            label: 'Samþykktur á lista',
            outlined: false,
            variant: 'blue',
          }}
          cta={{
            url: HealthPaths.HealthWaitlistsDetail.replace(
              ':type',
              'lidskipti',
            ),
            label: formatMessage(messages.seeMore),
            centered: true,
            variant: 'text',
          }}
        />
        <ActionCard
          heading="Hjúkrunarheimili"
          text="Staða síðast uppfærð 03.12.2024"
          eyebrow="Sóltún hjúkrunarheimili"
          tag={{ label: 'Umsókn í vinnslu', outlined: false, variant: 'blue' }}
          cta={{
            url: HealthPaths.HealthWaitlistsDetail.replace(
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

export default Waitlists
