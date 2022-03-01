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

  const validationData = externalData.validateMortgageCertificate.data as {
    exists: boolean
    hasKMarking: boolean
  }
  const certificateExists = validationData.exists
  const hasKMarking = validationData.hasKMarking

  const [stateName, setStateName] = useState<string>(MCEvents.PENDING)

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  // no certificate found, we go to draft
  if (!certificateExists && stateName !== MCEvents.ERROR) {
    // to make sure you only call submitApplication once
    setStateName(MCEvents.ERROR)

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
      .catch(() => {})
  }

  // certificate found, but no k marking found, we send to error state
  if (
    certificateExists &&
    !hasKMarking &&
    stateName !== MCEvents.PENDING_REJECTED
  ) {
    // to make sure you only call submitApplication once
    setStateName(MCEvents.PENDING_REJECTED)

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
      .catch(() => {})
  }

  // otherwise if all is good, we send him to payment state
  if (certificateExists && hasKMarking && stateName !== DefaultEvents.PAYMENT) {
    // to make sure you only call submitApplication once
    setStateName(DefaultEvents.PAYMENT)

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
