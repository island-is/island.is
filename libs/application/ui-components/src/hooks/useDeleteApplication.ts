import { useMutation } from '@apollo/client'
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

  const deleteApplication = (applicationId: string) => {
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
