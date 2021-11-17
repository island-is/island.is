import { gql, useMutation } from '@apollo/client'

export type CreateIslykillSettingsData = {
  email?: string
  mobile?: string
}

const CreateIslykillSettings = gql`
  mutation createIslykillSettings($input: CreateIslykillSettingsInput!) {
    createIslykillSettings(input: $input) {
      nationalId
    }
  }
`

export const useCreateIslykillSettings = () => {
  const [createIslykillMutation, { loading, error }] = useMutation(
    CreateIslykillSettings,
  )

  const createIslykillSettings = (data: CreateIslykillSettingsData) => {
    const input: CreateIslykillSettingsData = {}
    if (data.email) input.email = data.email
    if (data.mobile) input.mobile = data.mobile

    return createIslykillMutation({
      variables: {
        input,
      },
    })
  }

  return {
    createIslykillSettings,
    loading,
    error,
  }
}
