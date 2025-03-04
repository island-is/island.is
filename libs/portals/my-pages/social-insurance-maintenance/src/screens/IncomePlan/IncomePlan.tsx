import { AlertMessage, Box, Inline, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import {
  useGetIncomePlanApplicationQuery,
  useGetIncomePlanQuery,
} from './IncomePlan.generated'
import { mapStatus } from './mapper'
import { ApplicationStatus, Status } from './types'
import { IncomePlanCard } from './IncomePlanCard'
import { useMemo } from 'react'

const RENDER_ALERT_BOX_CONDITIONALS: Status[] = [
  'in_review',
  'accepted_no_changes',
  'rejected_no_changes',
]

const RENDER_LINK_BUTTON_CONDITIONALS: Status[] = [
  'accepted',
  'accepted_no_changes',
  'rejected',
  'rejected_no_changes',
  'modify_accepted',
  'no_data',
  'in_review',
  'in_progress',
]

const IncomePlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage, locale } = useLocale()

  const { data, loading, error } = useGetIncomePlanQuery()
  const {
    data: applications,
    error: applicationsError,
    loading: applicationsLoading,
  } = useGetIncomePlanApplicationQuery({
    variables: {
      input: {
        typeId: ['IncomePlan'],
        scopeCheck: true,
      },
      locale,
    },
  })

  const status: Status = useMemo(() => {
    if (loading || applicationsLoading) {
      return 'loading'
    }
    if (error || applicationsError) {
      return 'error'
    }
    const applicationState = applications?.applicationApplications?.length
      ? applications?.applicationApplications?.[
          applications?.applicationApplications?.length - 1
        ].state
      : undefined
    return mapStatus(
      data?.socialInsuranceIncomePlan?.status,
      applicationState ? (applicationState as ApplicationStatus) : undefined,
      data?.socialInsuranceIncomePlan?.isEligibleForChange.isEligible ??
        undefined,
    )
  }, [
    applications,
    applicationsError,
    applicationsLoading,
    data?.socialInsuranceIncomePlan?.isEligibleForChange.isEligible,
    data?.socialInsuranceIncomePlan?.status,
    error,
    loading,
  ])

  const renderAlertBox = () => {
    if (RENDER_ALERT_BOX_CONDITIONALS.includes(status)) {
      return (
        <AlertMessage
          type="info"
          title={formatMessage(m.incomePlanModifyUnavailable)}
          message={formatMessage(m.incomePlanModifyUnavailableText)}
        />
      )
    }
  }

  const renderLinkButton = () => {
    if (RENDER_LINK_BUTTON_CONDITIONALS.includes(status)) {
      return (
        <LinkButton
          to={`${document.location.origin}/${formatMessage(
            m.incomePlanModifyLink,
          )}`}
          text={formatMessage(
            status === 'modify_accepted'
              ? m.continueApplication
              : status === 'no_data'
              ? m.submitIncomePlan
              : m.modifyIncomePlan,
          )}
          disabled={
            status === 'accepted_no_changes' ||
            status === 'rejected_no_changes' ||
            status === 'in_review'
          }
          icon="open"
          variant="utility"
          size="small"
        />
      )
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'error':
        return <Problem error={error || applicationsError} noBorder={false} />
      case 'loading':
        return (
          <Box marginBottom={2}>
            <CardLoader />
          </Box>
        )
      default: {
        return (
          <Stack space={2}>
            {renderAlertBox()}
            <Inline space={2}>
              <LinkButton
                to={formatMessage(m.incomePlanLink)}
                text={formatMessage(m.incomePlanLinkText)}
                icon="open"
                variant="utility"
              />
              {renderLinkButton()}
            </Inline>
            <IncomePlanCard
              status={status}
              registrationDate={new Date().toISOString()}
            />
          </Stack>
        )
      }
    }
  }

  return (
    <IntroWrapper
      title={formatMessage(coreMessages.incomePlan)}
      intro={formatMessage(coreMessages.incomePlanDescription)}
      serviceProviderSlug={'tryggingastofnun'}
      serviceProviderTooltip={formatMessage(
        coreMessages.socialInsuranceTooltip,
      )}
    >
      {renderContent()}
    </IntroWrapper>
  )
}

export default IncomePlan
