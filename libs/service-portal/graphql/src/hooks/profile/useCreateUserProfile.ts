import { useMutation } from '@apollo/client'
import {
  CreateUserProfileInput,
  Mutation,
  MutationCreateProfileArgs,
} from '@island.is/api/schema'
import { Locale } from '@island.is/shared/types'
import { CREATE_USER_PROFILE } from '../../lib/mutations/createUserProfile'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export type CreateUserProfileData = {
  email?: string
  locale?: Locale
  mobilePhoneNumber?: string
  canNudge?: boolean
  emailStatus?: string
  mobileStatus?: string
  emailCode?: string
  smsCode?: string
}

export const useCreateUserProfile = () => {
  const [createUserProfileMutation, { loading, error }] = useMutation<
    Mutation,
    MutationCreateProfileArgs
  >(CREATE_USER_PROFILE, {
    refetchQueries: [
      {
        query: USER_PROFILE,
      },
    ],
  })

  const createUserProfile = (data: CreateUserProfileData) => {
    // API only accepts the values as optional and not as null fields
    // so we have to build the object dynamically
    const input: CreateUserProfileInput = {}
    if (data.email) input.email = data.email
    if (data.locale) input.locale = data.locale
    if (data.mobilePhoneNumber) input.mobilePhoneNumber = data.mobilePhoneNumber
    if (data.canNudge !== undefined) input.canNudge = data.canNudge
    if (data.emailStatus) input.emailStatus = data.emailStatus
    if (data.mobileStatus) input.mobileStatus = data.mobileStatus
    if (data.emailCode) input.emailCode = data.emailCode
    if (data.smsCode) input.smsCode = data.smsCode

    return createUserProfileMutation({
      variables: {
        input,
      },
    })
  }

  return {
    createUserProfile,
    loading,
    error,
  }
}
