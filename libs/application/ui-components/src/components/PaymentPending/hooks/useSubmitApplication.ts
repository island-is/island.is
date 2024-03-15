import { MutationTuple, useMutation } from '@apollo/client'
import { DefaultEvents, Application } from '@island.is/application/types'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useCallback } from 'react'

export interface UseSubmitApplication {
  (params: {
    application: Application
    refetch: (() => void) | undefined
    event: DefaultEvents
  }): MutationTuple<
    void,
    {
      input: {
        id: Application['id']
        event: DefaultEvents
        answers: Application['answers']
      }
    }
  >
}

export const useSubmitApplication: UseSubmitApplication = ({
  application,
  refetch,
  event,
}) => {
  const [submitMutation, mutationState] = useMutation(SUBMIT_APPLICATION)

  const submit = useCallback(async () => {
    return submitMutation({
      variables: {
        input: {
          id: application.id,
          event,
          answers: application.answers,
        },
      },
      onError: (e) => console.error(e.message),
      onCompleted: () => {
        refetch?.()
      },
    })
  }, [submitMutation, application, refetch, event])

  return [submit, mutationState]
}
