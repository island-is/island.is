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
  BasicVehicleInformation,
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

function extractCommonVehicleInfo(
  basicInfo: BasicVehicleInformation | null | undefined,
): VehicleDetails {
  if (!basicInfo) {
    throw new Error('Missing basic vehicle information')
  }

  return {
    permno: basicInfo.permno || '',
    make: basicInfo.make || '',
    color: basicInfo.color || '',
    requireMilage: basicInfo.requireMileage || false,
  }
}

function isVehicleType<T>(response: unknown, typeName: string): response is T {
  return (
    response !== null &&
    typeof response === 'object' &&
    '__typename' in response &&
    response['__typename'] === typeName
  )
}

function extractVehicleDetails(
  response:
    | VehicleOwnerchangeChecksByPermno
    | VehiclePlateOrderChecksByPermno
    | VehicleOperatorChangeChecksByPermno,
): VehicleDetails {
  // Use type guards to determine the response type and access properties safely
  if (
    isVehicleType<VehicleOwnerchangeChecksByPermno>(
      response,
      'VehicleOwnerchangeChecksByPermno',
    )
  ) {
    return {
      ...extractCommonVehicleInfo(response.basicVehicleInformation),
      isDebtLess: response.isDebtLess ?? true,
      validationErrorMessages: response.validationErrorMessages ?? [],
    }
  } else if (
    isVehicleType<VehiclePlateOrderChecksByPermno>(
      response,
      'VehiclePlateOrderChecksByPermno',
    )
  ) {
    return {
      ...extractCommonVehicleInfo(response.basicVehicleInformation),
    }
  } else if (
    isVehicleType<VehicleOperatorChangeChecksByPermno>(
      response,
      'VehicleOperatorChangeChecksByPermno',
    )
  ) {
    return {
      ...extractCommonVehicleInfo(response.basicVehicleInformation),
      isDebtLess: response.isDebtLess ?? true,
      validationErrorMessages: response.validationErrorMessages ?? [],
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
    getValueViaPath(application.answers, `${field.id}.plate`, '') as string,
  )
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [vehicleNotFound, setVehicleNotFound] = useState<boolean>()
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(
    null,
  )
  const MAX_PLATE_LENGTH = 5
  const [submitButtonDisabledCalled, setSubmitButtonDisabledCalled] =
    useState(false)
  const updateInputState = (value: string) => {
    setButtonDisabled(value.length !== MAX_PLATE_LENGTH)
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
        isVehicleType<VehicleOperatorChangeChecksByPermno>(
          response,
          'VehicleOperatorChangeChecksByPermno',
        ) ||
        isVehicleType<VehicleOwnerchangeChecksByPermno>(
          response,
          'VehicleOwnerchangeChecksByPermno',
        ) ||
        isVehicleType<VehiclePlateOrderChecksByPermno>(
          response,
          'VehiclePlateOrderChecksByPermno',
        )
      setVehicleNotFound(!isVehicleFound)
      if (isVehicleFound) {
        const vehicleDetails = extractVehicleDetails(response)
        setVehicleDetails(vehicleDetails)
        setPlate(plate)
        setValue('findVehicle', true)
        setValue(`${field.id}.type`, vehicleDetails.make)
        setValue(`${field.id}.make`, vehicleDetails.make)
        setValue(`${field.id}.plate`, plate)
        setValue(`${field.id}.color`, vehicleDetails.color || undefined)
        setValue(`${field.id}.requireMilage`, vehicleDetails.requireMilage)
        setValue('vehicleInfo.plate', plate)
        setValue('vehicleInfo.type', vehicleDetails.make)
        setSubmitButtonDisabled && setSubmitButtonDisabled(false)
      } else {
        setVehicleNotFound(true)
        setSubmitButtonDisabled && setSubmitButtonDisabled(true)
      }
    } catch (error) {
      console.error('error', error)
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
    if (plate.length === MAX_PLATE_LENGTH) {
      setButtonDisabled(false)
    }
    setFieldLoadingState?.(isLoading)
  }, [isLoading])

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Box marginRight={2}>
          <InputController
            id={`${field.id}.permno`}
            name={`${field.id}.permno`}
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
                if (value.length !== MAX_PLATE_LENGTH) {
                  return false
                }
                return true
              },
            }}
            maxLength={MAX_PLATE_LENGTH}
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
