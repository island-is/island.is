import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import {
  Box,
  Text,
  AlertMessage,
  Button,
  Link,
} from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { MCEvents } from '../../lib/constants'
import { useMutation } from '@apollo/client'
import { PropertyDetail } from '../../types/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const PendingRejected: FC<FieldBaseProps> = ({ application, field }) => {
  const { externalData } = application
  const { answers } = application
  const { formatMessage } = useLocale()

  const [stateName, setStateName] = useState<string>(MCEvents.PENDING_REJECTED)

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const handleStateChange = (newStateName: string) => {
    if (stateName !== newStateName) {
      setStateName(newStateName)

      submitApplication({
        variables: {
          input: {
            id: application.id,
            event: newStateName,
            answers: application.answers,
          },
        },
      })
    }
  }

  const hasSentRequest = (externalData?.submitRequestToSyslumenn?.data as {
    hasSentRequest: boolean
  }).hasSentRequest

  if (hasSentRequest) {
    handleStateChange(MCEvents.PENDING_REJECTED_TRY_AGAIN)
  }

  const selectedProperty = (externalData.validateMortgageCertificate.data as {
    property?: PropertyDetail
  })?.property

  return (
    <Box>
      <Text variant="h2" marginBottom={4}>
        Upplýsingar um eign
      </Text>

      <Box
        borderRadius="standard"
        background={'blue100'}
        paddingX={2}
        paddingY={1}
        marginBottom={5}
      >
        <Text fontWeight="semiBold">Valin fasteign</Text>
        <Text>
          {selectedProperty?.propertyNumber}{' '}
          {selectedProperty?.defaultAddress?.display}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <AlertMessage
          type="warning"
          title={formatMessage(m.propertyErrorCertificateTitle)}
          message={formatMessage(m.propertyErrorCertificateMessage)}
        />
      </Box>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title={formatMessage(m.propertyErrorCertificateSheriffTitle)}
          message={formatMessage(m.propertyErrorCertificateSheriffMessage)}
        />
      </Box>
      <Box display="flex" justifyContent={'flexEnd'}>
        <Link href="https://minarsidur.island.is/">
          <Button variant="primary" icon="arrowForward">
            {formatMessage(m.mysites)}
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
