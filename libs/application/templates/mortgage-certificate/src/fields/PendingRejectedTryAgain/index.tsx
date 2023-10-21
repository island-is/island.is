import React, { FC, useEffect, useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Text,
  AlertMessage,
  SkeletonLoader,
  Button,
  Link,
} from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { PropertyDetail } from '@island.is/api/schema'
import { gql } from '@apollo/client'
import { VALIDATE_MORTGAGE_CERTIFICATE_QUERY } from '../../graphql/queries'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
export const validateCertificateQuery = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`

export const PendingRejectedTryAgain: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, refetch }) => {
  const { externalData } = application
  const { formatMessage } = useLocale()
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const [hasChangedState, setHasChangedState] = useState<boolean>(false)
  const [continuePolling, setContinuePolling] = useState(true)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  useEffect(() => {
    document.title = 'Beiðni um vinnslu'
  }, [])

  const { propertyDetails, validation } = externalData
    .validateMortgageCertificate?.data as {
    propertyDetails: PropertyDetail
    validation: { propertyNumber: string; isFromSearch: boolean }
  }

  const handleStateChangeAndRefetch = () => {
    if (!hasChangedState) {
      setHasChangedState(true)

      // Go to States.PAYMENT_INFO
      submitApplication({
        variables: {
          input: {
            id: application.id,
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

  // Note: we will validate on load here to display the error message,
  // because we cant trust that externalData.validateMortgageCertificate is recent enough.
  // But we will also use condition guard on "next" button to validate again
  // to control if user can continue
  const { data, error, loading } = useQuery(validateCertificateQuery, {
    variables: {
      input: {
        propertyNumber: validation?.propertyNumber,
        isFromSearch: validation?.isFromSearch,
      },
    },
    skip: !continuePolling,
    fetchPolicy: 'no-cache',
  })

  const validationData = data?.validateMortgageCertificate as {
    propertyNumber: string
    exists: boolean
    hasKMarking: boolean
  }

  useEffect(() => {
    if (!validationData?.propertyNumber) {
      return
    }

    setShowErrorMsg(false)
    setContinuePolling(false)

    if (validationData.exists && validationData.hasKMarking) {
      handleStateChangeAndRefetch()
    } else {
      setShowErrorMsg(true)
    }
  }, [validationData])

  if (error) {
    setShowErrorMsg(true)
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
        <Text fontWeight="semiBold">{formatMessage(m.selectedProperty)}</Text>
        <Text>
          {propertyDetails?.propertyNumber}
          {' - '}
          {propertyDetails?.defaultAddress?.display}
        </Text>
      </Box>
      {!loading && showErrorMsg ? (
        <Box paddingBottom={3}>
          <AlertMessage
            type="error"
            title={formatMessage(m.propertyCertificateError)}
            message={formatMessage(m.propertyCertificateErrorContactSheriff)}
          />
          <Box marginY={5} display="flex">
            <Button
              onClick={() => {
                window.open(
                  formatMessage(m.mortgageCertificateInboxLink),
                  '_blank',
                )
              }}
            >
              {formatMessage(m.mysites)}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <SkeletonLoader repeat={3} space={2} />
        </Box>
      )}
    </Box>
  )
}
