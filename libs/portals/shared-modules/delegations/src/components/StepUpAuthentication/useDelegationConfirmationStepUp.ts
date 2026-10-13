import { useCallback } from 'react'

import { findProblemInApolloError } from '@island.is/shared/problem'

import { useAuthCheckDelegationConfirmationAuthenticationMutation } from './DelegationConfirmationStepUp.generated'
import type { StepUpStatus } from './StepUpAuthentication'

/**
 * Follows the step-up a held grant started. A refusal (any 4xx) is thrown as
 * 'refused', so it can be shown; anything else is thrown as it is and the
 * caller polls again.
 */
export const useDelegationConfirmationStepUp = (
  confirmationId: string | undefined,
) => {
  const [checkMutation] =
    useAuthCheckDelegationConfirmationAuthenticationMutation()

  const check = useCallback(async (): Promise<StepUpStatus> => {
    try {
      const result = await checkMutation({
        variables: { input: { confirmationId: confirmationId as string } },
      })
      return (result.data?.authCheckDelegationConfirmationAuthentication
        .status ?? 'pending') as StepUpStatus
    } catch (error) {
      const status = findProblemInApolloError(error as never)?.status
      if (status && status >= 400 && status < 500) {
        throw 'refused'
      }
      throw error
    }
  }, [confirmationId, checkMutation])

  return { check }
}
