import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { LGFieldBaseProps } from '../lib/types'
import { DefaultEvents } from '@island.is/application/types'
import { Button, Inline, Select, Stack, toast } from '@island.is/island-ui/core'
import { useState } from 'react'

// This component is only used for development purposes
export const SubmitApplication = ({
  application,
  refetch,
}: LGFieldBaseProps) => {
  const [event, setEvent] = useState<DefaultEvents | null>(DefaultEvents.SUBMIT)
  const options = Object.entries(DefaultEvents).map(([key, value]) => ({
    label: key,
    value,
  }))

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    variables: {
      input: {
        id: application.id,
        answers: application.answers,
        event: event,
      },
    },
  })

  const handleSubmit = async () => {
    submitApplication({
      onCompleted: () => {
        refetch?.()
      },
      onError: (error) => {
        toast.error(
          error.graphQLErrors
            .map((e) => (e.extensions.problem as any)?.detail)
            .join(', '),
          {
            toastId: 'submit-application-error',
          },
        )
      },
    })
  }

  if (process.env.NODE_ENV === 'development') {
    return (
      <Inline alignY="center" space={2}>
        <Select
          size="xs"
          defaultValue={options.find(
            (opt) => opt.value === DefaultEvents.SUBMIT,
          )}
          options={options}
          onChange={(opt) => {
            setEvent(opt ? (opt.value as DefaultEvents) : null)
          }}
        />
        <Button size="small" disabled={event === null} onClick={handleSubmit}>
          Submit
        </Button>
      </Inline>
    )
  }

  return null
}

export default SubmitApplication
