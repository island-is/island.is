import React, { FC, useEffect, useState } from 'react'
import {
  FieldBaseProps,
  getValueViaPath,
  DefaultEvents,
} from '@island.is/application/core'
import {
  Box,
  Text,
  AlertMessage,
  Button,
  Link,
  Divider,
} from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { MCEvents } from '../../lib/constants'
import { useMutation } from '@apollo/client'
import { PropertyDetail } from '../../types/schema'
import { gql, useLazyQuery } from '@apollo/client'
import { VALIDATE_MORTGAGE_CERTIFICATE_QUERY } from '../../graphql/queries'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const searchRealEstateMutation = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`

export const PendingRejectedTryAgain: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData } = application
  const { answers } = application

  const { formatMessage } = useLocale()
  const [showSearchError, setShowSearchError] = useState<boolean>(false)
  const [stateName, setStateName] = useState<string>(
    MCEvents.PENDING_REJECTED_TRY_AGAIN,
  )
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const selectedProperty = (externalData.validateMortgageCertificate.data as {
    property?: PropertyDetail
  })?.property

  const handleStateChangeAndRefetch = (newStateName: string) => {
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

  const [runQuery, { loading }] = useLazyQuery(searchRealEstateMutation, {
    variables: {
      input: {
        propertyNumber: selectedProperty?.propertyNumber,
      },
    },
    onCompleted(result) {
      setShowSearchError(false)

      const { exists, hasKMarking } = result.validateMortgageCertificate as {
        exists: boolean
        hasKMarking: boolean
      }

      if (!exists || !hasKMarking) {
        setShowSearchError(true)
      } else {
        handleStateChangeAndRefetch(DefaultEvents.PAYMENT)
      }
    },
    onError() {
      setShowSearchError(true)
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
      <Box paddingBottom={3} hidden={loading || !showSearchError}>
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
