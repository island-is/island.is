import { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  CustomField,
  FieldBaseProps,
  DefaultEvents,
} from '@island.is/application/types'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

interface Props extends FieldBaseProps {
  field: CustomField
}

export const SubmitAndDecline: FC<React.PropsWithChildren<Props>> = ({
  error,
  application,
  refetch,
}) => {
  const applicationId = application.id
  const [submitError, setSubmitError] = useState(false)

  const [submitApplication, { called }] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  // submit and go to "declined" state
  useEffect(() => {
    if (!called) {
      submitApplication({
        variables: {
          input: {
            id: applicationId,
            event: DefaultEvents.REJECT,
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
        .catch(() => {
          setSubmitError(true)
        })
    }
  }, [called, application.answers, applicationId, refetch, submitApplication])

  if (submitError) {
    return <Box></Box>
  }

  return (
    <>
      {error && { error }}
      <Box height="full">
        <LoadingDots size="large" />
      </Box>
    </>
  )
}
