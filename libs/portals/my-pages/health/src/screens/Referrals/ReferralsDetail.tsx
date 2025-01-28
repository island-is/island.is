import { useLocale, useNamespaces } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { useGetReferralsDetailQuery } from './Referrals.generated'
import { useParams } from 'react-router-dom'

type UseParams = {
  id: string
}

const ReferencesDetail: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams

  const {data, loading, error } = useGetReferralsDetailQuery({variables: {locale: lang}})

  const referral = data?.healthDirectorateReferrals.referrals.find(item => item.id === id)

  
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
        <InfoLine label="Tilvísun fyrir" content="Sjúkraþjálfun" />
        <InfoLine
          label="Útgefandi"
          content="Helena melax, læknir"
          button={{
            type: 'link',
            label: formatMessage(messages.organizationWebsite),
            to: '/',
            icon: 'open',
          }}
        />
        <InfoLine label="Gildir til" content="01.03.2024" />
        <InfoLine label="Staða" content="Virk tilvísun" />
        <InfoLine label="Viðtakandi" content="Opin tilvísun" />
      </InfoLineStack>
    </IntroWrapper>
  )
}

export default ReferencesDetail
