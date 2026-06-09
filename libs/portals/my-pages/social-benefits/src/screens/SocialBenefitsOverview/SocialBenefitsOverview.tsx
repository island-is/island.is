import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  ActionCardLoader,
  IntroWrapper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { sharedMessages } from '../../lib/messages/shared'
import { unemploymentBenefitsMessages as um } from '../../lib/messages/'
import { AlertMessage, Stack } from '@island.is/island-ui/core'
import {
  SocialInsuranceMaintenancePaths,
  UnemploymentBenefitsPaths,
} from '../../lib/paths'
import { useGetApplicationsOverviewQuery } from './SocialBenefitsOverview.generated'
import { resolveStatusTagVariant } from '../../lib/statusTagVariant'
import type { VmstApplicationStatus } from '@island.is/api/schema'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'

const getStatusTag = (
  statusName?: string | null,
  status?: VmstApplicationStatus | null,
) => ({
  label: statusName || '',
  variant: resolveStatusTagVariant(status),
})

const SocialBenefitsOverview = () => {
  const { formatMessage } = useLocale()
  const { value: vmstEnabled, loading: vmstFlagLoading } = useFeatureFlag(
    Features.isServicePortalUnemploymentBenefitsPageEnabled,
    false,
  )
  const { data, loading, error } = useGetApplicationsOverviewQuery({
    skip: !vmstEnabled,
  })
  const overview = data?.vmstApplicationsOverview

  return (
    <IntroWrapper
      title={formatMessage(sharedMessages.overviewTitle)}
      intro={formatMessage(sharedMessages.overviewIntro)}
    >
      <Stack space={3}>
        {(loading || vmstFlagLoading) && <ActionCardLoader repeat={1} />}
        {!loading && !!error && (
          <AlertMessage
            type="error"
            message={formatMessage(sharedMessages.vmstFetchError)}
          />
        )}
        {vmstEnabled &&
          !loading &&
          !error &&
          overview?.unemploymentApplication?.isVisible && (
            <ActionCard
              heading={formatMessage(um.unemploymentBenefits)}
              text={formatMessage(
                sharedMessages.unemploymentBenefitsCardDescription,
              )}
              cta={{
                label: formatMessage(sharedMessages.overviewCtaLabel),
                variant: 'text',
                icon: 'arrowForward',
                url: UnemploymentBenefitsPaths.Status,
              }}
              image={{ type: 'logo', url: './assets/images/vmst-logo.svg' }}
              tag={getStatusTag(
                overview.unemploymentApplication.statusName,
                overview.unemploymentApplication.status,
              )}
            />
          )}
        <ActionCard
          heading={formatMessage(coreMessages.socialSecurity)}
          text={formatMessage(sharedMessages.socialInsuranceCardDescription)}
          cta={{
            label: formatMessage(sharedMessages.overviewCtaLabel),
            url: SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan,
            variant: 'text',
            icon: 'arrowForward',
          }}
          image={{ type: 'logo', url: './assets/images/tr.svg' }}
        />
      </Stack>
    </IntroWrapper>
  )
}

export default SocialBenefitsOverview
