import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationConfirmEmailVerificationArgs,
  MutationCreateEmailVerificationArgs,
} from '@island.is/api/schema'
import { CONFIRM_EMAIL_VERIFICATION } from '../../lib/mutations/confirmEmailVerification'
import { CREATE_EMAIL_VERIFICATION } from '../../lib/mutations/createEmailVerification'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export type CreateEmailVerificationData = {
  email: string
}

export type ConfirmEmailVerificationData = {
  hash: string
}

export const useVerifyEmail = () => {
  const [
    createEmailVerificationMutation,
    { loading: createLoading, error: createError },
  ] = useMutation<Mutation, MutationCreateEmailVerificationArgs>(
    CREATE_EMAIL_VERIFICATION,
  )

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

  const createEmailVerification = (data: CreateEmailVerificationData) => {
    return createEmailVerificationMutation({
      variables: {
        input: {
          email: data.email,
        },
      },
    })
  }

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
    createEmailVerification,
    createLoading,
    createError,
  }
}
