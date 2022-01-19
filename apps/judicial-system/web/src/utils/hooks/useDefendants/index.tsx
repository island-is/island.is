import { useMutation } from '@apollo/client'
import { Gender } from 'libs/judicial-system/types/src/lib/defendant'
import { UpdateDefendant } from 'libs/judicial-system/types/src/lib/defendant'
import { Defendant } from 'libs/judicial-system/types/src/lib/defendant'

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
  const [
    createDefendantMutation,
  ] = useMutation<CreateDefendantMutationResponse>(CreateDefendantMutation)
  const [
    deleteDefendantMutation,
  ] = useMutation<DeleteDefendantMutationResponse>(DeleteDefendantMutation)
  const [
    updateDefendantMutation,
  ] = useMutation<UpdateDefendantMutationResponse>(UpdateDefendantMutation)

  const createDefendant = async (caseId: string) => {
    return createDefendantMutation({
      variables: { input: { caseId } },
    })
  }

  const deleteDefendant = async (caseId: string, defendantId: string) => {
    return deleteDefendantMutation({
      variables: { input: { caseId, defendantId } },
    })
  }

  const updateDefendant = async (
    caseId: string,
    defendantId: string,
    updateDefendant: UpdateDefendant,
  ) => {
    return updateDefendantMutation({
      variables: { input: { caseId, defendantId, ...updateDefendant } },
    })
  }

  return {
    createDefendant,
    deleteDefendant,
    updateDefendant,
  }
}

export default useDefendants
