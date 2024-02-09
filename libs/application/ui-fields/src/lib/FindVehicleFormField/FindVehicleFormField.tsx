import {
  Box,
  Button,
  SkeletonLoader,
  AlertMessage,
  ActionCard,
  Bullet,
  BulletList,
  InputError,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import {
  VehicleOperatorChangeChecksByPermno,
  VehicleOwnerchangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
  VehicleValidationErrorMessage,
} from '@island.is/api/schema'
import { FieldBaseProps, FindVehicleField } from '@island.is/application/types'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { FC, useEffect, useState } from 'react'

interface VehicleDetails {
  permno: string
  make: string
  color: string
  isDebtLess?: boolean
  validationErrorMessages?: VehicleValidationErrorMessage[]
  requireMilage?: boolean
}

interface Props extends FieldBaseProps {
  field: FindVehicleField
}

function isVehicleOwnerchangeChecksByPermno(
  response: unknown,
): response is VehicleOwnerchangeChecksByPermno {
  return (
    response !== null &&
    typeof response === 'object' &&
    '__typename' in response &&
    response['__typename'] === 'VehicleOwnerchangeChecksByPermno'
  )
}

function isVehiclePlateOrderChecksByPermno(
  response: unknown,
): response is VehiclePlateOrderChecksByPermno {
  return (
    response !== null &&
    typeof response === 'object' &&
    '__typename' in response &&
    response['__typename'] === 'VehiclePlateOrderChecksByPermno'
  )
}

function isVehicleOperatorChangeChecksByPermno(
  response: unknown,
): response is VehicleOperatorChangeChecksByPermno {
  return (
    response !== null &&
    typeof response === 'object' &&
    '__typename' in response &&
    response['__typename'] === 'VehicleOperatorChangeChecksByPermno'
  )
}

function extractVehicleDetails(
  response:
    | VehicleOwnerchangeChecksByPermno
    | VehiclePlateOrderChecksByPermno
    | VehicleOperatorChangeChecksByPermno,
): VehicleDetails {
  // Use type guards to determine the response type and access properties safely
  if (isVehicleOwnerchangeChecksByPermno(response)) {
    return {
      permno: response.basicVehicleInformation?.permno || '',
      make: response.basicVehicleInformation?.make || '',
      color: response.basicVehicleInformation?.color || '',
      isDebtLess: response.isDebtLess ?? true,
      validationErrorMessages: response.validationErrorMessages ?? [],
      requireMilage: response.basicVehicleInformation?.requireMileage || false,
    }
  } else if (isVehiclePlateOrderChecksByPermno(response)) {
    return {
      permno: response.basicVehicleInformation?.permno || '',
      make: response.basicVehicleInformation?.make || '',
      color: response.basicVehicleInformation?.color || '',
      requireMilage: response.basicVehicleInformation?.requireMileage || false,
    }
  } else if (isVehicleOperatorChangeChecksByPermno(response)) {
    return {
      permno: response.basicVehicleInformation?.permno || '',
      make: response.basicVehicleInformation?.make || '',
      color: response.basicVehicleInformation?.color || '',
      isDebtLess: response.isDebtLess ?? true,
      validationErrorMessages: response.validationErrorMessages ?? [],
      requireMilage: response.basicVehicleInformation?.requireMileage || false,
    }
  } else {
    // Handle unexpected response types
    throw new Error('Unexpected response type')
  }
}

export const FindVehicleFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  errors,
  setFieldLoadingState,
  setSubmitButtonDisabled,
}) => {
  const {
    getVehicleDetails,
    additionalErrors,
    findPlatePlaceholder,
    findVehicleButtonText,
    notFoundErrorMessage,
    notFoundErrorTitle,
    fallbackErrorMessage,
    validationErrors,
    hasErrorTitle,
    isNotDebtLessTag,
    requiredValidVehicleErrorMessage,
  } = field

  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [vehicleNotFound, setVehicleNotFound] = useState<boolean>()
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(
    null,
  )
  const [submitButtonDisabledCalled, setSubmitButtonDisabledCalled] =
    useState(false)
  const updateInputState = (value: string) => {
    setButtonDisabled(value.length !== 5)
    setPlate(value)
  }
  const findVehicleByPlate = async () => {
    setIsLoading(true)
    try {
      if (!getVehicleDetails) {
        throw new Error('getVehicleDetails function is not defined')
      }

      const response = await getVehicleDetails(plate.toUpperCase())
      const isVehicleFound =
        isVehicleOperatorChangeChecksByPermno(response) ||
        isVehicleOwnerchangeChecksByPermno(response) ||
        isVehiclePlateOrderChecksByPermno(response)
      setVehicleNotFound(!isVehicleFound)

      if (isVehicleFound) {
        const vehicleDetails = extractVehicleDetails(response)
        setVehicleDetails(vehicleDetails)
        setPlate(plate)
        setValue('pickVehicle.type', vehicleDetails.make)
        setValue('pickVehicle.make', vehicleDetails.make)
        setValue('pickVehicle.plate', plate)
        setValue('pickVehicle.color', vehicleDetails.color || undefined)
        setValue('pickVehicle.requireMilage', vehicleDetails.requireMilage)
        setValue('vehicleInfo.plate', plate)
        setValue('vehicleInfo.type', vehicleDetails.make)
        setSubmitButtonDisabled && setSubmitButtonDisabled(false)
      } else {
        setVehicleNotFound(true)
        setSubmitButtonDisabled && setSubmitButtonDisabled(true)
      }
    } catch (error) {
      console.log('error', error)
      setVehicleNotFound(true)
      setVehicleDetails(null)
      setSubmitButtonDisabled && setSubmitButtonDisabled(true)
    } finally {
      setIsLoading(false)
    }
  }
  const isDisabled =
    additionalErrors &&
    vehicleDetails &&
    (!vehicleDetails.isDebtLess ||
      !!vehicleDetails.validationErrorMessages?.length)

  useEffect(() => {
    if (!submitButtonDisabledCalled) {
      setSubmitButtonDisabled && setSubmitButtonDisabled(true)
      setSubmitButtonDisabledCalled(true)
    }
    if (plate.length === 5) {
      setButtonDisabled(false)
    }
    setFieldLoadingState?.(isLoading)
  }, [isLoading])

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Box marginRight={2}>
          <InputController
            id="findVehicle.plate"
            name="findVehicle.plate"
            label={
              findPlatePlaceholder &&
              formatText(findPlatePlaceholder, application, formatMessage)
            }
            onChange={(event) => {
              updateInputState(event.target.value)
            }}
            required={true}
            defaultValue={plate}
            rules={{
              required: true,
              validate: (value) => {
                if (value.length !== 5) {
                  return false
                }
                return true
              },
            }}
            maxLength={5}
          />
        </Box>
        <Button onClick={findVehicleByPlate} disabled={buttonDisabled}>
          {findVehicleButtonText &&
            formatText(findVehicleButtonText, application, formatMessage)}
        </Button>
      </Box>

      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {vehicleNotFound && (
              <AlertMessage
                type="error"
                title={
                  notFoundErrorTitle &&
                  formatText(notFoundErrorTitle, application, formatMessage)
                }
                message={
                  notFoundErrorMessage &&
                  formatMessage(notFoundErrorMessage.valueOf(), {
                    plate: plate.toUpperCase(),
                  })
                }
              />
            )}
            {vehicleDetails && !vehicleNotFound && (
              <ActionCard
                backgroundColor={isDisabled ? 'red' : 'blue'}
                heading={vehicleDetails.make || ''}
                text={`${vehicleDetails.color} - ${vehicleDetails.permno}`}
                focused={true}
              />
            )}
            {vehicleDetails && isDisabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={
                    hasErrorTitle &&
                    formatText(hasErrorTitle, application, formatMessage)
                  }
                  message={
                    <Box>
                      <BulletList>
                        {!vehicleDetails.isDebtLess && (
                          <Bullet>
                            {isNotDebtLessTag &&
                              formatText(
                                isNotDebtLessTag,
                                application,
                                formatMessage,
                              )}
                          </Bullet>
                        )}
                        {!!vehicleDetails.validationErrorMessages?.length &&
                          vehicleDetails.validationErrorMessages?.map(
                            (error) => {
                              const message = formatMessage(
                                (validationErrors &&
                                  getValueViaPath(
                                    validationErrors,
                                    error.errorNo || '',
                                  )) ||
                                  '',
                              )
                              const defaultMessage = error.defaultMessage
                              const fallbackMessage =
                                fallbackErrorMessage &&
                                formatText(
                                  fallbackErrorMessage,
                                  application,
                                  formatMessage,
                                ) +
                                  ' - ' +
                                  error.errorNo

                              return (
                                <Bullet>
                                  {message || defaultMessage || fallbackMessage}
                                </Bullet>
                              )
                            },
                          )}
                      </BulletList>
                    </Box>
                  }
                />
              </Box>
            )}
            {!isLoading &&
              plate.length === 0 &&
              (errors as any)?.pickVehicle && (
                <InputError
                  errorMessage={
                    requiredValidVehicleErrorMessage &&
                    formatText(
                      requiredValidVehicleErrorMessage,
                      application,
                      formatMessage,
                    )
                  }
                />
              )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
