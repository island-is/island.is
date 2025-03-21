import { Dispatch, SetStateAction, useCallback } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CivilClaimant,
  CreateCivilClaimantInput,
  UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateCivilClaimantMutation } from './createCivilClaimant.generated'
import { useDeleteCivilClaimantMutation } from './deleteCivilClaimant.generated'
import { useUpdateCivilClaimantMutation } from './updateCivilClaimant.generated'

const useCivilClaimants = () => {
  const { formatMessage } = useIntl()

  const [createCivilClaimantMutation, { loading: isCreatingCivilClaimant }] =
    useCreateCivilClaimantMutation()
  const [deleteCivilClaimantMutation] = useDeleteCivilClaimantMutation()
  const [updateCivilClaimantMutation] = useUpdateCivilClaimantMutation()

  const createCivilClaimant = useCallback(
    async (civilClaimant: CreateCivilClaimantInput) => {
      try {
        if (!isCreatingCivilClaimant) {
          const { data } = await createCivilClaimantMutation({
            variables: {
              input: civilClaimant,
            },
          })

          if (data) {
            return data.createCivilClaimant?.id
          }
        }
        return null
      } catch (error) {
        toast.error(formatMessage(errors.createCivilClaimant))
        return null
      }
    },
    [createCivilClaimantMutation, formatMessage, isCreatingCivilClaimant],
  )

  const deleteCivilClaimant = useCallback(
    async (caseId: string, civilClaimantId: string) => {
      try {
        const { data } = await deleteCivilClaimantMutation({
          variables: { input: { caseId, civilClaimantId } },
        })

        return Boolean(data?.deleteCivilClaimant.deleted)
      } catch (error) {
        toast.error(formatMessage(errors.deleteCivilClaimant))
        return false
      }
    },
    [deleteCivilClaimantMutation, formatMessage],
  )

  const updateCivilClaimant = useCallback(
    async (updateCivilClaimant: UpdateCivilClaimantInput) => {
      try {
        const { data } = await updateCivilClaimantMutation({
          variables: {
            input: updateCivilClaimant,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error(formatMessage(errors.updateCivilClaimant))
        return false
      }
    },
    [formatMessage, updateCivilClaimantMutation],
  )

  const updateCivilClaimantState = useCallback(
    (
      update: UpdateCivilClaimantInput,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      setWorkingCase((prevWorkingCase: Case) => {
        if (!prevWorkingCase.civilClaimants) {
          return prevWorkingCase
        }
        const indexOfCivilClaimantToUpdate =
          prevWorkingCase.civilClaimants.findIndex(
            (civilClaimant) => civilClaimant.id === update.civilClaimantId,
          )

        if (indexOfCivilClaimantToUpdate === -1) {
          return prevWorkingCase
        } else {
          const newCivilClaimants = [...prevWorkingCase.civilClaimants]

          newCivilClaimants[indexOfCivilClaimantToUpdate] = {
            ...newCivilClaimants[indexOfCivilClaimantToUpdate],
            ...update,
          } as CivilClaimant

          return { ...prevWorkingCase, civilClaimants: newCivilClaimants }
        }
      })
    },
    [],
  )

  const setAndSendCivilClaimantToServer = useCallback(
    (
      update: UpdateCivilClaimantInput,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      updateCivilClaimantState(update, setWorkingCase)
      updateCivilClaimant(update)
    },
    [updateCivilClaimant, updateCivilClaimantState],
  )

  return {
    createCivilClaimant,
    deleteCivilClaimant,
    updateCivilClaimant,
    updateCivilClaimantState,
    setAndSendCivilClaimantToServer,
  }
}

export default useCivilClaimants
