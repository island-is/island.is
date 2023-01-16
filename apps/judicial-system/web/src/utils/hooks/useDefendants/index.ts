import React, { SetStateAction, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  Case,
  UpdateDefendant as TUpdateDefendant,
} from '@island.is/judicial-system/types'
import {
  CreateDefendantMutationMutation,
  DeleteDefendantMutationMutation,
  UpdateDefendantMutationMutation,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { CreateDefendant } from './createDefendantGql'
import { DeleteDefendant } from './deleteDefendantGql'
import { UpdateDefendant } from './updateDefendantGql'

const useDefendants = () => {
  const { formatMessage } = useIntl()

  const [
    createDefendantMutation,
    { loading: isCreatingDefendant },
  ] = useMutation<CreateDefendantMutationMutation>(CreateDefendant)
  const [
    deleteDefendantMutation,
  ] = useMutation<DeleteDefendantMutationMutation>(DeleteDefendant)
  const [
    updateDefendantMutation,
  ] = useMutation<UpdateDefendantMutationMutation>(UpdateDefendant)

  const createDefendant = useCallback(
    async (caseId: string, defendant: TUpdateDefendant) => {
      try {
        if (!isCreatingDefendant) {
          const { data } = await createDefendantMutation({
            variables: {
              input: {
                caseId,
                name: defendant.name,
                address: defendant.address,
                nationalId: defendant.nationalId?.replace('-', ''),
                gender: defendant.gender,
                citizenship: defendant.citizenship,
                noNationalId: defendant.noNationalId,
              },
            },
          })

          if (data?.createDefendant) {
            return data.createDefendant.id
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

        if (data?.deleteDefendant?.deleted) {
          return true
        } else {
          return false
        }
      } catch (error) {
        formatMessage(errors.deleteDefendant)
      }
    },
    [deleteDefendantMutation, formatMessage],
  )

  const updateDefendant = useCallback(
    async (
      caseId: string,
      defendantId: string,
      updateDefendant: TUpdateDefendant,
    ) => {
      try {
        const { data } = await updateDefendantMutation({
          variables: {
            input: {
              caseId,
              defendantId,
              ...updateDefendant,
            },
          },
        })

        if (data?.updateDefendant) {
          return true
        } else {
          return false
        }
      } catch (error) {
        toast.error(formatMessage(errors.updateDefendant))
      }
    },
    [formatMessage, updateDefendantMutation],
  )

  const updateDefendantState = useCallback(
    (
      defendantId: string,
      update: TUpdateDefendant,
      setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
    ) => {
      setWorkingCase((theCase: Case) => {
        if (!theCase.defendants) {
          return theCase
        }
        const indexOfDefendantToUpdate = theCase.defendants.findIndex(
          (defendant) => defendant.id === defendantId,
        )

        const newDefendants = [...theCase.defendants]

        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          ...update,
        }

        return { ...theCase, defendants: newDefendants }
      })
    },
    [],
  )

  const setAndSendDefendantToServer = useCallback(
    (
      caseId: string,
      defendantId: string,
      update: TUpdateDefendant,
      setWorkingCase: React.Dispatch<SetStateAction<Case>>,
    ) => {
      updateDefendantState(defendantId, update, setWorkingCase)
      updateDefendant(caseId, defendantId, update)
    },
    [updateDefendant, updateDefendantState],
  )

  return {
    createDefendant,
    deleteDefendant,
    updateDefendant,
    updateDefendantState,
    setAndSendDefendantToServer,
  }
}

export default useDefendants
