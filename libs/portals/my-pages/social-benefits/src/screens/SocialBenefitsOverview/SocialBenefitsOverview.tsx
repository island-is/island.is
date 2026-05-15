import type { ApolloError } from '@apollo/client'
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

const getStatusTag = (
  statusName?: string | null,
  status?: VmstApplicationStatus | null,
) => ({
  label: statusName || '',
  variant: resolveStatusTagVariant(status),
})

const is404Error = (error?: ApolloError) =>
  error?.graphQLErrors.some(
    (e) =>
      (e.extensions as { problem?: { status?: number } })?.problem?.status ===
      404,
  )

const SocialBenefitsOverview = () => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useGetApplicationsOverviewQuery()
  const overview = data?.vmstApplicationsOverview
  const hasNon404Error = !!error && !is404Error(error)
  const vmstReady = !loading && !hasNon404Error

  return (
    <IntroWrapper
      title={formatMessage(sharedMessages.overviewTitle)}
      intro={formatMessage(sharedMessages.overviewIntro)}
    >
      <Stack space={3}>
        {loading && <ActionCardLoader repeat={2} />}
        {!loading && hasNon404Error && (
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
