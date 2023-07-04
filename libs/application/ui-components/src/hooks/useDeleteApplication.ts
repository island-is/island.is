import { useMutation } from '@apollo/client'
import { DELETE_APPLICATION } from '@island.is/application/graphql'

export const useDeleteApplication = (refetch?: (() => void) | undefined) => {
  const [deleteApplicationMutation, { error, loading }] = useMutation(
    DELETE_APPLICATION,
    {
      onCompleted: () => {
        refetch?.()
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
