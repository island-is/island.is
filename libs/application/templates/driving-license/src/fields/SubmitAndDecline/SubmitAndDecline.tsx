import React, { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { formatText } from '@island.is/application/core'
import {
  CustomField,
  FieldBaseProps,
  DefaultEvents,
} from '@island.is/application/types'
import { Box, Button, LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { m } from '../../lib/messages'

interface Props extends FieldBaseProps {
  field: CustomField
}

export const SubmitAndDecline: FC<React.PropsWithChildren<Props>> = ({
  error,
  application,
  refetch,
}) => {
  const applicationId = application.id
  const { formatMessage } = useLocale()
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
    return (
      <Box>
        <Text variant="h3">
          {formatText(m.submitErrorTitle, application, formatMessage)}
        </Text>
        <Text marginBottom="p2">
          {formatText(m.submitErrorMessage, application, formatMessage)}
        </Text>
        <Button onClick={() => refetch?.()}>
          {formatText(m.submitErrorButtonCaption, application, formatMessage)}
        </Button>
      </Box>
    )
  }

  return (
    <>
      {error && { error }}
      <Box height="full">
        <LoadingDots large />
      </Box>
    </>
  )
}
