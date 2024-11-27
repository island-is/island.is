import { AlertMessage, Box, Inline, Stack } from '@island.is/island-ui/core'
import {
  FormatMessage,
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  FootNote,
  IntroHeader,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { SocialInsuranceMaintenancePaths } from '../../lib/paths'
import { useGetIncomePlanQuery } from './IncomePlan.generated'
import { SocialInsuranceIncomePlanStatus } from '@island.is/api/schema'

const parseSubtext = (
  tag: SocialInsuranceIncomePlanStatus,
  date: Date,
  formatMessage: FormatMessage,
) => {
  switch (tag) {
    case SocialInsuranceIncomePlanStatus.ACCEPTED:
      return `${formatMessage(coreMessages.approved)}: ${formatDate(date)}`
    case SocialInsuranceIncomePlanStatus.IN_PROGRESS:
      return `${formatMessage(m.receivedInProgress)}: ${formatDate(date)}`
    case SocialInsuranceIncomePlanStatus.CANCELLED:
      return `${formatMessage(coreMessages.rejected)}: ${formatDate(date)}`
    default:
      return
  }
}

const parseTag = (
  tag: SocialInsuranceIncomePlanStatus,
  formatMessage: FormatMessage,
) => {
  switch (tag) {
    case SocialInsuranceIncomePlanStatus.ACCEPTED:
      return {
        label: formatMessage(coreMessages.processed),
        variant: 'mint' as const,
        outlined: false,
      }
    case SocialInsuranceIncomePlanStatus.IN_PROGRESS:
      return {
        label: formatMessage(coreMessages.inProgress),
        variant: 'purple' as const,
        outlined: false,
      }
    case SocialInsuranceIncomePlanStatus.CANCELLED:
      return {
        label: formatMessage(coreMessages.rejected),
        variant: 'red' as const,
        outlined: false,
      }
    default:
      return {
        label: formatMessage(coreMessages.unknown),
        variant: 'red' as const,
        outlined: false,
      }
  }
}

const IncomePlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetIncomePlanQuery()

  return (
    <IntroWrapper
      title={formatMessage(coreMessages.incomePlan)}
      intro={formatMessage(coreMessages.incomePlanDescription)}
      serviceProviderSlug={'tryggingastofnun'}
      serviceProviderTooltip={formatMessage(
        coreMessages.socialInsuranceTooltip,
      )}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : loading ? (
        <Box marginBottom={2}>
          <CardLoader />
        </Box>
      ) : (
        <Stack space={2}>
          {!error &&
            !loading &&
            data?.socialInsuranceIncomePlan &&
            !data?.socialInsuranceIncomePlan?.isEligibleForChange
              .isEligible && (
              <AlertMessage
                type="info"
                title={formatMessage(m.incomePlanModifyUnavailable)}
                message={formatMessage(m.incomePlanModifyUnavailableText)}
              />
            )}
          <Inline space={2}>
            <LinkButton
              to={formatMessage(m.incomePlanLink)}
              text={formatMessage(m.incomePlanLinkText)}
              icon="open"
              variant="utility"
            />
            {data?.socialInsuranceIncomePlan && (
              <LinkButton
                to={`${document.location.origin}/${formatMessage(
                  m.incomePlanModifyLink,
                )}`}
                text={formatMessage(m.modifyIncomePlan)}
                disabled={
                  !data?.socialInsuranceIncomePlan?.isEligibleForChange
                    .isEligible
                }
                icon="open"
                variant="primary"
                size="small"
              />
            )}
          </Inline>
          {data?.socialInsuranceIncomePlan ? (
            <ActionCard
              image={{
                type: 'image',
                url: './assets/images/tr.svg',
              }}
              text={
                data?.socialInsuranceIncomePlan?.status &&
                data?.socialInsuranceIncomePlan.registrationDate
                  ? parseSubtext(
                      data.socialInsuranceIncomePlan?.status,
                      new Date(data.socialInsuranceIncomePlan.registrationDate),
                      formatMessage,
                    )
                  : undefined
              }
              heading={formatMessage(coreMessages.incomePlan)}
              cta={{
                label: formatMessage(m.viewIncomePlan),
                url:
                  data.socialInsuranceIncomePlan.status ===
                  SocialInsuranceIncomePlanStatus.IN_PROGRESS
                    ? `${document.location.origin}/${formatMessage(
                        m.incomePlanModifyLink,
                      )}`
                    : SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlanDetail,
                variant: 'text',
              }}
            />
          ) : (
            <ActionCard
              image={{
                type: 'image',
                url: './assets/images/tr.svg',
              }}
              text={formatMessage(m.noActiveIncomePlan)}
              headingColor="currentColor"
              heading={formatMessage(coreMessages.incomePlan)}
              backgroundColor="blue"
              borderColor="blue200"
              cta={{
                label: formatMessage(m.submitIncomePlan),
                url: `${document.location.origin}/${formatMessage(
                  m.incomePlanModifyLink,
                )}`,
                variant: 'primary',
                size: 'medium',
                icon: 'open',
                centered: true,
              }}
            />
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default IncomePlan
