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

  const validationData = externalData.validateMortgageCertificate?.data as {
    exists: boolean
    hasKMarking: boolean
  }
  const certificateExists = validationData?.exists
  const hasKMarking = validationData?.hasKMarking

  const [stateName, setStateName] = useState<string>(MCEvents.PENDING)

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const handleStateChangeAndRefetch = (newStateName: string) => {
    if (stateName !== newStateName) {
      setStateName(newStateName)

      submitApplication({
        variables: {
          input: {
            id: applicationId,
            event: newStateName,
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
  }

  // no certificate found, we go to draft
  if (!certificateExists) {
    handleStateChangeAndRefetch(MCEvents.ERROR)
  }
  // certificate found, but no k marking found, we send to error state
  else if (certificateExists && !hasKMarking) {
    handleStateChangeAndRefetch(MCEvents.PENDING_REJECTED)
  }
  // otherwise if all is good, we send him to payment state
  else if (certificateExists && hasKMarking) {
    handleStateChangeAndRefetch(DefaultEvents.PAYMENT)
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
