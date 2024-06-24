import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { AlertMessage, Box, LoadingDots, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { getValueViaPath } from '@island.is/application/core'
import { MortgageCertificateValidation, SelectedProperty } from '../../shared'
import { gql, useLazyQuery } from '@apollo/client'
import { VALIDATE_MORTGAGE_CERTIFICATE_QUERY } from '../../graphql/queries'

export const validateMortgageCertificateQuery = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`

export const PropertiesOverview: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const properties = getValueViaPath(
    application.answers,
    'selectedProperties.properties',
    [],
  ) as SelectedProperty[]
  const userEmail = getValueViaPath(
    application.externalData,
    'userProfile.data.email',
    '',
  ) as string
  const [propertiesShown, setPropertiesShown] = useState<
    (SelectedProperty & { exists: boolean; hasKMarking: boolean })[] | undefined
  >(undefined)
  const [incorrectPropertiesSent, setIncorrectPropertiesSent] = useState<
    SelectedProperty[]
  >(
    getValueViaPath(
      application.answers,
      'incorrectPropertiesSent',
      [],
    ) as SelectedProperty[],
  )

  const [runQuery, { loading }] = useLazyQuery(
    validateMortgageCertificateQuery,
    {
      onCompleted(result) {
        // setShowSearchError(false)
        const res =
          result.validateMortgageCertificate as MortgageCertificateValidation[]
        const newProperties = res.map(
          ({ propertyNumber, exists, hasKMarking }) => {
            const property = properties.find(
              (p) => p.propertyNumber === propertyNumber,
            )
            return {
              propertyNumber,
              propertyType: property?.propertyType ?? '',
              propertyName: property?.propertyName ?? '',
              exists,
              hasKMarking,
            }
          },
        )
        setPropertiesShown(newProperties)
        console.log(result)
        // setFoundProperties(result.searchForAllProperties)
      },
      onError() {
        // setShowSearchError(true)
        // setFoundProperties(undefined)
      },
    },
  )

  useEffect(() => {
    runQuery({
      variables: {
        input: {
          // Only call for properties that are potentially valid
          // and we have not asked Sýslumenn to fix yet
          properties: properties
            .filter(({ propertyNumber }) =>
              incorrectPropertiesSent.length > 0
                ? incorrectPropertiesSent.find(
                    (property) => propertyNumber !== property.propertyNumber,
                  )
                : true,
            )
            .map(({ propertyNumber, propertyType }) => {
              return {
                propertyNumber,
                propertyType,
              }
            }),
        },
      },
    })
  }, [])

  return (
    <Box paddingTop={1}>
      <Text variant="h4" paddingBottom={3}>
        {formatMessage(overview.general.description)}
      </Text>
      {!loading &&
        propertiesShown?.map((property, index) => {
          return (
            <Box paddingBottom={2} key={`${property.propertyNumber}-${index}`}>
              <InputController
                id={`${property.propertyNumber}-${index}`}
                label="Valin eign"
                defaultValue={property.propertyName}
                readOnly
                disabled={
                  property.hasKMarking === false || property.exists === false
                }
              />
            </Box>
          )
        })}
      {loading && (
        <Box display="flex" justifyContent="center" paddingTop={4}>
          <LoadingDots large />
        </Box>
      )}
      {!loading &&
        propertiesShown?.map((property, index) => {
          return (
            !property.hasKMarking &&
            property.exists && (
              <Box paddingTop={2} key={`${property.propertyNumber}-${index}`}>
                <AlertMessage
                  type="warning"
                  title={formatMessage(overview.labels.warningAlertTitle, {
                    propertyName: property.propertyName,
                  })}
                  message={formatMessage(overview.labels.warningAlertMessage, {
                    email: userEmail,
                  })}
                />
              </Box>
            )
          )
        })}
      {/* TODO: Add AlertMessage for all properties in propertiesShown that have exists or hasKMarking as false */}
    </Box>
  )
}
