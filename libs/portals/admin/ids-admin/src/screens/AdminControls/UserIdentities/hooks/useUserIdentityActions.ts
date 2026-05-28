import { useCallback, useEffect, useRef, useState } from 'react'
import { useFetcher } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../../lib/messages'
import {
  UserIdentityIntent,
  type UserIdentitiesActionResult,
} from '../UserIdentities.action'
import type { UserIdentityRow } from '../UserIdentities.types'

export const useUserIdentityActions = () => {
  const { formatMessage } = useLocale()
  const fetcher = useFetcher<UserIdentitiesActionResult>()

  const [deactivateTarget, setDeactivateTarget] =
    useState<UserIdentityRow | null>(null)
  const [reactivateTarget, setReactivateTarget] =
    useState<UserIdentityRow | null>(null)
  const [claimsTarget, setClaimsTarget] = useState<UserIdentityRow | null>(
    null,
  )

  const lastHandled = useRef<UserIdentitiesActionResult | null>(null)

  useEffect(() => {
    if (!fetcher.data || fetcher.data === lastHandled.current) {
      return
    }
    lastHandled.current = fetcher.data

    if (fetcher.data.globalError) {
      toast.error(formatMessage(m.userIdentitiesError))
      return
    }

    const responseData = fetcher.data.data as {
      failedEnvironments?: { environment: string; message: string }[]
    } | null
    const failedEnvs = responseData?.failedEnvironments

    switch (fetcher.data.intent) {
      case UserIdentityIntent.deactivate:
        toast.success(formatMessage(m.userIdentitiesDeactivateSuccess))
        break
      case UserIdentityIntent.reactivate:
        toast.success(formatMessage(m.userIdentitiesReactivateSuccess))
        break
    }

    if (failedEnvs && failedEnvs.length > 0) {
      const envNames = failedEnvs.map((f) => f.environment).join(', ')
      toast.warning(
        formatMessage(m.userIdentitiesPartialFailure, {
          environments: envNames,
        }),
      )
    }

    setDeactivateTarget(null)
    setReactivateTarget(null)
  }, [fetcher.data, formatMessage])

  const submitIntent = useCallback(
    (
      intent: UserIdentityIntent,
      subjectId: string,
      environments: AuthAdminEnvironment[],
    ) => {
      const submitData = new FormData()
      submitData.set('intent', intent)
      submitData.set('subjectId', subjectId)
      submitData.set('environments', JSON.stringify(environments))
      fetcher.submit(submitData, { method: 'post' })
    },
    [fetcher],
  )

  const handleDeactivate = useCallback(
    (subjectId: string, environments: AuthAdminEnvironment[]) => {
      submitIntent(UserIdentityIntent.deactivate, subjectId, environments)
    },
    [submitIntent],
  )

  const handleReactivate = useCallback(
    (subjectId: string, environments: AuthAdminEnvironment[]) => {
      submitIntent(UserIdentityIntent.reactivate, subjectId, environments)
    },
    [submitIntent],
  )

  return {
    deactivateTarget,
    reactivateTarget,
    claimsTarget,
    isSubmitting: fetcher.state !== 'idle',
    openDeactivate: setDeactivateTarget,
    openReactivate: setReactivateTarget,
    openClaims: setClaimsTarget,
    closeDeactivate: () => setDeactivateTarget(null),
    closeReactivate: () => setReactivateTarget(null),
    closeClaims: () => setClaimsTarget(null),
    handleDeactivate,
    handleReactivate,
  }
}

export type UserIdentityActionsState = ReturnType<typeof useUserIdentityActions>
