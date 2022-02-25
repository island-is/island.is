import React, { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { FieldBaseProps, DefaultEvents } from '@island.is/application/core'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { MCEvents } from '../../lib/constants'

export const Pending: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData } = application
  const applicationId = application.id
  const [kMarked, setKMarked] = useState<boolean>(true)
  const [certificate, setCertificate] = useState<boolean>(true)
  const [submitError, setSubmitError] = useState<boolean>(false)

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  useEffect(() => {
    // no k mark nor certificate we go to draft
    if (!kMarked && !certificate) {
      submitApplication({
        variables: {
          input: {
            id: applicationId,
            event: MCEvents.ERROR,
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

    // no certificate found we send to error state
    if (!kMarked && certificate) {
      submitApplication({
        variables: {
          input: {
            id: applicationId,
            event: MCEvents.PENDING_REJECTED,
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

    if (kMarked && certificate) {
      // otherwise if all is good we send him to payment state
      submitApplication({
        variables: {
          input: {
            id: applicationId,
            event: DefaultEvents.PAYMENT,
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
  }, [kMarked, certificate])

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
