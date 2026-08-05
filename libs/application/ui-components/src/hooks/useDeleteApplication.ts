import { gql, useMutation } from '@apollo/client'
import { DELETE_APPLICATION } from '@island.is/application/graphql'
import { handleServerError } from '../utilities/handleServerError'
import { useLocale } from '@island.is/localization'

export const useDeleteApplication = (refetch?: (() => void) | undefined) => {
  const { formatMessage } = useLocale()
  const [deleteApplicationMutation, { error, loading }] = useMutation(
    DELETE_APPLICATION,
    {
      onCompleted: () => {
        refetch?.()
      },
      onError: (error) => {
        handleServerError(error, formatMessage)
      },
    },
  )
  const [
    deleteFormSystemApplicationMutation,
    { error: formSystemError, loading: formSystemLoading },
  ] = useMutation(DELETE_FORM_SYSTEM_APPLICATION, {
    onCompleted: () => {
      refetch?.()
    },
    onError: (formSystemError) => {
      handleServerError(formSystemError, formatMessage)
    },
  })

  const deleteApplication = (applicationId: string, typeId?: string) => {
    if (typeId === '') {
      return deleteFormSystemApplicationMutation({
        variables: {
          input: applicationId,
        },
      })
    }
    return deleteApplicationMutation({
      variables: {
        input: {
          id: applicationId,
        },
      },
    })
  }

  return {
    deleteApplication,
    error: error || formSystemError,
    loading: loading || formSystemLoading,
  }
}

export const DELETE_FORM_SYSTEM_APPLICATION = gql`
  mutation DeleteFormSystemApplication($input: String!) {
    deleteFormSystemApplication(input: $input)
  }
`
