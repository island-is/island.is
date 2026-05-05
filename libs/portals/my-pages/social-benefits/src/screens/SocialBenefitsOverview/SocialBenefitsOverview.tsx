import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  ActionCardLoader,
  IntroWrapperV2,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { sharedMessages } from '../../lib/messages/shared'
import {
  unemploymentBenefitsMessages as um,
  // activationGrantMessages as am,
} from '../../lib/messages/'
import { AlertMessage, Stack, TagVariant } from '@island.is/island-ui/core'
import {
  SocialInsuranceMaintenancePaths,
  UnemploymentBenefitsPaths,
} from '../../lib/paths'
import { useGetApplicationsOverviewQuery } from './SocialBenefitsOverview.generated'

const getStatusTag = (
  statusName?: string | null,
  statusColor?: string | null,
): { label: string; variant: TagVariant } => ({
  label: statusName || '',
  variant: (statusColor as TagVariant) ?? 'warn',
})

const SocialBenefitsOverview = () => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useGetApplicationsOverviewQuery()
  const overview = data?.vmstApplicationsOverview
  const vmstReady = !loading && !error

  return (
    <IntroWrapperV2
      title={formatMessage(sharedMessages.overviewTitle)}
      intro={formatMessage(sharedMessages.overviewIntro)}
    >
      <Stack space={3}>
        {loading && <ActionCardLoader repeat={2} />}
        {!loading && error && (
          <AlertMessage
            type="error"
            message={formatMessage(sharedMessages.vmstFetchError)}
          />
        )}
        {vmstReady && overview?.unemploymentApplication?.isVisible && (
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
              overview.unemploymentApplication.statusColor,
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
    </IntroWrapperV2>
  )
}

export default SocialBenefitsOverview
