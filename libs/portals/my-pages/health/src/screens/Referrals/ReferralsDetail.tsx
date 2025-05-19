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

const ReferencesDetail: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetReferralsDetailQuery({
    variables: { input: { id }, locale: lang },
  })

  const referral = data?.healthDirectorateReferral.data

  return (
    <IntroWrapper
      title={formatMessage(messages.referrals)}
      intro={formatMessage(messages.referralsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirVaccinationsTooltip,
      )}
      marginBottom={6}
    >
      {error && !loading && (
        <Problem error={{ name: 'ee', message: 'error' }} noBorder={false} />
      )}
      {!error && (
        <InfoLineStack space={1}>
          <InfoLine
            label={formatMessage(messages.referralFor)}
            content={
              referral?.serviceName ?? formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.referralFrom)}
            content={
              referral?.fromContactInfo?.name ??
              formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.medicineValidTo)}
            content={
              formatDate(referral?.validUntilDate) ??
              formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.vaccinatedStatus)}
            content={
              referral?.stateDisplay ?? formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.recepientUpperCase)}
            content={
              referral?.toContactInfo?.name ??
              formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.reason)}
            content={
              referral?.reason ?? formatMessage(messages.noDataRegistered)
            }
            loading={loading}
          />
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default ReferencesDetail
