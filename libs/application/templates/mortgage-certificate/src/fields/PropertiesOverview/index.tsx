import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { MortgageCertificateValidation, SelectedProperty } from '../../shared'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import {
  REQUEST_CORRECTION_ON_MORTGAGE_CERTIFICATE_QUERY,
  VALIDATE_MORTGAGE_CERTIFICATE_QUERY,
} from '../../graphql/queries'
import {
  concatPropertyList,
  getIdentityData,
  getUserProfileData,
} from '../../util'
import { useFormContext } from 'react-hook-form'

export const validateMortgageCertificateQuery = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`
export const requestCorrectionOnMortgageCertificateQuery = gql`
  ${REQUEST_CORRECTION_ON_MORTGAGE_CERTIFICATE_QUERY}
`

export const PropertiesOverview: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setBeforeSubmitCallback }) => {
  const { formatMessage, locale } = useLocale()
  const { setValue } = useFormContext()
  const properties = getValueViaPath(
    application.answers,
    'selectedProperties.properties',
    [],
  ) as SelectedProperty[]

  const identityData = getIdentityData(application)
  const userProfileData = getUserProfileData(application)

  const [errorValidating, setErrorValidating] = useState<boolean>(false)
  const [errorSendingCorrection, setErrorSendingCorrection] =
    useState<boolean>(false)
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

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [runValidationQuery, { loading }] = useLazyQuery(
    validateMortgageCertificateQuery,
    {
      async onCompleted(result) {
        setErrorValidating(false)
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

        const updatedIncorrectPropertiesSent = [] as SelectedProperty[]
        incorrectPropertiesSent.forEach((property) => {
          const newProperty = newProperties.find(
            (p) => p.propertyNumber === property.propertyNumber,
          )
          if (
            newProperty &&
            (!newProperty.exists || !newProperty.hasKMarking)
          ) {
            updatedIncorrectPropertiesSent.push(property)
          }
        })
        // We will update here too in case there will be an error from service
        // so the user cannot pay for it.
        setValue('incorrectPropertiesSent', updatedIncorrectPropertiesSent)
        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                ...application.answers,
                incorrectPropertiesSent: updatedIncorrectPropertiesSent,
              },
            },
            locale,
          },
        }).then(() => {
          setIncorrectPropertiesSent(updatedIncorrectPropertiesSent)
        })

        setPropertiesShown(newProperties)
      },
      onError() {
        setErrorValidating(true)
      },
    },
  )

  const [runCorrectionQuery, { loading: loadingCorrection }] = useLazyQuery(
    requestCorrectionOnMortgageCertificateQuery,
  )

  useEffect(() => {
    runValidationQuery({
      variables: {
        input: {
          properties: properties.map(({ propertyNumber, propertyType }) => {
            return {
              propertyNumber,
              propertyType,
            }
          }),
        },
      },
    })
  }, [])

  useEffect(() => {
    propertiesShown?.map((property) => {
      if (
        property.exists &&
        !property.hasKMarking &&
        !incorrectPropertiesSent.find(
          ({ propertyNumber }) => property.propertyNumber === propertyNumber,
        )
      ) {
        runCorrectionQuery({
          variables: {
            input: {
              propertyNumber: property.propertyNumber,
              identityData: identityData,
              userProfileData: userProfileData,
            },
          },
        }).then(async (res) => {
          if (
            res.data?.requestCorrectionOnMortgageCertificate?.hasSentRequest
          ) {
            setErrorSendingCorrection(false)
            setValue(
              'incorrectPropertiesSent',
              concatPropertyList(incorrectPropertiesSent, property),
            )
            await updateApplication({
              variables: {
                input: {
                  id: application.id,
                  answers: {
                    ...application.answers,
                    incorrectPropertiesSent: concatPropertyList(
                      incorrectPropertiesSent,
                      property,
                    ),
                  },
                },
                locale,
              },
            }).then(() => {
              setIncorrectPropertiesSent((prevIncorretPropertiesSent) =>
                concatPropertyList(prevIncorretPropertiesSent, property),
              )
            })
          } else {
            setErrorSendingCorrection(true)
          }
        })
      }
    })
  }, [propertiesShown])

  setBeforeSubmitCallback?.(async () => {
    const properties = propertiesShown
      ?.filter((property) => property.exists && property.hasKMarking)
      .map((property) => {
        return {
          propertyName: property.propertyName,
          propertyNumber: property.propertyNumber,
          propertyType: property.propertyType,
        }
      })
    if (
      !loading &&
      !loadingCorrection &&
      !errorValidating &&
      !errorSendingCorrection &&
      properties?.length !== 0
    ) {
      return [true, null]
    }
    if (
      !loading &&
      !loadingCorrection &&
      !errorValidating &&
      properties?.length !== 0 &&
      errorSendingCorrection
    ) {
      // If there was no error validating the properties but had problem sending correction
      // to sýslumenn, then we will update the list of properties on continue, and remove properties that
      // do not exist and/or have k marking
      // If all properties were invalid then the user will not be able to continue
      setValue('selectedProperties.properties', properties)
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              selectedProperties: {
                properties: properties,
              },
            },
          },
          locale,
        },
      })
    }
    return [false, '']
  })

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
        <SkeletonLoader
          height={76}
          repeat={properties.length}
          space={1}
          borderRadius="xs"
        />
      )}
      {!loading &&
        propertiesShown?.map((property, index) => {
          return (
            (!property.hasKMarking || !property.exists) && (
              <Box paddingTop={2} key={`${property.propertyNumber}-${index}`}>
                <AlertMessage
                  type="warning"
                  title={formatMessage(overview.labels.warningAlertTitle, {
                    propertyName: property.propertyName,
                  })}
                  message={formatMessage(overview.labels.warningAlertMessage)}
                />
              </Box>
            )
          )
        })}
      {!loading &&
        !loadingCorrection &&
        !errorSendingCorrection &&
        incorrectPropertiesSent.map((property, index) => {
          return (
            <Box paddingTop={2} key={`incorrect-properties-${index}`}>
              <AlertMessage
                type="success"
                title={formatMessage(overview.labels.successAlertTitle, {
                  propertyName: property.propertyName,
                })}
                message={formatMessage(overview.labels.successAlertMessage)}
              />
            </Box>
          )
        })}
      {loadingCorrection && (
        <Box paddingTop={3}>
          <Text variant="h4" paddingBottom={2}>
            {formatMessage(overview.labels.fetchingCorrectionMessage)}
          </Text>
          <LoadingDots />
        </Box>
      )}
      {!loading &&
        !loadingCorrection &&
        (errorValidating || errorSendingCorrection) && (
          <Box paddingTop={2}>
            <AlertMessage
              type="error"
              title={formatMessage(overview.labels.errorAlertTitle)}
              action={
                <Box paddingTop={1}>
                  <Button
                    colorScheme="destructive"
                    iconType="filled"
                    preTextIconType="filled"
                    size="small"
                    variant="primary"
                    onClick={() => history.go(0)}
                  >
                    {formatMessage(overview.labels.errorAlertMessage)}
                  </Button>
                </Box>
              }
            />
          </Box>
        )}
    </Box>
  )
}
