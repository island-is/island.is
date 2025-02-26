import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  VehicleSelectField,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  InputError,
  SkeletonLoader,
  ActionCard,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { SelectController } from '@island.is/shared/form-fields'
import {
  BasicPlateOwnership,
  BasicVehicleDetails,
  PlateOwnership,
  PlateOwnershipValidation,
  VehicleDetails,
} from './types'
import { MessageDescriptor } from 'react-intl'
import { extractDetails, getItemAtIndex } from './utils'

interface Option {
  value: string
  label: string
}

interface Props extends FieldBaseProps {
  field: VehicleSelectField
}

export const VehicleSelectFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  errors,
  setFieldLoadingState,
}) => {
  const { formatMessage, formatDateFns } = useLocale()
  const { setValue } = useFormContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  let answersSelectedValueKey = field.id
  let answersSelectedIndexKey = field.id
  if (field.itemType === 'VEHICLE') {
    answersSelectedValueKey = `${field.id}.plate`
    answersSelectedIndexKey = `${field.id}.vehicle`
  } else if (field.itemType === 'PLATE') {
    answersSelectedValueKey = `${field.id}.regno`
    answersSelectedIndexKey = `${field.id}.value`
  }

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    answersSelectedValueKey &&
      getValueViaPath<string>(application.answers, answersSelectedValueKey, ''),
  )

  const [selectedVehicle, setSelectedVehicle] = useState<
    VehicleDetails | undefined
  >(
    getItemAtIndex(
      field.itemList as BasicVehicleDetails[],
      getValueViaPath<string>(application.answers, answersSelectedIndexKey) ||
        '',
    ),
  )

  const [selectedPlate, setSelectedPlate] = useState<
    PlateOwnership | undefined
  >(
    getItemAtIndex(
      field.itemList as BasicPlateOwnership[],
      getValueViaPath<string>(application.answers, answersSelectedIndexKey) ||
        '',
    ),
  )

  const onChange = async (option: Option) => {
    if (field.itemType === 'VEHICLE') {
      onChangeVehicle(option.value)
    } else if (field.itemType === 'PLATE') {
      onChangePlate(option.value)
    }
  }

  const onChangeVehicle = async (index: string) => {
    setIsLoading(true)
    try {
      const vehicle = getItemAtIndex(
        field.itemList as BasicVehicleDetails[],
        index,
      )
      if (!vehicle?.permno) {
        throw new Error('Selected vehicle not found')
      }

      let vehicleDetails: VehicleDetails | undefined
      if (field.getDetails) {
        const response = await field.getDetails(vehicle.permno || '')
        vehicleDetails = extractDetails(response)
      }

      setSelectedVehicle({
        permno: vehicle.permno,
        make: vehicle.make || '',
        color: vehicle.color || '',
        role: vehicle.role,
        isDebtLess: vehicleDetails?.isDebtLess,
        validationErrorMessages: vehicleDetails?.validationErrorMessages,
      })

      const hasValidationError =
        field.shouldValidateErrorMessages &&
        !!vehicleDetails?.validationErrorMessages?.length
      const hasDebtError =
        field.shouldValidateDebtStatus && !vehicleDetails?.isDebtLess
      const disabled = hasValidationError || hasDebtError

      const permno = disabled ? '' : vehicle.permno || ''

      setSelectedValue(permno)

      setValue(`${field.id}.plate`, permno)
      setValue(`${field.id}.type`, vehicle.make)
      setValue(`${field.id}.color`, vehicle.color || undefined)

      setValue('vehicleMileage.requireMileage', vehicleDetails?.requireMileage)
      setValue('vehicleMileage.mileageReading', vehicleDetails?.mileageReading)

      if (permno) setValue('vehicleInfo.plate', permno)
      if (permno) setValue('vehicleInfo.type', vehicle.make)
    } catch (error) {
      console.error('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onChangePlate = async (index: string) => {
    setIsLoading(true)
    try {
      const plate = getItemAtIndex(
        field.itemList as BasicPlateOwnership[],
        index,
      )
      if (!plate?.regno) {
        throw new Error('Selected plate not found')
      }

      let plateDetails: PlateOwnershipValidation | undefined
      if (field.getDetails) {
        const response = await field.getDetails(plate.regno || '')
        plateDetails = extractDetails(response)
      }

      setSelectedPlate({
        regno: plate.regno,
        startDate: plate.startDate,
        endDate: plate.endDate,
        validationErrorMessages: plateDetails?.validationErrorMessages,
      })

      const hasValidationError =
        field.shouldValidateErrorMessages &&
        !!plateDetails?.validationErrorMessages?.length
      const canRenew =
        !field.shouldValidateRenewal || field.validateRenewal?.(plate)
      const disabled = hasValidationError || !canRenew

      const regno = disabled ? '' : plate.regno || ''

      setSelectedValue(regno)

      setValue(`${field.id}.regno`, regno)
    } catch (error) {
      console.error('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const options: Option[] = []
  let selectedItemActionCard: JSX.Element | undefined
  if (field.itemType === 'VEHICLE') {
    const vehicles = field.itemList as BasicVehicleDetails[]
    for (const [index, vehicle] of vehicles.entries()) {
      options.push({
        value: index.toString(),
        label: `${vehicle.make} - ${vehicle.permno}` || '',
      })
    }

    const hasValidationError =
      field.shouldValidateErrorMessages &&
      !!selectedVehicle?.validationErrorMessages?.length
    const hasDebtError =
      field.shouldValidateDebtStatus && !selectedVehicle?.isDebtLess
    const disabled = hasValidationError || hasDebtError

    selectedItemActionCard = (
      <Box>
        {selectedVehicle && (
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
                    {hasDebtError && (
                      <Bullet>
                        {field.debtStatusErrorMessage &&
                          formatText(
                            field.debtStatusErrorMessage,
                            application,
                            formatMessage,
                          )}
                      </Bullet>
                    )}
                    {hasValidationError &&
                      selectedVehicle.validationErrorMessages?.map((error) => {
                        const message =
                          field.validationErrorMessages &&
                          formatMessage(
                            getValueViaPath<MessageDescriptor>(
                              field.validationErrorMessages,
                              error.errorNo || '',
                            ) || '',
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
    )
  } else if (field.itemType === 'PLATE') {
    const plates = field.itemList as BasicPlateOwnership[]
    for (const [index, plate] of plates.entries()) {
      options.push({
        value: index.toString(),
        label: `${plate.regno}`,
      })
    }

    const hasValidationError =
      field.shouldValidateErrorMessages &&
      !!selectedPlate?.validationErrorMessages?.length
    const canRenew =
      !field.shouldValidateRenewal || field.validateRenewal?.(selectedPlate)
    const disabled = hasValidationError || !canRenew

    selectedItemActionCard = (
      <Box>
        {selectedPlate && (
          <ActionCard
            backgroundColor={disabled ? 'red' : 'blue'}
            heading={selectedPlate.regno || ''}
            text=""
            focused={true}
            tag={{
              label:
                (field.renewalExpiresAtTag &&
                  selectedPlate.endDate &&
                  formatMessage(field.renewalExpiresAtTag, {
                    date: formatDateFns(new Date(selectedPlate.endDate)),
                  })) ||
                '',
              variant: canRenew ? 'mint' : 'red',
            }}
          />
        )}
        {selectedPlate && hasValidationError && (
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
                    {selectedPlate.validationErrorMessages?.map((error) => {
                      const message =
                        field.validationErrorMessages &&
                        formatMessage(
                          getValueViaPath<MessageDescriptor>(
                            field.validationErrorMessages,
                            error.errorNo || '',
                          ) || '',
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
    )
  }

  useEffect(() => {
    setFieldLoadingState?.(isLoading)
  }, [isLoading, setFieldLoadingState])

  return (
    <Box>
      <SelectController
        label={
          (field.inputLabelText &&
            formatText(field.inputLabelText, application, formatMessage)) ||
          ''
        }
        id={answersSelectedIndexKey}
        onSelect={(option) => onChange(option as Option)}
        options={options}
        placeholder={
          field.inputPlaceholderText &&
          formatText(field.inputPlaceholderText, application, formatMessage)
        }
        backgroundColor="blue"
      />

      <Box paddingTop={3}>
        {isLoading ? <SkeletonLoader /> : selectedItemActionCard}
      </Box>

      {!isLoading && !selectedValue?.length && !!errors?.[field.id] && (
        <InputError
          errorMessage={
            field.inputErrorMessage &&
            formatText(field.inputErrorMessage, application, formatMessage)
          }
        />
      )}
    </Box>
  )
}
