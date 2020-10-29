import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationConfirmEmailVerificationArgs,
} from '@island.is/api/schema'
import { CONFIRM_EMAIL_VERIFICATION } from '../../lib/mutations/confirmEmailVerification'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export type ConfirmEmailVerificationData = {
  hash: string
}

export const useVerifyEmail = () => {
  const [confirmEmailVerificationMutation, { loading, error }] = useMutation<
    Mutation,
    MutationConfirmEmailVerificationArgs
  >(CONFIRM_EMAIL_VERIFICATION, {
    refetchQueries: [
      {
        query: USER_PROFILE,
      },
    ],
  })

  const confirmEmailVerification = (data: ConfirmEmailVerificationData) => {
    return confirmEmailVerificationMutation({
      variables: {
        input: {
          hash: data.hash,
        },
      },
    })
  }

  return {
    confirmEmailVerification,
    loading,
    error,
  }
}
