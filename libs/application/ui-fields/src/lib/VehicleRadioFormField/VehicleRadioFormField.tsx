import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps, VehicleRadioField } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Text,
  InputError,
  Tag,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { RadioController } from '@island.is/shared/form-fields'
import { PlateOwnership, VehicleDetails } from './VehicleDetails'

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
  const { formatMessage, formatDateFns } = useLocale()
  const { setValue } = useFormContext()

  let answersSelectedValueKey: string | undefined
  let radioControllerId = field.id
  if (field.itemType === 'VEHICLE') {
    answersSelectedValueKey = `${field.id}.plate`
    radioControllerId = `${field.id}.vehicle`
  } else if (field.itemType === 'PLATE') {
    answersSelectedValueKey = `${field.id}.regno`
    radioControllerId = `${field.id}.value`
  }

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    answersSelectedValueKey &&
      (getValueViaPath(
        application.answers,
        answersSelectedValueKey,
        '',
      ) as string),
  )

  const onRadioControllerSelect = (s: string) => {
    if (field.itemType === 'VEHICLE') {
      const currentVehicleList = field.itemList as VehicleDetails[]
      const currentVehicle = currentVehicleList?.[parseInt(s, 10)]
      const permno = currentVehicle?.permno || ''

      setSelectedValue(permno)

      setValue(`${field.id}.plate`, permno)
      setValue(`${field.id}.type`, currentVehicle?.make)
      setValue(`${field.id}.color`, currentVehicle?.color || undefined)

      setValue('vehicleMileage.requireMileage', currentVehicle?.requireMileage)
      setValue('vehicleMileage.mileageReading', currentVehicle?.mileageReading)

      if (permno) setValue('vehicleInfo.plate', permno)
      if (permno) setValue('vehicleInfo.type', currentVehicle?.make)
    } else if (field.itemType === 'PLATE') {
      const currentPlateList = field.itemList as PlateOwnership[]
      const currentPlate = currentPlateList?.[parseInt(s, 10)]
      const regno = currentPlate?.regno

      setSelectedValue(regno)

      setValue(`${field.id}.regno`, regno)
    }
  }

  const vehicleOptions = (vehicles: VehicleDetails[]) => {
    const options = [] as Option[]

    for (const [index, vehicle] of vehicles.entries()) {
      const hasError = !!vehicle.validationErrorMessages?.length
      const hasDebtError = field.validateDebtStatus && !vehicle.isDebtLess
      const disabled = hasError || hasDebtError

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
                        {field.validateDebtStatus && !vehicle.isDebtLess && (
                          <Bullet>
                            {field.debtStatusErrorMessage &&
                              formatText(
                                field.debtStatusErrorMessage,
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

  const plateOptions = (plates: PlateOwnership[]) => {
    const options = [] as Option[]

    for (const [index, plate] of plates.entries()) {
      const hasError = !!plate.validationErrorMessages?.length
      const canRenew = field.checkExpireAtIfCanRenew?.(plate)
      const disabled = hasError || !canRenew

      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Box>
                <Text variant="h3" color={disabled ? 'dark200' : 'dark400'}>
                  {plate.regno}
                </Text>
              </Box>
              <Tag variant={canRenew ? 'mint' : 'red'} disabled>
                {field.expiresAtTag &&
                  formatMessage(field.expiresAtTag, {
                    date: formatDateFns(new Date(plate.endDate), 'do MMM yyyy'),
                  })}
              </Tag>
            </Box>
            {hasError && (
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
                        {plate.validationErrorMessages?.map((error) => {
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

  let options: Option[] = []
  if (field.itemType === 'VEHICLE') {
    options = vehicleOptions(field.itemList as VehicleDetails[])
  } else if (field.itemType === 'PLATE') {
    options = plateOptions(field.itemList as PlateOwnership[])
  }

  return (
    <div>
      <RadioController
        id={radioControllerId}
        largeButtons
        backgroundColor="blue"
        onSelect={onRadioControllerSelect}
        options={options}
      />

      {!selectedValue?.length && (errors as any)?.[field.id] && (
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
