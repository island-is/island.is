import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import { UpdateDefendantInput } from '@island.is/judicial-system-web/src/graphql/schema'

import { CreateDefendantMutation } from './createDefendantGql'
import { DeleteDefendantMutation } from './deleteDefendantGql'
import { UpdateDefendantMutation } from './updateDefendantGql'

interface CreateDefendantMutationResponse {
  createDefendant: {
    id: string
  }
}

interface DeleteDefendantMutationResponse {
  deleteDefendant: {
    deleted: boolean
  }
}

export interface UpdateDefendantMutationResponse {
  updateDefendant: {
    id: string
  }
}

const useDefendants = () => {
  const { formatMessage } = useIntl()

  const [
    createDefendantMutation,
    { loading: isCreatingDefendant },
  ] = useMutation<CreateDefendantMutationResponse>(CreateDefendantMutation)
  const [
    deleteDefendantMutation,
  ] = useMutation<DeleteDefendantMutationResponse>(DeleteDefendantMutation)
  const [
    updateDefendantMutation,
  ] = useMutation<UpdateDefendantMutationResponse>(UpdateDefendantMutation)

  const createDefendant = useCallback(
    async (caseId: string, defendant: UpdateDefendantInput) => {
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

          if (data) {
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

        if (data?.deleteDefendant.deleted) {
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
    async (updateDefendant: UpdateDefendantInput) => {
      try {
        const { data } = await updateDefendantMutation({
          variables: {
            input: {
              ...updateDefendant,
            },
          },
        })

        if (data) {
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

  return {
    createDefendant,
    deleteDefendant,
    updateDefendant,
  }
}

export default useDefendants
