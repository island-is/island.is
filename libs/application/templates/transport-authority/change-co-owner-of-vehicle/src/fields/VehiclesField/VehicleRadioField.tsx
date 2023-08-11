import {
  Box,
  Text,
  AlertMessage,
  BulletList,
  Bullet,
  InputError,
} from '@island.is/island-ui/core'
import { FC, useState } from 'react'
import { VehiclesCurrentVehicleWithOwnerchangeChecks } from '../../shared'
import { RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { applicationCheck, information, error } from '../../lib/messages'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicleWithOwnerchangeChecks[]
}

export const VehicleRadioField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList, application, errors }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )

  const onRadioControllerSelect = (s: string) => {
    const currentVehicle = currentVehicleList[parseInt(s, 10)]
    setPlate(currentVehicle.permno || '')
    setValue('pickVehicle.plate', currentVehicle.permno || '')
    setValue('pickVehicle.color', currentVehicle.color || undefined)
    setValue('pickVehicle.type', currentVehicle.make || undefined)
  }

  const vehicleOptions = (
    vehicles: VehiclesCurrentVehicleWithOwnerchangeChecks[],
  ) => {
    const options = [] as Option[]

    for (const [index, vehicle] of vehicles.entries()) {
      const disabled =
        !vehicle.isDebtLess || !!vehicle.validationErrorMessages?.length
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {vehicle.make}
              </Text>
              <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                {vehicle.color} - {vehicle.permno}
              </Text>
            </Box>
            {disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickVehicle.hasErrorTitle,
                  )}
                  message={
                    <Box>
                      <BulletList>
                        {!vehicle.isDebtLess && (
                          <Bullet>
                            {formatMessage(
                              information.labels.pickVehicle.isNotDebtLessTag,
                            )}
                          </Bullet>
                        )}
                        {!!vehicle.validationErrorMessages?.length &&
                          vehicle.validationErrorMessages?.map((error) => {
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
                          })}
                      </BulletList>
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  return (
    <div>
      <RadioController
        id="pickVehicle.vehicle"
        largeButtons
        backgroundColor="blue"
        onSelect={onRadioControllerSelect}
        options={vehicleOptions(
          currentVehicleList as VehiclesCurrentVehicleWithOwnerchangeChecks[],
        )}
      />
      {plate.length === 0 && (errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </div>
  )
}
