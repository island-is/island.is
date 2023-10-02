import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import {
  Box,
  CategoryCard,
  SkeletonLoader,
  AlertMessage,
  Bullet,
  BulletList,
  InputError,
} from '@island.is/island-ui/core'
import {
  VehiclesCurrentVehicle,
  VehiclesCurrentVehicleWithOwnerchangeChecks,
} from '../../shared'
import { information, applicationCheck, error } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { GetVehicleDetailInput } from '@island.is/api/schema'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleSelectField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList, application, errors }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const currentVehicle = currentVehicleList[parseInt(vehicleValue, 10)]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehiclesCurrentVehicleWithOwnerchangeChecks | null>(
      currentVehicle && currentVehicle.permno
        ? {
            permno: currentVehicle.permno,
            make: currentVehicle?.make || '',
            color: currentVehicle?.color || '',
            role: currentVehicle?.role,
            isDebtLess: true,
            validationErrorMessages: [],
          }
        : null,
    )
  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )

  const getVehicleDetails = useLazyVehicleDetails()
  const getVehicleDetailsCallback = useCallback(
    async ({ permno }: GetVehicleDetailInput) => {
      const { data } = await getVehicleDetails({
        permno,
      })
      return data
    },
    [getVehicleDetails],
  )

  const onChange = (option: Option) => {
    const currentVehicle = currentVehicleList[parseInt(option.value, 10)]
    setIsLoading(true)
    if (currentVehicle.permno) {
      getVehicleDetailsCallback({
        permno: currentVehicle.permno,
      })
        .then((response) => {
          setSelectedVehicle({
            permno: currentVehicle.permno,
            make: currentVehicle?.make || '',
            color: currentVehicle?.color || '',
            role: currentVehicle?.role,
            isDebtLess: response?.vehicleOwnerchangeChecksByPermno?.isDebtLess,
            validationErrorMessages:
              response?.vehicleOwnerchangeChecksByPermno
                ?.validationErrorMessages,
          })

          const disabled =
            !response?.vehicleOwnerchangeChecksByPermno?.isDebtLess ||
            !!response?.vehicleOwnerchangeChecksByPermno
              ?.validationErrorMessages?.length
          setPlate(disabled ? '' : currentVehicle.permno || '')

          setValue(
            'pickVehicle.plate',
            disabled ? '' : currentVehicle.permno || '',
          )
          setValue('pickVehicle.color', currentVehicle.color || undefined)
          setValue('pickVehicle.type', currentVehicle.make || undefined)
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    }
  }

  const disabled =
    selectedVehicle &&
    (!selectedVehicle.isDebtLess ||
      !!selectedVehicle.validationErrorMessages?.length)

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id="pickVehicle.vehicle"
        name="pickVehicle.vehicle"
        onSelect={(option) => onChange(option as Option)}
        options={currentVehicleList.map((vehicle, index) => {
          return {
            value: index.toString(),
            label: `${vehicle.make} - ${vehicle.permno}` || '',
          }
        })}
        placeholder={formatMessage(information.labels.pickVehicle.placeholder)}
        backgroundColor="blue"
      />
      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {selectedVehicle && (
              <CategoryCard
                colorScheme={disabled ? 'red' : 'blue'}
                heading={selectedVehicle.make || ''}
                text={`${selectedVehicle.color} - ${selectedVehicle.permno}`}
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
                        {!selectedVehicle.isDebtLess && (
                          <Bullet>
                            {formatMessage(
                              information.labels.pickVehicle.isNotDebtLessTag,
                            )}
                          </Bullet>
                        )}
                        {!!selectedVehicle.validationErrorMessages?.length &&
                          selectedVehicle.validationErrorMessages?.map(
                            (error) => {
                              const message = formatMessage(
                                getValueViaPath(
                                  applicationCheck.validation,
                                  error.errorNo || '',
                                ),
                              )
                              const defaultMessage = error.defaultMessage
                              const fallbackMessage =
                                formatMessage(
                                  applicationCheck.validation
                                    .fallbackErrorMessage,
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
          </Box>
        )}
      </Box>
      {!isLoading && plate.length === 0 && (errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </Box>
  )
}
