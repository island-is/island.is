import { HealthDirectorateWaitlist } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { useGetWaitlistDetailQuery } from './Waitlists.generated'

type UseParams = {
  id: string
}

const WaitlistsDetail: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetWaitlistDetailQuery({
    variables: { input: { id }, locale: lang },
  })

  const waitlist: HealthDirectorateWaitlist | undefined | null =
    data?.healthDirectorateWaitlist.data

  return (
    <IntroWrapper
      title={formatMessage(messages.waitlists)}
      intro={formatMessage(messages.waitlistsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirWaitlistTooltip,
      )}
      marginBottom={6}
    >
      {!loading && !error && waitlist === null && (
        <Problem
          type="not_found"
          title={formatMessage(messages.waitlistNotFound)}
          message={formatMessage(messages.waitlistNotFoundDetail)}
          imgSrc="./assets/images/nodata.svg"
          noBorder={false}
        />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && waitlist != null && (
        <InfoLineStack space={1}>
          <InfoLine
            loading={loading}
            label={messages.waitlist}
            content={waitlist?.name ?? formatMessage(messages.noDataRegistered)}
          />
          <InfoLine
            loading={loading}
            label={messages.organization}
            content={
              waitlist?.organization ?? formatMessage(messages.noDataRegistered)
            }
          />
          <InfoLine
            loading={loading}
            label={messages.registeredToList}
            content={
              formatDate(waitlist?.waitBegan) ??
              formatMessage(messages.noDataRegistered)
            }
          />
          <InfoLine
            loading={loading}
            label={messages.status}
            content={
              waitlist?.status ?? formatMessage(messages.noDataRegistered)
            }
          />
          <InfoLine
            loading={loading}
            label={messages.statusLastUpdated}
            content={
              formatDate(waitlist?.lastUpdated) ??
              formatMessage(messages.noDataRegistered)
            }
          />
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default WaitlistsDetail
