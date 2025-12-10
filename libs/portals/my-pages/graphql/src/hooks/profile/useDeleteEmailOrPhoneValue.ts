import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationDeleteEmailOrPhoneArgs,
  DeleteEmailOrPhoneInput,
} from '@island.is/api/schema'
import { useUserProfile } from './useUserProfile'
import { DELETE_EMAIL_OR_PHONE_MUTATION } from '../../lib/mutations/updateEmailOrPhone'

export type DeleteEmailOrPhone = {
  email?: boolean
  mobilePhoneNumber?: boolean
}

export const useDeleteEmailOrPhoneValue = () => {
  const { data: userProfile } = useUserProfile()
  const [deleteEmailOrPhoneMutation, { loading, error }] = useMutation<
    Mutation,
    MutationDeleteEmailOrPhoneArgs
  >(DELETE_EMAIL_OR_PHONE_MUTATION)

  const deleteEmailOrPhoneValue = (data: DeleteEmailOrPhone) => {
    if (!userProfile)
      throw new Error(
        'User profile does not exist, one must be created before it can be updated',
      )

    const input: DeleteEmailOrPhoneInput = {}
    input.email = data.email
    input.mobilePhoneNumber = data.mobilePhoneNumber

    return deleteEmailOrPhoneMutation({
      variables: {
        input,
      },
    })
  }

  return {
    deleteEmailOrPhoneValue,
    loading,
    error,
  }
}
