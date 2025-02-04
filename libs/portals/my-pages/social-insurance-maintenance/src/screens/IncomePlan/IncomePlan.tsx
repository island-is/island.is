import { AlertMessage, Box, Inline, Stack } from '@island.is/island-ui/core'
import {
  FormatMessage,
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { SocialInsuranceMaintenancePaths } from '../../lib/paths'
import {
  useGetIncomePlanApplicationQuery,
  useGetIncomePlanQuery,
} from './IncomePlan.generated'
import { SocialInsuranceIncomePlanStatus } from '@island.is/api/schema'
import { mapStatus } from './mapper'
import { ApplicationStatus, Status } from './types'
import { IncomePlanCard } from './IncomePlanCard'

const IncomePlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage, locale } = useLocale()

  const { data, loading, error } = useGetIncomePlanQuery()
  const { data: applications, error: applicationsError } =
    useGetIncomePlanApplicationQuery({
      variables: {
        input: {
          typeId: ['IncomePlan'],
          scopeCheck: true,
        },
        locale,
      },
    })

  let status: Status
  if (error || applicationsError) {
    status = 'error'
  } else {
    const applicationState = applications
      ? applications.applicationApplications?.[
          applications.applicationApplications.length - 1
        ].state
      : undefined
    status = mapStatus(
      data?.socialInsuranceIncomePlan?.status,
      applicationState ? (applicationState as ApplicationStatus) : undefined,
    )
  }

  const alertBox = () => {
    if (
      status === 'in_review' ||
      (status === 'accepted' &&
        data?.socialInsuranceIncomePlan?.isEligibleForChange.isEligible)
    ) {
      return (
        <AlertMessage
          type="info"
          title={formatMessage(m.incomePlanModifyUnavailable)}
          message={formatMessage(m.incomePlanModifyUnavailableText)}
        />
      )
    }

    return undefined
  }

  const applicationButtonAboveCard = () => {}

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
        <Problem error={error || applicationsError} noBorder={false} />
      ) : loading ? (
        <Box marginBottom={2}>
          <CardLoader />
        </Box>
      ) : (
        <Stack space={2}>
          <Inline space={2}>
            {!error && !loading && alertBox()}
            <LinkButton
              to={formatMessage(m.incomePlanLink)}
              text={formatMessage(m.incomePlanLinkText)}
              icon="open"
              variant="utility"
            />
            {status === 'accepted' && (
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
          <IncomePlanCard
            applicationStatus={status}
            incomePlanStatus={
              data?.socialInsuranceIncomePlan?.status ?? undefined
            }
            incomePlanRegistrationDate={
              data?.socialInsuranceIncomePlan?.registrationDate
            }
            incomePlanEligibleForChange={
              data?.socialInsuranceIncomePlan?.isEligibleForChange.isEligible ??
              undefined
            }
          />
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default IncomePlan
