import { useMutation } from '@apollo/client'

import { CreateDefendantMutation } from './createDefendantGql'
import { DeleteDefendantMutation } from './deleteDefendantGql'

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

const useDefendants = () => {
  const [
    createDefendantMutation,
  ] = useMutation<CreateDefendantMutationResponse>(CreateDefendantMutation)
  const [
    deleteDefendantMutation,
  ] = useMutation<DeleteDefendantMutationResponse>(DeleteDefendantMutation)

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

  return {
    createDefendant,
    deleteDefendant,
  }
}

export default useDefendants
