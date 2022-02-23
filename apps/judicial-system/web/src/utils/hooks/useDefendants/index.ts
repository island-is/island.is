import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import { UpdateDefendant } from '@island.is/judicial-system/types'

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

  const createDefendant = async (
    caseId: string,
    defendant: UpdateDefendant,
  ) => {
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
  }

  const deleteDefendant = async (caseId: string, defendantId: string) => {
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
  }

  const updateDefendant = async (
    caseId: string,
    defendantId: string,
    updateDefendant: UpdateDefendant,
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

      if (data) {
        return true
      } else {
        return false
      }
    } catch (error) {
      toast.error(formatMessage(errors.updateDefendant))
    }
  }

  return {
    createDefendant,
    deleteDefendant,
    updateDefendant,
  }
}

export default useDefendants
