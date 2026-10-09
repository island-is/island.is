import { useCallback } from 'react'
import Cookie from 'js-cookie'

import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { api } from '@island.is/judicial-system-web/src/services'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useConfirmAppealSummonsMutation } from './confirmAppealSummons.generated'
import { useCreateAppealSummonsMutation } from './createAppealSummons.generated'
import { useDeleteAppealSummonsMutation } from './deleteAppealSummons.generated'
import { useSendAppealSummonsToCourtOfAppealsMutation } from './sendAppealSummonsToCourtOfAppeals.generated'
import { useUpdateAppealSummonsMutation } from './updateAppealSummons.generated'

export type AppealSummonsDefendantInput = {
  defendantId: string
  claims: string
}

const useAppealSummons = () => {
  const [createAppealSummonsMutation, { loading: isCreatingAppealSummons }] =
    useCreateAppealSummonsMutation()
  const [updateAppealSummonsMutation, { loading: isUpdatingAppealSummons }] =
    useUpdateAppealSummonsMutation()
  const [deleteAppealSummonsMutation, { loading: isDeletingAppealSummons }] =
    useDeleteAppealSummonsMutation()
  const [confirmAppealSummonsMutation, { loading: isConfirmingAppealSummons }] =
    useConfirmAppealSummonsMutation()
  const [
    sendAppealSummonsToCourtOfAppealsMutation,
    { loading: isSendingAppealSummonsToCourtOfAppeals },
  ] = useSendAppealSummonsToCourtOfAppealsMutation()

  const createAppealSummons = useCallback(
    async (caseId: string, defendants: AppealSummonsDefendantInput[]) => {
      try {
        if (isCreatingAppealSummons) {
          return undefined
        }

        const { data, errors } = await createAppealSummonsMutation({
          variables: {
            caseId,
            input: { defendants },
          },
        })

        if (data?.createAppealSummons && !errors) {
          return data.createAppealSummons
        }

        return undefined
      } catch {
        toast.error('Upp kom villa við að gefa út áfrýjunarstefnu')
        return undefined
      }
    },
    [createAppealSummonsMutation, isCreatingAppealSummons],
  )

  const updateAppealSummons = useCallback(
    async (
      caseId: string,
      appealSummonsId: string,
      defendants: AppealSummonsDefendantInput[],
    ) => {
      try {
        if (isUpdatingAppealSummons) {
          return undefined
        }

        const { data, errors } = await updateAppealSummonsMutation({
          variables: {
            caseId,
            input: { appealSummonsId, defendants },
          },
        })

        if (data?.updateAppealSummons && !errors) {
          return data.updateAppealSummons
        }

        return undefined
      } catch {
        toast.error('Upp kom villa við að vista áfrýjunarstefnu')
        return undefined
      }
    },
    [updateAppealSummonsMutation, isUpdatingAppealSummons],
  )

  const deleteAppealSummons = useCallback(
    async (caseId: string, appealSummonsId: string) => {
      try {
        if (isDeletingAppealSummons) {
          return false
        }

        const { data, errors } = await deleteAppealSummonsMutation({
          variables: {
            input: { caseId, appealSummonsId },
          },
        })

        return Boolean(data?.deleteAppealSummons.deleted && !errors)
      } catch {
        toast.error('Upp kom villa við að eyða áfrýjunarstefnu')
        return false
      }
    },
    [deleteAppealSummonsMutation, isDeletingAppealSummons],
  )

  const confirmAppealSummons = useCallback(
    async (caseId: string, appealSummonsId: string) => {
      try {
        if (isConfirmingAppealSummons) {
          return undefined
        }

        const { data, errors } = await confirmAppealSummonsMutation({
          variables: {
            caseId,
            input: { appealSummonsId },
          },
        })

        if (data?.confirmAppealSummons && !errors) {
          return data.confirmAppealSummons
        }

        return undefined
      } catch {
        toast.error('Upp kom villa við að staðfesta áfrýjunarstefnu')
        return undefined
      }
    },
    [confirmAppealSummonsMutation, isConfirmingAppealSummons],
  )

  const sendAppealSummonsToCourtOfAppeals = useCallback(
    async (caseId: string, appealSummonsId: string) => {
      try {
        if (isSendingAppealSummonsToCourtOfAppeals) {
          return undefined
        }

        const { data, errors } =
          await sendAppealSummonsToCourtOfAppealsMutation({
            variables: {
              caseId,
              input: { appealSummonsId },
            },
          })

        if (data?.sendAppealSummonsToCourtOfAppeals && !errors) {
          return data.sendAppealSummonsToCourtOfAppeals
        }

        return undefined
      } catch {
        toast.error('Upp kom villa við að senda áfrýjunarstefnu til Landsréttar')
        return undefined
      }
    },
    [
      isSendingAppealSummonsToCourtOfAppeals,
      sendAppealSummonsToCourtOfAppealsMutation,
    ],
  )

  const previewAppealSummons = useCallback(
    async (caseId: string, defendants: AppealSummonsDefendantInput[]) => {
      // Open synchronously so the browser still treats this as a user gesture
      // after the fetch/blob awaits below.
      const previewWindow = window.open('', '_blank')

      try {
        const token = Cookie.get(CSRF_COOKIE_NAME)
        const response = await fetch(
          `${api.apiUrl}/api/case/${caseId}/appealSummons/preview`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/pdf',
              ...(token ? { authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ defendants }),
          },
        )

        if (!response.ok) {
          throw new Error(`Preview failed with status ${response.status}`)
        }

        const blob = await response.blob()
        const previewUrl = URL.createObjectURL(blob)

        if (previewWindow) {
          previewWindow.location.href = previewUrl
        } else {
          window.open(previewUrl, '_blank')
        }

        setTimeout(() => URL.revokeObjectURL(previewUrl), 1000 * 60)
      } catch {
        previewWindow?.close()
        toast.error('Upp kom villa við að opna áfrýjunarstefnu')
      }
    },
    [],
  )

  return {
    createAppealSummons,
    updateAppealSummons,
    deleteAppealSummons,
    confirmAppealSummons,
    sendAppealSummonsToCourtOfAppeals,
    previewAppealSummons,
    isCreatingAppealSummons,
    isUpdatingAppealSummons,
    isDeletingAppealSummons,
    isConfirmingAppealSummons,
    isSendingAppealSummonsToCourtOfAppeals,
  }
}

export default useAppealSummons
