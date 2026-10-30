import type {
  AppealCourtSession,
  CreateAppealCourtSessionInput,
  DeleteAppealCourtSessionInput,
  UpdateAppealCourtSessionInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useCreateAppealCourtSessionMutation } from './createAppealCourtSession.generated'
import { useDeleteAppealCourtSessionMutation } from './deleteAppealCourtSession.generated'
import { useUpdateAppealCourtSessionMutation } from './updateAppealCourtSession.generated'

// Books, changes and cancels the sessions of a verdict appeal at the court of
// appeals. Each returns what was saved, or undefined when the request failed
// and a toast has said so.
const useAppealCourtSession = () => {
  const [createAppealCourtSessionMutation, { loading: isCreating }] =
    useCreateAppealCourtSessionMutation()
  const [updateAppealCourtSessionMutation, { loading: isUpdating }] =
    useUpdateAppealCourtSessionMutation()
  const [deleteAppealCourtSessionMutation, { loading: isDeleting }] =
    useDeleteAppealCourtSessionMutation()

  const createAppealCourtSession = async (
    input: CreateAppealCourtSessionInput,
  ): Promise<AppealCourtSession | undefined> => {
    try {
      const { data } = await createAppealCourtSessionMutation({
        variables: { input },
      })

      return data?.createAppealCourtSession ?? undefined
    } catch {
      toast.error('Upp kom villa við að boða til þinghalds')

      return undefined
    }
  }

  const updateAppealCourtSession = async (
    input: UpdateAppealCourtSessionInput,
  ): Promise<AppealCourtSession | undefined> => {
    try {
      const { data } = await updateAppealCourtSessionMutation({
        variables: { input },
      })

      return data?.updateAppealCourtSession ?? undefined
    } catch {
      toast.error('Upp kom villa við að breyta þinghaldi')

      return undefined
    }
  }

  const deleteAppealCourtSession = async (
    input: DeleteAppealCourtSessionInput,
  ): Promise<boolean> => {
    try {
      const { data } = await deleteAppealCourtSessionMutation({
        variables: { input },
      })

      return data?.deleteAppealCourtSession?.deleted ?? false
    } catch {
      toast.error('Upp kom villa við að eyða þinghaldi')

      return false
    }
  }

  return {
    createAppealCourtSession,
    isCreatingAppealCourtSession: isCreating,
    updateAppealCourtSession,
    isUpdatingAppealCourtSession: isUpdating,
    deleteAppealCourtSession,
    isDeletingAppealCourtSession: isDeleting,
  }
}

export default useAppealCourtSession
