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

  const deleteApplication = (application: Application) => {
    return deleteApplicationMutation({
      variables: {
        input: {
          id: application.id,
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
