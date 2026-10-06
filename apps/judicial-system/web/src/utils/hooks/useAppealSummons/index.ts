import { useCallback } from 'react'
import Cookie from 'js-cookie'

import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import type { AppealSummonsAppellantSide } from '@island.is/judicial-system-web/src/graphql/schema'
import { api } from '@island.is/judicial-system-web/src/services'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useCreateAppealSummonsMutation } from './createAppealSummons.generated'
import { useUpdateAppealSummonsMutation } from './updateAppealSummons.generated'

export type AppealSummonsDefendantInput = {
  defendantId: string
  appellantSide: AppealSummonsAppellantSide
  claims: string
}

const useAppealSummons = () => {
  const [createAppealSummonsMutation, { loading: isCreatingAppealSummons }] =
    useCreateAppealSummonsMutation()
  const [updateAppealSummonsMutation, { loading: isUpdatingAppealSummons }] =
    useUpdateAppealSummonsMutation()

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

  const previewAppealSummons = useCallback(
    async (caseId: string, defendants: AppealSummonsDefendantInput[]) => {
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
        window.open(previewUrl, '_blank')
        setTimeout(() => URL.revokeObjectURL(previewUrl), 1000 * 60)
      } catch {
        toast.error('Upp kom villa við að opna áfrýjunarstefnu')
      }
    },
    [],
  )

  return {
    createAppealSummons,
    updateAppealSummons,
    previewAppealSummons,
    isCreatingAppealSummons,
    isUpdatingAppealSummons,
  }
}

export default useAppealSummons
