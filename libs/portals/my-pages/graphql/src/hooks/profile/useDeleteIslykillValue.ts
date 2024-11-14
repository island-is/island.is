import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationDeleteIslykillValueArgs,
  DeleteIslykillValueInput,
} from '@island.is/api/schema'
import { useUserProfile } from './useUserProfile'
import { UPDATE_ISLYKILL_DELETE_INPUT } from '../../lib/mutations/updateIslykillSettings'

export type DeleteIslykillValue = {
  email?: boolean
  mobilePhoneNumber?: boolean
}

export const useDeleteIslykillValue = () => {
  const { data: userProfile } = useUserProfile()
  const [updateislykillMutation, { loading, error }] = useMutation<
    Mutation,
    MutationDeleteIslykillValueArgs
  >(UPDATE_ISLYKILL_DELETE_INPUT)

  const deleteIslykillValue = (data: DeleteIslykillValue) => {
    if (!userProfile)
      throw new Error(
        'User profile does not exist, one must be created before it can be updated',
      )

    const input: DeleteIslykillValueInput = {}
    input.email = data.email
    input.mobilePhoneNumber = data.mobilePhoneNumber

    return updateislykillMutation({
      variables: {
        input,
      },
    })
  }

  return {
    deleteIslykillValue,
    loading,
    error,
  }
}
