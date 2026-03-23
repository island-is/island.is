import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { FieldBaseProps, DefaultEvents } from '@island.is/application/types'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

export const ConfirmationPendingField: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, refetch }) => {
  const applicationId = application.id

  const [finishSubmit, setFinishSubmit] = useState<boolean>(false)

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const handleStateChangeAndRefetch = () => {
    if (!finishSubmit) {
      setFinishSubmit(true)

      submitApplication({
        variables: {
          input: {
            id: applicationId,
            event: DefaultEvents.SUBMIT,
            answers: application.answers,
          },
        },
      }).then(({ data, errors } = {}) => {
        if (data && !errors?.length) {
          // Takes them to the next state (which loads the relevant form)
          refetch?.()
        } else {
          return Promise.reject()
        }
      })
    }
  }

  // manually call submit event
  handleStateChangeAndRefetch()

  return (
    <Box
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <LoadingDots size="large" />
    </Box>
  )
}
