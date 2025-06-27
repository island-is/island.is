import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationCreateEmailVerificationArgs,
} from '@island.is/api/schema'
import {
  CREATE_EMAIL_VERIFICATION,
  CREATE_ME_EMAIL_VERIFICATION,
} from '../../lib/mutations/createEmailVerification'

export type CreateEmailVerificationData = {
  email: string
}

export const useVerifyEmail = () => {
  const [createEmailVerificationMutation, { data, loading, error }] =
    useMutation<Mutation, MutationCreateEmailVerificationArgs>(
      CREATE_EMAIL_VERIFICATION,
    )

  const [
    createMeEmailVerificationMutation,
    { data: meData, loading: meLoading, error: meError },
  ] = useMutation<Mutation, MutationCreateEmailVerificationArgs>(
    CREATE_ME_EMAIL_VERIFICATION,
  )

  const createEmailVerification = (data: CreateEmailVerificationData) => {
    return createEmailVerificationMutation({
      variables: {
        input: {
          email: data.email,
        },
      },
    })
  }

  const createMeEmailVerification = (data: CreateEmailVerificationData) => {
    return createMeEmailVerificationMutation({
      variables: {
        input: { email: data.email },
      },
    })
  }

  return {
    createEmailVerification,
    createMeEmailVerification,
    data,
    loading,
    error,
    meData,
    meLoading,
    meError,
  }
}
