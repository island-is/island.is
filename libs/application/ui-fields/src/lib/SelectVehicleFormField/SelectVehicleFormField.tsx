import {
  BasicVehicleInformation,
  EnergyFundVehicleDetailsWithGrant,
  MachineDetails,
  VehicleOperatorChangeChecksByPermno,
  VehicleOwnerchangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
  VehicleValidationErrorMessage,
} from '@island.is/api/schema'
import {
  FieldBaseProps,
  SelectVehicleField,
  Option,
} from '@island.is/application/types'
import {
  SkeletonLoader,
  ActionCard,
  AlertMessage,
  BulletList,
  Bullet,
  InputError,
  Box,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { mustInspectBeforeStreetRegistration } from '../FindVehicleFormField/FindVehicleFormField.util'
import { formatText } from '@island.is/application/core'

interface VehicleDetails {
  permno: string
  make: string
  color: string
  isDebtLess?: boolean
  validationErrorMessages?: VehicleValidationErrorMessage[]
  requireMileage?: boolean
  mileageReading: string
}

interface Props extends FieldBaseProps {
  field: SelectVehicleField
}

const isVehicleType = function <T>(
  response: unknown,
  typeName: string,
): response is T {
  return (
    response !== null &&
    typeof response === 'object' &&
    '__typename' in response &&
    response['__typename'] === typeName
  )
}

const extractCommonVehicleInfo = function (
  basicInfo: BasicVehicleInformation | null | undefined,
): VehicleDetails {
  if (!basicInfo) {
    throw new Error('Missing basic vehicle information')
  }

  return {
    permno: basicInfo.permno || '',
    make: basicInfo.make || '',
    color: basicInfo.color || '',
    requireMileage: basicInfo.requireMileage || false,
    mileageReading: (basicInfo?.mileageReading || '') as string,
  }
}

const extractDetails = function (
  response:
    | VehicleOwnerchangeChecksByPermno
    | VehiclePlateOrderChecksByPermno
    | VehicleOperatorChangeChecksByPermno
    | MachineDetails
    | EnergyFundVehicleDetailsWithGrant
    | unknown,
): VehicleDetails | MachineDetails | EnergyFundVehicleDetailsWithGrant {
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
  } else if (isVehicleType<MachineDetails>(response, 'MachineDetails')) {
    return {
      ...response,
    }
  } else if (
    isVehicleType<EnergyFundVehicleDetailsWithGrant>(
      response,
      'EnergyFundVehicleDetailsWithGrant',
    )
  ) {
    return {
      ...response,
    }
  } else {
    // Handle unexpected response types
    throw new Error('Unexpected response type')
  }
}

