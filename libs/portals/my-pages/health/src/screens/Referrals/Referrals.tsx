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
import { Stack } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'
import { useGetReferralsQuery } from './Referrals.generated'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'

const Referrals: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = useGetReferralsQuery({
    variables: {
      locale: lang,
    },
  })

  const referrals = data?.healthDirectorateReferrals.referrals

  return (
    <IntroWrapper
      title={formatMessage(messages.referrals)}
      intro={formatMessage(messages.referralsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirReferralTooltip,
      )}
    >
      {!loading && !error && referrals?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(messages.noReferrals)}
          imgSrc="./assets/images/nodata.svg"
        />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && loading && <CardLoader />}

      <Stack space={2}>
        {referrals?.map((referral, index) => (
          <ActionCard
            key={`referral-${index}`}
            heading={referral?.serviceName ?? ''}
            text={[
              formatMessage(messages.medicineValidTo),
              formatDate(referral.validUntilDate),
            ]
              .filter((item) => isDefined(item))
              .join(' ')}
            tag={{
              label: referral?.stateDisplay ?? '',
              outlined: false,
              variant: 'blue',
            }}
            cta={{
              url: HealthPaths.HealthReferralsDetail.replace(
                ':id',
                referral?.id ?? '',
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

export default Referrals
