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
  activationGrantMessages as am,
} from '../../lib/messages/'
import { AlertMessage, Stack, TagVariant } from '@island.is/island-ui/core'
import {
  SocialInsuranceMaintenancePaths,
  UnemploymentBenefitsPaths,
} from '../../lib/paths'
import { useGetApplicationsOverviewQuery } from './SocialBenefitsOverview.generated'
import { applicationStatusColorMap } from '../../lib/utils/vmstApplicationStatusColorMap'

const VMST_LOGO_URL =
  'https://images.ctfassets.net/8k0h54kbe6bj/1Dx3m4dQ0fY4H5qFKeefZI/324a13f875fd5cc7b460373d8edf6abc/Vinnumalastofnun-Logo.svg'

const getStatusTag = (
  statusName?: string | null,
  statusId?: string | null,
): { label: string; variant: TagVariant } => ({
  label: statusName || '',
  variant: applicationStatusColorMap[statusId?.toUpperCase() ?? ''] ?? 'warn',
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
            image={{ type: 'logo', url: VMST_LOGO_URL }}
            tag={getStatusTag(
              overview.unemploymentApplication.statusName,
              overview.unemploymentApplication.statusId,
            )}
          />
        )}
        {vmstReady && overview?.activationGrant?.isVisible && (
          <ActionCard
            heading={formatMessage(am.activationGrant)}
            text={formatMessage(sharedMessages.activationGrantCardDescription)}
            cta={{
              label: formatMessage(sharedMessages.overviewCtaLabel),
              url: UnemploymentBenefitsPaths.Status,
              variant: 'text',
              icon: 'arrowForward',
            }}
            image={{ type: 'logo', url: VMST_LOGO_URL }}
            tag={getStatusTag(
              overview.activationGrant.statusName,
              overview.activationGrant.statusId,
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
