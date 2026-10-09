import { useCallback } from 'react'

import { findProblemInApolloError } from '@island.is/shared/problem'

import {
  useAuthCheckDelegationConfirmationAuthenticationMutation,
  useAuthStartDelegationConfirmationAuthenticationMutation,
} from '../../screens/ConfirmDelegation/ConfirmDelegation.generated'
import type {
  StepUpMethod,
  StepUpStart,
  StepUpStartError,
  StepUpStatus,
} from './StepUpAuthentication'

/**
 * Wires StepUpAuthentication to a held delegation: starting the grantor's
 * confirming authentication, and checking on it.
 */
export const useDelegationConfirmationStepUp = (
  confirmationId: string | undefined,
  { onExpired }: { onExpired?: () => void } = {},
) => {
  const [startMutation] =
    useAuthStartDelegationConfirmationAuthenticationMutation()
  const [checkMutation] =
    useAuthCheckDelegationConfirmationAuthenticationMutation()

  const start = useCallback(async (): Promise<StepUpStart> => {
    try {
      const result = await startMutation({
        variables: { input: { confirmationId: confirmationId as string } },
      })
      const started = result.data?.authStartDelegationConfirmationAuthentication
      if (!started) {
        throw new Error('No response')
      }
      return { ...started, method: started.method as StepUpMethod }
    } catch (error) {
      const status = findProblemInApolloError(error as never)?.status
      if (status === 410) {
        onExpired?.()
      }
      // 403: this session can never confirm, and the grant has been undone.
      const reason: StepUpStartError =
        status === 429
          ? 'too_many_attempts'
          : status === 403
          ? 'unavailable'
          : 'failed'
      throw reason
    }
  }, [confirmationId, startMutation, onExpired])

  const check = useCallback(async (): Promise<StepUpStatus> => {
    const result = await checkMutation({
      variables: { input: { confirmationId: confirmationId as string } },
    })
    return (result.data?.authCheckDelegationConfirmationAuthentication.status ??
      'pending') as StepUpStatus
  }, [confirmationId, checkMutation])

  return { start, check }
}
