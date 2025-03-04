import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
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

  const { data } = useGetReferralsDetailQuery({
    variables: { locale: lang },
  })

  const referral = data?.healthDirectorateReferrals.referrals.find(
    (item) => item.id === id,
  )

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
      <InfoLineStack space={1}>
        <InfoLine
          label={formatMessage(messages.referralFor)}
          content={referral?.reason ?? ''}
        />
        <InfoLine
          label={formatMessage(messages.referralFrom)}
          content={referral?.fromContactInfo?.name ?? ''}
        />
        <InfoLine
          label={formatMessage(messages.medicineValidTo)}
          content={formatDate(referral?.validUntilDate)}
        />
        <InfoLine
          label={formatMessage(messages.vaccinatedStatus)}
          content={referral?.stateDisplay ?? ''}
        />
        <InfoLine
          label={formatMessage(messages.recepient)}
          content={referral?.toContactInfo.name ?? ''}
        />
      </InfoLineStack>
    </IntroWrapper>
  )
}

export default ReferencesDetail
