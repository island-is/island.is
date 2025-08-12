import { Dispatch, SetStateAction, useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import {
  Case,
  CreateVictimInput,
  UpdateVictimInput,
  Victim,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateVictimMutation } from './createVictim.generated'
import { useDeleteVictimMutation } from './deleteVictim.generated'
import { useUpdateVictimMutation } from './updateVictim.generated'

const useVictims = () => {
  const [createVictimMutation, { loading: isCreatingVictim }] =
    useCreateVictimMutation()
  const [deleteVictimMutation] = useDeleteVictimMutation()
  const [updateVictimMutation] = useUpdateVictimMutation()

  const createVictim = useCallback(
    async (victim: CreateVictimInput) => {
      try {
        if (!isCreatingVictim) {
          const { data } = await createVictimMutation({
            variables: {
              input: victim,
            },
          })

          if (data) {
            return data.createVictim?.id
          }
        }
        return null
      } catch (error) {
        toast.error('Upp kom villa við að bæta við brotaþola')
        return null
      }
    },
    [createVictimMutation, isCreatingVictim],
  )

  const deleteVictim = useCallback(
    async (caseId: string, victimId: string) => {
      try {
        const { data } = await deleteVictimMutation({
          variables: { input: { caseId, victimId } },
        })

        return Boolean(data?.deleteVictim.deleted)
      } catch (error) {
        toast.error('Upp kom villa við að eyða brotaþola')
        return false
      }
    },
    [deleteVictimMutation],
  )

  const updateVictim = useCallback(
    async (updateVictim: UpdateVictimInput) => {
      try {
        const { data } = await updateVictimMutation({
          variables: {
            input: updateVictim,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra brotaþola')
        return false
      }
    },
    [updateVictimMutation],
  )

  const updateVictimState = (
    update: UpdateVictimInput,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => {
    setWorkingCase((prevWorkingCase: Case) => {
      if (!prevWorkingCase.victims) {
        return prevWorkingCase
      }
      const indexOfVictimToUpdate = prevWorkingCase.victims.findIndex(
        (victim) => victim.id === update.victimId,
      )

      if (indexOfVictimToUpdate === -1) {
        return prevWorkingCase
      } else {
        const newVictims = [...prevWorkingCase.victims]

        newVictims[indexOfVictimToUpdate] = {
          ...newVictims[indexOfVictimToUpdate],
          ...update,
        } as Victim

        return { ...prevWorkingCase, victims: newVictims }
      }
    })
  }

  const addVictimToState = (
    victimId: string,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => {
    setWorkingCase((prev) => ({
      ...prev,
      victims: [...(prev.victims ?? []), { id: victimId, hasNationalId: true }],
    }))
  }

  const removeVictimFromState = (
    victimId: string,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => {
    setWorkingCase((prev) => ({
      ...prev,
      victims: (prev.victims ?? []).filter((v) => v.id !== victimId),
    }))
  }

  const updateVictimAndSetState = async (
    update: UpdateVictimInput,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => {
    const victimId = await updateVictim(update)

    if (victimId) {
      updateVictimState(update, setWorkingCase)
    }
  }

  const createVictimAndSetState = async (
    caseId: string,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => {
    const victimId = await createVictim({ caseId })

    if (victimId) {
      addVictimToState(victimId, setWorkingCase)
    }

    return victimId
  }

  const deleteVictimAndSetState = async (
    caseId: string,
    victim: Victim,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => {
    const victimDeleted = await deleteVictim(caseId, victim.id)

    if (victimDeleted) {
      removeVictimFromState(victim.id, setWorkingCase)
    }

    return victimDeleted
  }

  return {
    createVictim,
    deleteVictim,
    updateVictim,
    updateVictimState,
    updateVictimAndSetState,
    createVictimAndSetState,
    deleteVictimAndSetState,
  }
}

export default useVictims
