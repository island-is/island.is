import { useMutation } from '@apollo/client'
import { DefaultEvents, Application } from '@island.is/application/core'
import { SUBMIT_APPLICATION } from './queries.graphql'

export interface UseSubmitApplication {
  (params: {
    application: Application
    refetch: (() => void) | undefined
    event?: DefaultEvents
  }): () => void
}

export const useSubmitApplication: UseSubmitApplication = ({
  application,
  refetch,
  event = DefaultEvents.SUBMIT,
}) => {
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
    onCompleted: () => {
      refetch?.()
    },
    variables: {
      input: {
        id: application.id,
        event,
        answers: application.answers,
      },
    },
  })

  return submitApplication
}
