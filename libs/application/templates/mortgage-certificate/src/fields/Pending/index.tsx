import React, { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { FieldBaseProps, DefaultEvents } from '@island.is/application/core'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { States } from '../../lib/constants'

export const Pending: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const applicationId = application.id

  const [stateName, setStateName] = useState<string | undefined>(undefined)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const newStateName = States.PENDING
  if (stateName !== newStateName) {
    setStateName(newStateName)
    submitApplication({
      variables: {
        input: {
          id: applicationId,
          event: DefaultEvents.SUBMIT,
          answers: application.answers,
        },
      },
    })
      .then(({ data, errors } = {}) => {
        if (data && !errors?.length) {
          // Takes them to the next state (which loads the relevant form)

          refetch?.()
        } else {
          return Promise.reject()
        }
      })
      .catch(() => {})
  }

  return (
    <Box
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <LoadingDots large />
    </Box>
  )
}
