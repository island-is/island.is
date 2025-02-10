import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationCreateSmsVerificationArgs,
} from '@island.is/api/schema'
import { CREATE_SMS_VERIFICATION } from '../../lib/mutations/createSmsVerification'

export type CreateSmsVerificationData = {
  mobilePhoneNumber: string
}

export const useVerifySms = () => {
  const [
    createSmsVerificationMutation,
    { loading: createLoading, error: createError },
  ] = useMutation<Mutation, MutationCreateSmsVerificationArgs>(
    CREATE_SMS_VERIFICATION,
  )

  const createSmsVerification = (data: CreateSmsVerificationData) => {
    return createSmsVerificationMutation({
      variables: {
        input: {
          mobilePhoneNumber: data.mobilePhoneNumber,
        },
      },
    })
  }

  return {
    createSmsVerification,
    createLoading,
    createError,
  }
}
