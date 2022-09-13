import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import {
  Mutation,
  MutationCreateEmailVerificationArgs,
} from '@island.is/api/schema'

export type CreateEmailVerificationData = {
  email: string
}

export const CREATE_EMAIL_VERIFICATION = gql`
  mutation createEmailVerification($input: CreateEmailVerificationInput!) {
    createEmailVerification(input: $input) {
      created
    }
  }
`

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
