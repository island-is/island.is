import React, { FC, useEffect, useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  AlertMessage,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { PropertyDetail } from '../../types/schema'
import { gql } from '@apollo/client'
import { VALIDATE_MORTGAGE_CERTIFICATE_QUERY } from '../../graphql/queries'

export const validateCertificateQuery = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`

export const PendingRejectedTryAgain: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData } = application

  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const [hasChangedState, setHasChangedState] = useState<boolean>(false)
  const [continuePolling, setContinuePolling] = useState(true)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const { propertyDetails } = externalData.validateMortgageCertificate
    ?.data as {
    propertyDetails: PropertyDetail
  }

  const handleStateChangeAndRefetch = () => {
    if (!hasChangedState) {
      setHasChangedState(true)

      // Go to States.PAYMENT_INFO
      // Note: we will validate on load here to display error message
      // but will also use condition guard on button to validate again
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

  const { data, error, loading } = useQuery(validateCertificateQuery, {
    variables: {
      input: {
        propertyNumber: propertyDetails?.propertyNumber,
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
        <Text fontWeight="semiBold">Valin fasteign</Text>
        <Text>
          {propertyDetails?.propertyNumber}{' '}
          {propertyDetails?.defaultAddress?.display}
        </Text>
      </Box>
      {!loading && showErrorMsg ? (
        <Box paddingBottom={3}>
          <AlertMessage
            type="error"
            title="Ekki gekk að sækja vottorð fyrir þessa eign"
            message="Vinsamlega hafðu samband við sýslumann, það er búið að senda inn beiðni um leiðréttingu"
          />
        </Box>
      ) : (
        <Box>
          <SkeletonLoader repeat={3} space={2} />
        </Box>
      )}
    </Box>
  )
}
