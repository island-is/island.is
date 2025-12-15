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
import { useGetReferralsDetailQuery } from './Referrals.generated'

type UseParams = {
  id: string
}

const ReferralsDetail: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetReferralsDetailQuery({
    variables: { input: { id }, locale: lang },
  })

  const referral = data?.healthDirectorateReferral.data

  return (
    <IntroWrapper
      title={referral?.serviceName || formatMessage(messages.referrals)}
      intro={formatMessage(messages.referralsDetailIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirReferralTooltip,
      )}
      loading={loading}
      marginBottom={6}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && (
        <InfoLineStack space={1} label={formatMessage(messages.information)}>
          <InfoLine
            label={formatMessage(messages.referralFrom)}
            content={
              [
                referral?.fromContactInfo?.name,
                referral?.fromContactInfo?.profession,
              ]
                .filter(Boolean)
                .join(', ') || formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />

          <InfoLine
            label={formatMessage(messages.publicationPlace)}
            content={[
              referral?.fromContactInfo?.department,
              referral?.fromContactInfo?.institute,
            ]
              .filter(Boolean)
              .join(', ')}
            loading={loading}
          />
          <InfoLine
            label={messages.publicationDate}
            content={
              formatDate(referral?.createdDate) ||
              formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={messages.vaccinatedStatus}
            content={
              referral?.stateDisplay || formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={messages.medicineValidTo}
            content={
              formatDate(referral?.validUntilDate) ||
              formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={messages.referralTo}
            content={
              [
                referral?.toContactInfo?.name,
                referral?.toContactInfo?.profession,
              ]
                .filter(Boolean)
                .join(', ') || formatMessage(messages.openReferral)
            }
            loading={loading}
          />
          <InfoLine
            label={messages.reason}
            content={
              referral?.reason || formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          {referral?.diagnoses && (
            <InfoLine
              label={messages.diagnoses}
              content={referral?.diagnoses}
              loading={loading}
            />
          )}
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default ReferralsDetail
