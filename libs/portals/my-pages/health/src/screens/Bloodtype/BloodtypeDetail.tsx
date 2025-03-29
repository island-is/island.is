import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LANDLAEKNIR_SLUG,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'

type UseParams = {
  id: string
}

const ReferencesDetail: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams
  const data = {}
  const error = false
  const loading = false

  //   const { data, loading, error } = useGetReferralsDetailQuery({
  //     variables: { locale: lang },
  //   })

  //   const referral = data?.healthDirectorateReferrals.referrals.find(
  //     (item) => item.id === id,
  //   )

  return (
    <IntroWrapper
      title={formatMessage(messages.bloodtype)}
      intro={formatMessage(messages.bloodtypeDesc)}
      serviceProviderSlug={LANDLAEKNIR_SLUG}
      // TODO: Add tooltip
      marginBottom={6}
      buttonGroup={[
        <LinkButton
          to={formatMessage(messages.bloodtypeLink)}
          text={formatMessage(messages.readAboutBloodtype)}
          variant="utility"
          icon="open"
        />,
      ]}
    >
      {error && !loading && (
        <Problem error={{ name: 'ee', message: 'error' }} noBorder={false} />
      )}
      {!error && (
        <InfoLineStack space={1}>
          <InfoLine
            label={formatMessage(messages.bloodtype)}
            content={'A+'}
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.registered)}
            content={'12.12.2021'}
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.organization)}
            content={'Landspítalinn'}
            loading={loading}
          />
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default ReferencesDetail
