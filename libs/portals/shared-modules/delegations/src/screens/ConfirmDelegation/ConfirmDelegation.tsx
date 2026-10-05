import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { StepUpAuthentication } from '../../components/StepUpAuthentication/StepUpAuthentication'
import { useDelegationConfirmationStepUp } from '../../components/StepUpAuthentication/useDelegationConfirmationStepUp'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { useAuthDelegationConfirmationQuery } from './ConfirmDelegation.generated'

type Outcome = 'confirmed' | 'already-completed' | 'expired'

/**
 * Where a grantor finishes a confirmation they left unfinished — normally they
 * confirm in the grant modal straight away. Shows exactly what they are
 * confirming, including the message their phone will show.
 */
export const ConfirmDelegation = () => {
  useNamespaces(['sp.access-control-delegations'])
  const { formatMessage, formatDateFns } = useLocale()
  const navigate = useNavigate()
  const { confirmationId } = useParams<{ confirmationId: string }>()
  const [outcome, setOutcome] = useState<Outcome>()

  const { data, loading, error, refetch } = useAuthDelegationConfirmationQuery({
    variables: { input: { confirmationId: confirmationId as string } },
    skip: !confirmationId,
    fetchPolicy: 'no-cache',
  })
  const { start, check } = useDelegationConfirmationStepUp(confirmationId, {
    onExpired: () => setOutcome('expired'),
  })

  const confirmation = data?.authDelegationConfirmation

  const goToDelegations = () => navigate(DelegationPaths.DelegationsNew)

  if (loading) {
    return (
      <Box>
        <IntroHeader title={formatMessage(m.confirmDelegationTitle)} />
        <SkeletonLoader height={80} repeat={2} space={2} />
      </Box>
    )
  }

  const isOpen =
    confirmation?.status === 'pending' &&
    new Date(confirmation.expiresAt).getTime() > Date.now()

  const result =
    outcome ??
    (confirmation?.status === 'confirmed'
      ? 'already-completed'
      : confirmation && !isOpen
      ? 'expired'
      : undefined)

  const messages = {
    confirmed: {
      type: 'success' as const,
      title: formatMessage(m.confirmDelegationSuccessTitle),
      message: formatMessage(m.confirmDelegationSuccessMessage),
    },
    'already-completed': {
      type: 'success' as const,
      title: formatMessage(m.confirmDelegationAlreadyDoneTitle),
      message: formatMessage(m.confirmDelegationAlreadyDoneMessage),
    },
    expired: {
      type: 'warning' as const,
      title: formatMessage(m.confirmDelegationExpiredTitle),
      message: formatMessage(m.confirmDelegationExpiredMessage),
    },
  }

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.confirmDelegationTitle)}
        intro={
          !result && confirmation
            ? formatMessage(m.confirmDelegationIntro)
            : undefined
        }
      />

      {(error || (!loading && !confirmation)) && (
        <Box marginBottom={3}>
          <AlertMessage
            type="error"
            title={formatMessage(
              error ? m.errorTitle : m.confirmDelegationNotFoundTitle,
            )}
            message={formatMessage(
              error
                ? m.confirmDelegationFailedMessage
                : m.confirmDelegationNotFoundMessage,
            )}
          />
        </Box>
      )}

      {result && (
        <Box marginBottom={3}>
          <AlertMessage {...messages[result]} />
        </Box>
      )}

      {confirmation && (
        <Box marginBottom={4} display="flex" flexDirection="column" rowGap={2}>
          <Box>
            <Text variant="eyebrow" color="purple400">
              {formatMessage(m.confirmDelegationRecipient)}
            </Text>
            <Text variant="h4" as="p">
              {confirmation.toName}
            </Text>
          </Box>
          <Box>
            <Text variant="eyebrow" color="purple400">
              {formatMessage(m.confirmDelegationPermissions)}
            </Text>
            {confirmation.scopes.map((scope) => (
              <Text key={scope.name}>
                {scope.displayName}
                {' · '}
                {formatMessage(m.confirmDelegationValidTo, {
                  date: formatDateFns(scope.validTo, 'dd.MM.yyyy'),
                })}
              </Text>
            ))}
          </Box>
          {!result && (
            <Box>
              <Text variant="eyebrow" color="purple400">
                {formatMessage(m.confirmDelegationPhoneShows)}
              </Text>
              <Text>{confirmation.bindingMessage}</Text>
            </Box>
          )}
        </Box>
      )}

      {confirmation && !result && (
        <Box marginBottom={4}>
          <StepUpAuthentication
            start={start}
            check={check}
            onConfirmed={() => setOutcome('confirmed')}
            onExpired={() => setOutcome('expired')}
          />
        </Box>
      )}

      <Box display="flex" columnGap={2}>
        {error && (
          <Button onClick={() => refetch()}>
            {formatMessage(m.confirmDelegationRetry)}
          </Button>
        )}
        <Button variant="ghost" onClick={goToDelegations}>
          {formatMessage(m.confirmDelegationBackToDelegations)}
        </Button>
      </Box>
    </Box>
  )
}

export default ConfirmDelegation
