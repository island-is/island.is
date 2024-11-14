import { useMutation } from '@apollo/client'
import { Mutation } from '@island.is/api/schema'
import { RESEND_EMAIL_VERIFICATION } from '../../lib/mutations/resendEmailVerification'

export const useResendEmailVerification = () => {
  const [resendEmailVerificationMutation, { loading, error }] = useMutation<
    Mutation,
    {}
  >(RESEND_EMAIL_VERIFICATION)

  const resendEmailVerification = () => {
    return resendEmailVerificationMutation()
  }

  return {
    resendEmailVerification,
    loading,
    error,
  }
}
