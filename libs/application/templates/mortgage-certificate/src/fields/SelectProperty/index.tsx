import React, { FC, RefAttributes, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, AlertMessage, BoxProps } from '@island.is/island-ui/core'
import { PropertiesManager } from './PropertiesManager'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { VALIDATE_MORTGAGE_CERTIFICATE_QUERY } from '../../graphql/queries'

export const validateCertificateQuery = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`

export const SelectProperty: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData, answers } = application
  const [continuePolling, setContinuePolling] = useState(true)
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)

  const { formatMessage } = useLocale()

  //TODOx, dont look at externalData
  // const { validation } = externalData.validateMortgageCertificate?.data as {
  //   validation: {
  //     propertyNumber: string
  //     exists: boolean
  //     hasKMarking: boolean
  //   }
  // }

  // Note: we will validate on load here to display error message
  // (we cant trust that externalData.validateMortgageCertificate is recent enough)
  // but will also use condition guard on button to validate again
  const { data, error, loading } = useQuery(validateCertificateQuery, {
    variables: {
      input: {
        propertyNumber: '', //propertyDetails?.propertyNumber,
      },
    },
    skip: !continuePolling,
    fetchPolicy: 'no-cache',
  })

  const validation = data?.validateMortgageCertificate as {
    propertyNumber: string
    exists: boolean
    hasKMarking: boolean
  }

  if (!showErrorMsg && validation?.propertyNumber && !validation?.exists) {
    setShowErrorMsg(true)
  }

  // const scrollTo = (ref: any) => {
  //   if (ref) {
  //     ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
  //   }
  // }

  return (
    <>
      <PropertiesManager application={application} field={field} />
      {showErrorMsg ? (
        <Box /*ref={scrollTo}*/ paddingTop={5} paddingBottom={5}>
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
