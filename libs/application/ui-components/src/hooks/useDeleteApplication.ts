import { useMutation } from '@apollo/client'
import { DELETE_APPLICATION } from '@island.is/application/graphql'
import { DELETE_APPLICATION as DELETE_FORM_SYSTEM_APPLICATION } from '@island.is/form-system/graphql'
import { handleServerError } from '../utilities/handleServerError'
import { useLocale } from '@island.is/localization'

export const useDeleteApplication = (
  refetch?: (() => void) | undefined,
  typeId?: string,
) => {
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
    error,
    loading,
  }
}