export const SelectVehicleFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  errors,
  setFieldLoadingState,
  setSubmitButtonDisabled,
}) => {
  const {
    id,
    title,
    options,
    placeholder,
    disabled,
    getDetails,
    backgroundColor,
    required = false,
    isEnergyFunds,
    isMachine,
    selectLabel,
    selectPlaceholder,
    errorTitle,
    validError,
    validationErrors,
  } = field

  const onChange = async (option: Option) => {
    setIsLoading(true)
    try {
      if (!getDetails) {
        throw new Error('getDetails function is not defined')
      }
      const response = await getDetails(option.value)
      console.log('response', response)
      const details:
        | VehicleDetails
        | MachineDetails
        | EnergyFundVehicleDetailsWithGrant = extractDetails(response)
      setValues(details)
      console.log('machineDetails', machineDetails)
      console.log('details', details)
      const isVehicleFound = !!details
      // setVehicleNotFound(!isVehicleFound)
      setSubmitButtonDisabled && setSubmitButtonDisabled(!isVehicleFound)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(
    null,
  )
  const [machineDetails, setMachineDetails] = useState<MachineDetails | null>(
    null,
  )
  const [energyDetails, setEnergyDetails] =
    useState<EnergyFundVehicleDetailsWithGrant | null>(null)

  const setValues = (
    details:
      | MachineDetails
      | VehicleDetails
      | EnergyFundVehicleDetailsWithGrant,
  ) => {
    if (isEnergyFunds) {
      setEnergyFundsValues(details as EnergyFundVehicleDetailsWithGrant)
    } else if (isMachine) {
      setMachineValues(details as MachineDetails)
    } else {
      setVehicleValues(details as VehicleDetails)
    }
  }

  const setVehicleValues = (vehicleDetails: VehicleDetails) => {
    setValue('findVehicle', true)
    setValue(`${field.id}.type`, vehicleDetails.make)
    setValue(`${field.id}.make`, vehicleDetails.make)
    setValue(`${field.id}.plate`, vehicleDetails.permno)
    setValue(`${field.id}.color`, vehicleDetails.color || undefined)
    setValue(`${field.id}.requireMileage`, vehicleDetails.requireMileage)
    setValue(`${field.id}.mileageReading`, vehicleDetails.mileageReading)
    setValue('vehicleMileage.requireMileage', vehicleDetails?.requireMileage)
    setValue('vehicleMileage.mileageReading', vehicleDetails?.mileageReading)
    setValue('vehicleInfo.plate', vehicleDetails.permno)
    setValue('vehicleInfo.type', vehicleDetails.make)
    setVehicleDetails(vehicleDetails)
  }

  const setMachineValues = (machineDetails: MachineDetails) => {
    if (application.typeId === 'StreetRegistration') {
      const mustInspect = mustInspectBeforeStreetRegistration(
        application?.externalData,
        machineDetails.regNumber || '',
      )
      if (mustInspect && !machineDetails.disabled) {
        machineDetails = {
          ...machineDetails,
          disabled: true,
          status:
            validationErrors &&
            formatText(
              validationErrors.inspectBeforeRegistration,
              application,
              formatMessage,
            ),
        }
      }
    }

    setValue(`${field.id}.regNumber`, machineDetails.regNumber)
    setValue(`${field.id}.category`, machineDetails.category)
    setValue(`${field.id}.type`, machineDetails.type || '')
    setValue(`${field.id}.subType`, machineDetails.subType || '')
    setValue(`${field.id}.plate`, machineDetails.plate || '')
    setValue(`${field.id}.ownerNumber`, machineDetails.ownerNumber || '')
    setValue(`${field.id}.id`, machineDetails.id)
    setValue('pickMachine.id', machineDetails.id)
    setValue(`${field.id}.date`, new Date().toISOString())
    setValue('pickMachine.isValid', machineDetails.disabled ? undefined : true)
    // setMachineId(machineDetails?.id || '')
    setSubmitButtonDisabled &&
      setSubmitButtonDisabled(!machineDetails.disabled || false)
    console.log('machineDetails', machineDetails)
    setMachineDetails(machineDetails)
  }

  const setEnergyFundsValues = (
    vehicleDetailsWithGrant: EnergyFundVehicleDetailsWithGrant,
  ) => {
    setValue('findVehicle', true)
    setValue(`${field.id}.type`, vehicleDetailsWithGrant.make)
    setValue(`${field.id}.plate`, vehicleDetailsWithGrant.permno)
    setValue(`${field.id}.color`, vehicleDetailsWithGrant.color || undefined)
    setValue(
      `${field.id}.newRegistrationDate`,
      vehicleDetailsWithGrant.newRegistrationDate || '',
    )
    setValue(
      `${field.id}.firstRegistrationDate`,
      vehicleDetailsWithGrant.firstRegistrationDate || '',
    )
    setValue(`${field.id}.vin`, vehicleDetailsWithGrant.vin)
    setValue(`${field.id}.grantAmount`, vehicleDetailsWithGrant.vehicleGrant)
    setValue(
      `${field.id}.grantItemCode`,
      vehicleDetailsWithGrant.vehicleGrantItemCode,
    )
    setEnergyDetails(vehicleDetailsWithGrant)
  }

  useEffect(() => {
    setFieldLoadingState?.(isLoading)
  }, [isLoading, setFieldLoadingState])

  return (
    <Box>
      <SelectController
        label={
          (selectLabel &&
            formatText(selectLabel, application, formatMessage)) ||
          ''
        }
        id={`${field.id}.id`}
        name={`${field.id}.id`}
        onSelect={async (option) => await onChange(option as Option)}
        options={options}
        placeholder={
          selectPlaceholder &&
          formatText(selectPlaceholder, application, formatMessage)
        }
        backgroundColor="blue"
      />
      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {machineDetails && (
              <ActionCard
                backgroundColor={machineDetails.disabled ? 'red' : 'blue'}
                heading={machineDetails.regNumber || ''}
                text={`${machineDetails.type} ${machineDetails.subType}`}
                focused={true}
              />
            )}
            {machineDetails && machineDetails.disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={
                    errorTitle &&
                    formatText(errorTitle, application, formatMessage)
                  }
                  message={
                    <Box>
                      <BulletList>
                        {!!machineDetails.status?.length && (
                          <Bullet>{machineDetails.status}</Bullet>
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
      {machineDetails?.id.length === 0 && !isLoading ? (
        <InputError
          errorMessage={
            validError && formatText(validError, application, formatMessage)
          }
        />
      ) : null}
    </Box>
  )
}
