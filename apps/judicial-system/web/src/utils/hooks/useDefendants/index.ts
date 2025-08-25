import { Dispatch, SetStateAction, useCallback } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CreateDefendantInput,
  Defendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateDefendantMutation } from './createDefendant.generated'
import { useDeleteDefendantMutation } from './deleteDefendant.generated'
import { useLimitedAccessUpdateDefendantMutation } from './limitedAccessUpdateDefendant.generated'
import { useUpdateDefendantMutation } from './updateDefendant.generated'

const useDefendants = () => {
  const { formatMessage } = useIntl()

  const [createDefendantMutation, { loading: isCreatingDefendant }] =
    useCreateDefendantMutation()

  const [deleteDefendantMutation] = useDeleteDefendantMutation()

  const [updateDefendantMutation, { loading: isUpdatingDefendant }] =
    useUpdateDefendantMutation()

  const [limitedAccessUpdateDefendantMutation] =
    useLimitedAccessUpdateDefendantMutation()

  const createDefendant = useCallback(
    async (defendant: CreateDefendantInput) => {
      try {
        if (!isCreatingDefendant) {
          const { data } = await createDefendantMutation({
            variables: {
              input: defendant,
            },
          })

          if (data) {
            return data.createDefendant?.id
          }
        }
      } catch (error) {
        toast.error(formatMessage(errors.createDefendant))
      }
    },
    [createDefendantMutation, formatMessage, isCreatingDefendant],
  )

  const deleteDefendant = useCallback(
    async (caseId: string, defendantId: string) => {
      try {
        const { data } = await deleteDefendantMutation({
          variables: { input: { caseId, defendantId } },
        })

        return Boolean(data?.deleteDefendant?.deleted)
      } catch (error) {
        toast.error(formatMessage(errors.deleteDefendant))

        return false
      }
    },
    [deleteDefendantMutation, formatMessage],
  )

  const updateDefendant = useCallback(
    async (updateDefendant: UpdateDefendantInput) => {
      try {
        const { data } = await updateDefendantMutation({
          variables: {
            input: updateDefendant,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error(formatMessage(errors.updateDefendant))

        return false
      }
    },
    [formatMessage, updateDefendantMutation],
  )

  const limitedAccessUpdateDefendant = useCallback(
    async (updateDefendant: UpdateDefendantInput) => {
      try {
        const { data } = await limitedAccessUpdateDefendantMutation({
          variables: {
            input: updateDefendant,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error(formatMessage(errors.updateDefendant))

        return false
      }
    },
    [formatMessage, limitedAccessUpdateDefendantMutation],
  )

  const updateDefendantState = useCallback(
    (
      update: UpdateDefendantInput,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      setWorkingCase((prevWorkingCase: Case) => {
        if (!prevWorkingCase.defendants) {
          return prevWorkingCase
        }
        const indexOfDefendantToUpdate = prevWorkingCase.defendants.findIndex(
          (defendant) => defendant.id === update.defendantId,
        )

        const newDefendants = [...prevWorkingCase.defendants]

        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          ...update,
        } as Defendant

        return { ...prevWorkingCase, defendants: newDefendants }
      })
    },
    [],
  )

  const setAndSendDefendantToServer = useCallback(
    (
      update: UpdateDefendantInput,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      updateDefendantState(update, setWorkingCase)
      updateDefendant(update)
    },
    [updateDefendant, updateDefendantState],
  )

  return {
    createDefendant,
    deleteDefendant,
    updateDefendant,
    limitedAccessUpdateDefendant,
    isUpdatingDefendant,
    updateDefendantState,
    setAndSendDefendantToServer,
  }
}

export default useDefendants
