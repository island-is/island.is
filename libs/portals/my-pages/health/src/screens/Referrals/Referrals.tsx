import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { Stack, ActionCard, TagVariant } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'
import { useGetReferralsQuery } from './Referrals.generated'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import { useNavigate } from 'react-router-dom'
import { HealthDirectorateReferralStatusEnum } from '@island.is/api/schema'

const referralStatusToTagVariant = (
  status?: HealthDirectorateReferralStatusEnum | null,
): TagVariant => {
  switch (status) {
    case HealthDirectorateReferralStatusEnum.Open:
      return 'blue'
    case HealthDirectorateReferralStatusEnum.Withdrawn:
    case HealthDirectorateReferralStatusEnum.Completed:
    case HealthDirectorateReferralStatusEnum.Finished:
      return 'purple'
    case HealthDirectorateReferralStatusEnum.InTreatment:
      return 'mint'
    case HealthDirectorateReferralStatusEnum.Rejected:
    case HealthDirectorateReferralStatusEnum.Deleted:
    case HealthDirectorateReferralStatusEnum.Expired:
      return 'red'
    case HealthDirectorateReferralStatusEnum.Unknown:
    default:
      return 'blue'
  }
}

const Referrals: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()

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
          title={formatMessage(messages.noReferralsTitle)}
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
            headingVariant="h4"
            text={[
              formatMessage(messages.medicineValidTo),
              formatDate(referral.validUntilDate),
            ]
              .filter((item) => isDefined(item))
              .join(' ')}
            tag={{
              label: referral?.stateDisplay ?? '',
              outlined: false,
              variant: referralStatusToTagVariant(referral?.status ?? null),
            }}
            cta={{
              onClick: () =>
                navigate(
                  HealthPaths.HealthReferralsDetail.replace(
                    ':id',
                    referral?.id ?? '',
                  ),
                ),
              label: formatMessage(messages.seeMore),
              variant: 'text',
            }}
          />
        ))}
      </Stack>
    </IntroWrapper>
  )
}

export default Referrals
