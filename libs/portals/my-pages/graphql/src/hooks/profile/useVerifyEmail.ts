import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationCreateEmailVerificationArgs,
} from '@island.is/api/schema'
import { CREATE_EMAIL_VERIFICATION } from '../../lib/mutations/createEmailVerification'

export type CreateEmailVerificationData = {
  email: string
}

export const useVerifyEmail = () => {
  const [
    createEmailVerificationMutation,
    { loading: createLoading, error: createError },
  ] = useMutation<Mutation, MutationCreateEmailVerificationArgs>(
    CREATE_EMAIL_VERIFICATION,
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

  return {
    createEmailVerification,
    createLoading,
    createError,
  }
}
