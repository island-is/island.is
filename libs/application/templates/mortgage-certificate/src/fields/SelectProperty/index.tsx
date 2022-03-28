import React, { FC, useEffect, useState, useRef } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, AlertMessage, SkeletonLoader } from '@island.is/island-ui/core'
import { PropertiesManager } from './PropertiesManager'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { VALIDATE_MORTGAGE_CERTIFICATE_QUERY } from '../../graphql/queries'

export const validateCertificateQuery = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`

export const SelectProperty: FC<FieldBaseProps> = ({ application, field }) => {
  const { externalData } = application
  const [continuePolling, setContinuePolling] = useState(true)
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const { formatMessage } = useLocale()
  const errorMessage = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { validation: oldValidation } =
    (externalData.validateMortgageCertificate?.data as {
      validation: {
        propertyNumber: string
        isFromSearch: boolean
      }
    }) || {}

  // Note: we will validate on load here to display the error message
  // (only if we have validated before, by pressing the "next" button),
  // because we cant trust that externalData.validateMortgageCertificate is recent enough.
  // But we will also use condition guard on "next" button to validate again
  // to control if user can continue
  if (oldValidation?.propertyNumber) {
    const { data, error, loading } = useQuery(validateCertificateQuery, {
      variables: {
        input: {
          propertyNumber: oldValidation?.propertyNumber,
          isFromSearch: oldValidation?.isFromSearch,
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
      setIsLoading(loading)
    }, [loading])

    useEffect(() => {
      if (!validationData?.propertyNumber) {
        return
      }

      setShowErrorMsg(false)
      setContinuePolling(false)

      if (!validationData.exists) {
        setShowErrorMsg(true)
      }
    }, [validationData])

    if (error) {
      setShowErrorMsg(true)
    }
  }

  useEffect(() => {
    if (errorMessage && errorMessage.current) {
      errorMessage.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [showErrorMsg])

  return (
    <>
      {isLoading ? (
        <Box paddingY={4}>
          <SkeletonLoader repeat={6} space={2} />
        </Box>
      ) : (
        <PropertiesManager application={application} field={field} />
      )}

      {showErrorMsg ? (
        <Box ref={errorMessage} paddingTop={5} paddingBottom={5}>
          <AlertMessage
            type="error"
            title={formatMessage(m.errorSheriffApiTitle)}
            message={formatMessage(m.errorSheriffApiMessage)}
          />
        </Box>
      ) : null}
    </>
  )
}
