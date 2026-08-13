import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import {
  CreateCourtSessionInput,
  DeleteCourtSessionInput,
  UpdateCourtSessionAppealDecisionInput,
  UpdateCourtSessionInput,
  UpdateCourtSessionStringInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateCourtSessionMutation } from './createCourtSession.generated'
import { useDeleteCourtSessionMutation } from './deleteCourtSession.generated'
import { useUpdateCourtSessionMutation } from './updateCourtSession.generated'
import { useUpdateCourtSessionAppealDecisionMutation } from './updateCourtSessionAppealDecision.generated'
import { useUpdateCourtSessionStringMutation } from './updateCourtSessionString.generated'

const useCourtSessions = () => {
  const [createCourtSessionMutation] = useCreateCourtSessionMutation()
  const [updateCourtSessionMutation] = useUpdateCourtSessionMutation()
  const [deleteCourtSessionMutation] = useDeleteCourtSessionMutation()
  const [updateCourtSessionStringMutation] =
    useUpdateCourtSessionStringMutation()
  const [updateCourtSessionAppealDecisionMutation] =
    useUpdateCourtSessionAppealDecisionMutation()

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

  const updateCourtSessionString = useCallback(
    async (updateCourtSessionString: UpdateCourtSessionStringInput) => {
      try {
        const { data } = await updateCourtSessionStringMutation({
          variables: {
            input: updateCourtSessionString,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra þinghald')

        return false
      }
    },
    [updateCourtSessionStringMutation],
  )

  const updateCourtSessionAppealDecision = useCallback(
    async (
      updateCourtSessionAppealDecision: UpdateCourtSessionAppealDecisionInput,
    ) => {
      try {
        const { data } = await updateCourtSessionAppealDecisionMutation({
          variables: {
            input: updateCourtSessionAppealDecision,
          },
        })

        return data?.updateCourtSessionAppealDecision
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra ákvörðun um kæru')

        return undefined
      }
    },
    [updateCourtSessionAppealDecisionMutation],
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
    updateCourtSessionString,
    updateCourtSessionAppealDecision,
    deleteCourtSession,
  }
}

export default useCourtSessions
