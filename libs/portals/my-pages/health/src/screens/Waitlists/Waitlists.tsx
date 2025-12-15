import { Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetWaitlistsQuery } from './Waitlists.generated'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'

const Waitlists: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useGetWaitlistsQuery({
    variables: { locale: lang },
  })

  const waitlists = data?.healthDirectorateWaitlists.waitlists

  return (
    <IntroWrapper
      title={formatMessage(messages.waitlists)}
      intro={formatMessage(messages.waitlistsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirWaitlistTooltip,
      )}
    >
      {!loading && !error && waitlists?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(messages.noWaitlists)}
          imgSrc="./assets/images/nodata.svg"
        />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!error && loading && <CardLoader />}
      <Stack space={2}>
        {waitlists?.map((waitlist, index) => (
          <ActionCard
            key={`waitlist-${index}`}
            heading={waitlist?.name ?? ''}
            text={[
              formatMessage(messages.statusLastUpdated),
              formatDate(waitlist.lastUpdated),
            ]
              .filter((item) => isDefined(item))
              .join(' ')}
            eyebrow={waitlist?.organization}
            tag={{
              label: waitlist.status,
              outlined: false,
              variant: 'blue',
            }}
            cta={{
              url: HealthPaths.HealthWaitlistsDetail.replace(
                ':id',
                waitlist.id,
              ),
              label: formatMessage(messages.seeMore),
              centered: true,
              variant: 'text',
            }}
          />
        ))}
      </Stack>
    </IntroWrapper>
  )
}

export default Waitlists
