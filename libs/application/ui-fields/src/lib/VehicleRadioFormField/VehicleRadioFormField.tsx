import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps, VehicleRadioField } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Text,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { RadioController } from '@island.is/shared/form-fields'
import { VehicleDetails } from './VehicleDetails'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface Props extends FieldBaseProps {
  field: VehicleRadioField
}

export const VehicleRadioFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, `${field.id}.plate`, '') as string,
  )

  const currentVehicleList = field.itemList as VehicleDetails[]

  const onRadioControllerSelect = (s: string) => {
    const currentVehicle = currentVehicleList[parseInt(s, 10)]
    const permno = currentVehicle.permno || ''

    setPlate(permno)
    setValue(`${field.id}.plate`, permno)
    setValue(`${field.id}.type`, currentVehicle.make)
    setValue(`${field.id}.color`, currentVehicle.color || undefined)

    setValue('vehicleMileage.requireMileage', currentVehicle?.requireMileage)
    setValue('vehicleMileage.mileageReading', currentVehicle?.mileageReading)

    if (permno) setValue('vehicleInfo.plate', permno)
    if (permno) setValue('vehicleInfo.type', currentVehicle.make)
  }

  const vehicleOptions = (vehicles: VehicleDetails[]) => {
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
                  title={
                    field.alertMessageErrorTitle &&
                    formatText(
                      field.alertMessageErrorTitle,
                      application,
                      formatMessage,
                    )
                  }
                  message={
                    <Box>
                      <BulletList>
                        {!vehicle.isDebtLess && (
                          <Bullet>
                            {field.errorIsNotDebtLessMessage &&
                              formatText(
                                field.errorIsNotDebtLessMessage,
                                application,
                                formatMessage,
                              )}
                          </Bullet>
                        )}
                        {!!vehicle.validationErrorMessages?.length &&
                          vehicle.validationErrorMessages?.map((error) => {
                            const message =
                              field.validationErrorMessages &&
                              formatMessage(
                                getValueViaPath(
                                  field.validationErrorMessages,
                                  error.errorNo || '',
                                ),
                              )
                            const defaultMessage = error.defaultMessage
                            const fallbackMessage =
                              (field.validationErrorFallbackMessage &&
                                formatText(
                                  field.validationErrorFallbackMessage,
                                  application,
                                  formatMessage,
                                )) +
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
        id={`${field.id}.vehicle`}
        largeButtons
        backgroundColor="blue"
        onSelect={onRadioControllerSelect}
        options={vehicleOptions(currentVehicleList as VehicleDetails[])}
      />
      {plate.length === 0 && (errors as any)?.[field.id] && (
        <InputError
          errorMessage={
            field.inputErrorMessage &&
            formatText(field.inputErrorMessage, application, formatMessage)
          }
        />
      )}
    </div>
  )
}
