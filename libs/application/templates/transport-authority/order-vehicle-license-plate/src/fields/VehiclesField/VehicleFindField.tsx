import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  SkeletonLoader,
  InputError,
  ActionCard,
  Button,
} from '@island.is/island-ui/core'
import { GetVehicleDetailInput } from '@island.is/api/schema'
import { information, error } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import {
  VehiclesCurrentVehicle,
  VehiclesCurrentVehicleWithPlateOrderChecks,
} from '../../shared'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleFindField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList, application, errors, setFieldLoadingState }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const currentVehicle = currentVehicleList[parseInt(vehicleValue, 10)]
  const [vehicleNotFound, setVehicleNotFound] = useState<boolean>()
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)
  const updateInputState = (value: string) => {
    setButtonDisabled(value.length !== 5)
    setPlate(value)
  }
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehiclesCurrentVehicleWithPlateOrderChecks | null>(
      currentVehicle && currentVehicle.permno
        ? {
            permno: currentVehicle.permno,
            make: currentVehicle?.make || '',
            color: currentVehicle?.color || '',
            role: currentVehicle?.role,
            validationErrorMessages: [],
          }
        : null,
    )
  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )

  const getVehicleDetails = useLazyVehicleDetails()

  const findVehicleByPlate = () => {
    setIsLoading(true)
    if (plate) {
      getVehicleDetailsCallback({
        permno: plate.toUpperCase(),
      })
        .then((response) => {
          setSelectedVehicle({
            permno:
              response.vehiclePlateOrderChecksByPermno?.basicVehicleInformation
                ?.permno || '',
            make:
              response.vehiclePlateOrderChecksByPermno?.basicVehicleInformation
                ?.make || '',
            color:
              response.vehiclePlateOrderChecksByPermno?.basicVehicleInformation
                ?.color || '',
            validationErrorMessages:
              response?.vehiclePlateOrderChecksByPermno
                ?.validationErrorMessages,
          })

          const disabled =
            !!response?.vehiclePlateOrderChecksByPermno?.validationErrorMessages
              ?.length
          const permno = disabled ? '' : plate || ''

          setPlate(permno)
          setValue(
            'pickVehicle.make',
            response.vehiclePlateOrderChecksByPermno?.basicVehicleInformation
              ?.make,
          )
          setValue('pickVehicle.plate', permno)
          setValue(
            'pickVehicle.color',
            response.vehiclePlateOrderChecksByPermno?.basicVehicleInformation
              ?.color || undefined,
          )
          setValue(
            'pickVehicle.requireMilage',
            response.vehiclePlateOrderChecksByPermno?.basicVehicleInformation
              ?.requireMileage || false,
          )
          if (permno) setValue('vehicleInfo.plate', permno)
          if (permno)
            setValue(
              'vehicleInfo.type',
              response.vehiclePlateOrderChecksByPermno?.basicVehicleInformation
                ?.make,
            )
          setVehicleNotFound(false)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setVehicleNotFound(true)
          setIsLoading(false)
        })
    }
  }

  const getVehicleDetailsCallback = useCallback(
    async ({ permno }: GetVehicleDetailInput) => {
      const { data } = await getVehicleDetails({
        permno,
      })
      return data
    },
    [getVehicleDetails],
  )

  const disabled =
    selectedVehicle && !!selectedVehicle.validationErrorMessages?.length

  useEffect(() => {
    setFieldLoadingState?.(isLoading)
  }, [isLoading])

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="spaceBetween">
        <InputController
          id="findVehicle.plate"
          name="findVehicle.plate"
          label={formatMessage(
            information.labels.pickVehicle.findPlatePlaceholder,
          )}
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
        <Button onClick={findVehicleByPlate} disabled={buttonDisabled}>
          {formatMessage(information.labels.pickVehicle.findButton)}
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
                title={'Errorinn'}
                message={formatMessage(
                  information.labels.pickVehicle.notFoundTitle,
                  { plate },
                )}
              />
            )}
            {selectedVehicle && !vehicleNotFound && (
              <ActionCard
                backgroundColor={disabled ? 'red' : 'blue'}
                heading={selectedVehicle.make || ''}
                text={`${selectedVehicle.color} - ${selectedVehicle.permno}`}
                focused={true}
              />
            )}
            {selectedVehicle && disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickVehicle.hasErrorTitle,
                  )}
                  message={
                    <Box>
                      <BulletList>
                        {!!selectedVehicle.validationErrorMessages?.length &&
                          selectedVehicle.validationErrorMessages?.map(
                            (err) => {
                              const defaultMessage = err.defaultMessage
                              const fallbackMessage =
                                formatMessage(
                                  error.validationFallbackErrorMessage,
                                ) +
                                ' - ' +
                                err.errorNo

                              return (
                                <Bullet>
                                  {defaultMessage || fallbackMessage}
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
          </Box>
        )}
      </Box>
      {!isLoading && plate.length === 0 && (errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </Box>
  )
}
