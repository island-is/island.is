import React, { FC, useState } from 'react'
import { FieldBaseProps, DefaultEvents } from '@island.is/application/core'
import {
  Box,
  Text,
  AlertMessage,
  Button,
  Divider,
} from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import { PropertyDetail } from '../../types/schema'
import { gql, useLazyQuery } from '@apollo/client'
import { VALIDATE_MORTGAGE_CERTIFICATE_QUERY } from '../../graphql/queries'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const validateCertificateMutation = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`

export const PendingRejectedTryAgain: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData } = application

  const { formatMessage } = useLocale()
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const [runEvent, setRunEvent] = useState<string | undefined>(undefined)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const selectedProperty = externalData.getPropertyDetails
    ?.data as PropertyDetail

  const handleStateChangeAndRefetch = (newRunEvent: string) => {
    if (runEvent !== newRunEvent) {
      setRunEvent(newRunEvent)

      submitApplication({
        variables: {
          input: {
            id: application.id,
            event: newRunEvent,
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

  const [runQuery, { loading }] = useLazyQuery(validateCertificateMutation, {
    variables: {
      input: {
        propertyNumber: selectedProperty?.propertyNumber,
      },
    },
    onCompleted(result) {
      setShowErrorMsg(false)

      const { exists, hasKMarking } = result.validateMortgageCertificate as {
        exists: boolean
        hasKMarking: boolean
      }

      if (!exists || !hasKMarking) {
        setShowErrorMsg(true)
      } else {
        handleStateChangeAndRefetch(DefaultEvents.PAYMENT)
      }
    },
    onError() {
      setShowErrorMsg(true)
    },
    fetchPolicy: 'no-cache',
  })

  const handleClickValidateMortgageCertificate = () => {
    runQuery()
  }

  return (
    <Box>
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
      <Box paddingBottom={3} hidden={loading || !showErrorMsg}>
        <AlertMessage
          type="error"
          title="Ekki gekk að sækja vottorð fyrir þessa eign"
          message="Vinsamlega hafðu samband við sýslumann, það er búið að senda inn beiðni um leiðréttingu"
        />
      </Box>

      <Divider />
      <Box
        paddingTop={5}
        paddingBottom={5}
        justifyContent="flexEnd"
        display="flex"
      >
        <Button
          onClick={() => handleClickValidateMortgageCertificate()}
          disabled={loading}
          icon="arrowForward"
        >
          {formatMessage(m.continue)}
        </Button>
      </Box>
    </Box>
  )
}
