import React, { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  CustomField,
  FieldBaseProps,
  formatText,
  DefaultEvents,
} from '@island.is/application/core'
import {
  Box,
  Button,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { m } from '../../lib/messages'

interface Props extends FieldBaseProps {
  field: CustomField
}

export const SubmitAndDelegate: FC<Props> = ({
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
        .catch((e) => {
          setSubmitError(true)
        })
    }
  }, [called, application.answers, applicationId, refetch, submitApplication])

  if (submitError) {
    return (
      <Stack space={2}>
        <Text variant="h3">
          {formatText(m.errorUnknown, application, formatMessage)}
        </Text>
        <Button onClick={() => refetch?.()}>
          {formatText(m.errorTryAgain, application, formatMessage)}
        </Button>
      </Stack>
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
