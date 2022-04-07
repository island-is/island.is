import { MutationTuple, useMutation } from '@apollo/client'
import { Application } from '@island.is/application/core'
import { DELETE_APPLICATION } from '@island.is/application/graphql'

export interface UseDeleteApplication {
  (params: { application: Application }): MutationTuple<
    void,
    {
      input: {
        id: Application['id']
      }
    }
  >
}

export const useDeleteApplication = () => {
  const [deleteApplicationMutation, { error, loading }] = useMutation(
    DELETE_APPLICATION,
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
    loading,
    error,
  }
}
