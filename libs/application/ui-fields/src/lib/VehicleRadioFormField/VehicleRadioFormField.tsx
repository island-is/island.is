import {
  formatText,
  getValueViaPath,
  resolveFieldId,
} from '@island.is/application/core'
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
import { useUserInfo } from '@island.is/react-spa/bff'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { RadioController } from '@island.is/shared/form-fields'
import { PlateOwnership, VehicleDetails } from './types'
import { MessageDescriptor } from 'react-intl'
import { getItemAtIndex } from './utils'

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
  clearOnChange,
  clearOnChangeDefaultValue,
}) => {
  const {
    id,
    itemType,
    itemList,
    shouldValidateErrorMessages,
    shouldValidateDebtStatus,
    shouldValidateRenewal,
    alertMessageErrorTitle,
    validationErrorMessages,
    validationErrorFallbackMessage,
    inputErrorMessage,
    debtStatusErrorMessage,
    renewalExpiresAtTag,
    validateRenewal,
  } = field
  const { formatMessage, formatDateFns } = useLocale()
  const user = useUserInfo()
  const { setValue } = useFormContext()
  const resolvedId = resolveFieldId({ id }, application, user)

  let answersSelectedValueKey = resolvedId
  let answersSelectedIndexKey = resolvedId
  if (itemType === 'VEHICLE') {
    answersSelectedValueKey = `${resolvedId}.plate`
    answersSelectedIndexKey = `${resolvedId}.vehicle`
  } else if (itemType === 'PLATE') {
    answersSelectedValueKey = `${resolvedId}.regno`
    answersSelectedIndexKey = `${resolvedId}.value`
  }

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    answersSelectedValueKey &&
      getValueViaPath<string>(application.answers, answersSelectedValueKey, ''),
  )

  const onRadioControllerSelect = (s: string) => {
    if (field.itemType === 'VEHICLE') {
      const vehicle = getItemAtIndex(field.itemList as VehicleDetails[], s)
      const permno = vehicle?.permno || ''

      setSelectedValue(permno)

      setValue(`${resolvedId}.plate`, permno)
      setValue(`${resolvedId}.type`, vehicle?.make)
      setValue(`${resolvedId}.color`, vehicle?.color || undefined)
      setValue(
        `${resolvedId}.vehicleHasMilesOdometer`,
        vehicle?.vehicleHasMilesOdometer,
      )

      setValue('vehicleMileage.requireMileage', vehicle?.requireMileage)
      setValue('vehicleMileage.mileageReading', vehicle?.mileageReading)

      if (permno) setValue('vehicleInfo.plate', permno)
      if (permno) setValue('vehicleInfo.type', vehicle?.make)
    } else if (field.itemType === 'PLATE') {
      const plate = getItemAtIndex(field.itemList as PlateOwnership[], s)
      const regno = plate?.regno

      setSelectedValue(regno)

      setValue(`${field.id}.regno`, regno)
    }
  }

  const options: Option[] = []
  if (itemType === 'VEHICLE') {
    const vehicles = itemList as VehicleDetails[]
    for (const [index, vehicle] of vehicles.entries()) {
      const hasValidationError =
        shouldValidateErrorMessages && !!vehicle.validationErrorMessages?.length
      const hasDebtError = shouldValidateDebtStatus && !vehicle.isDebtLess
      const disabled = hasValidationError || hasDebtError

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
                    alertMessageErrorTitle &&
                    formatText(
                      alertMessageErrorTitle,
                      application,
                      formatMessage,
                    )
                  }
                  message={
                    <Box>
                      <BulletList>
                        {hasDebtError && (
                          <Bullet>
                            {debtStatusErrorMessage &&
                              formatText(
                                debtStatusErrorMessage,
                                application,
                                formatMessage,
                              )}
                          </Bullet>
                        )}
                        {hasValidationError &&
                          vehicle.validationErrorMessages?.map((error) => {
                            const message =
                              validationErrorMessages &&
                              formatMessage(
                                getValueViaPath<MessageDescriptor>(
                                  validationErrorMessages,
                                  error.errorNo || '',
                                ) || '',
                              )
                            const defaultMessage = error.defaultMessage
                            const fallbackMessage =
                              (validationErrorFallbackMessage &&
                                formatText(
                                  validationErrorFallbackMessage,
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
  } else if (itemType === 'PLATE') {
    const plates = itemList as PlateOwnership[]
    for (const [index, plate] of plates.entries()) {
      const hasValidationError =
        shouldValidateErrorMessages && !!plate.validationErrorMessages?.length
      const canRenew = !shouldValidateRenewal || validateRenewal?.(plate)
      const disabled = hasValidationError || !canRenew

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
                {renewalExpiresAtTag &&
                  formatMessage(renewalExpiresAtTag, {
                    date: formatDateFns(new Date(plate.endDate), 'do MMM yyyy'),
                  })}
              </Tag>
            </Box>
            {hasValidationError && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={
                    alertMessageErrorTitle &&
                    formatText(
                      alertMessageErrorTitle,
                      application,
                      formatMessage,
                    )
                  }
                  message={
                    <Box>
                      <BulletList>
                        {plate.validationErrorMessages?.map((error) => {
                          const message =
                            validationErrorMessages &&
                            formatMessage(
                              getValueViaPath<MessageDescriptor>(
                                validationErrorMessages,
                                error.errorNo || '',
                              ) || '',
                            )

                          const defaultMessage = error.defaultMessage

                          const fallbackMessage =
                            (validationErrorFallbackMessage &&
                              formatText(
                                validationErrorFallbackMessage,
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
  }

  return (
    <Box marginTop={field.marginTop} marginBottom={field.marginBottom}>
      <RadioController
        id={answersSelectedIndexKey}
        largeButtons
        backgroundColor="blue"
        onSelect={onRadioControllerSelect}
        options={options}
        clearOnChange={clearOnChange}
        clearOnChangeDefaultValue={clearOnChangeDefaultValue}
      />

      {!selectedValue?.length && !!errors?.[resolvedId] && (
        <InputError
          errorMessage={
            inputErrorMessage &&
            formatText(inputErrorMessage, application, formatMessage)
          }
        />
      )}
    </Box>
  )
}
