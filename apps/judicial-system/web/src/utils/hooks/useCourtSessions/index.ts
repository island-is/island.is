import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import {
  CreateCourtSessionInput,
  DeleteCourtSessionInput,
  UpdateCourtSessionInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateCourtSessionMutation } from './createCourtSession.generated'
import { useDeleteCourtSessionMutation } from './deleteCourtSession.generated'
import { useUpdateCourtSessionMutation } from './updateCourtSession.generated'

const useCourtSessions = () => {
  const [createCourtSessionMutation] = useCreateCourtSessionMutation()
  const [updateCourtSessionMutation] = useUpdateCourtSessionMutation()
  const [deleteCourtSessionMutation] = useDeleteCourtSessionMutation()

  const createCourtSession = useCallback(
    async (createCourtSessionInput: CreateCourtSessionInput) => {
      try {
        const { data } = await createCourtSessionMutation({
          variables: {
            input: createCourtSessionInput,
          },
        })

        if (!data || !data.createCourtSession) {
          throw new Error()
        }

        return {
          id: data.createCourtSession.id,
          created: data.createCourtSession.created,
        }
      } catch (error) {
        toast.error('Upp kom villa við að bæta við þinghaldi')

        return
      }
    },
    [createCourtSessionMutation],
  )

  const updateCourtSession = useCallback(
    async (updateCourtSession: UpdateCourtSessionInput) => {
      try {
        const { data } = await updateCourtSessionMutation({
          variables: {
            input: updateCourtSession,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra þinghald')

        return false
      }
    },
    [updateCourtSessionMutation],
  )

  const deleteCourtSession = useCallback(
    async (deleteCourtSession: DeleteCourtSessionInput) => {
      try {
        const { data } = await deleteCourtSessionMutation({
          variables: {
            input: deleteCourtSession,
          },
        })

        return Boolean(data?.deleteCourtSession?.deleted)
      } catch (error) {
        toast.error('Upp kom villa við að eyða þinghaldi')

        return false
      }
    },
    [deleteCourtSessionMutation],
  )

  return {
    createCourtSession,
    updateCourtSession,
    deleteCourtSession,
  }
}

export default useCourtSessions
