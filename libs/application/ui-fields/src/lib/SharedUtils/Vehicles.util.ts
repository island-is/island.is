import {
  BasicVehicleInformation,
  VehicleOwnerchangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
  VehicleOperatorChangeChecksByPermno,
  MachineDetails,
  EnergyFundVehicleDetailsWithGrant,
  VehicleValidationErrorMessage,
} from '@island.is/api/schema'
import { formatText } from '@island.is/application/core'
import { application } from 'express'
import { isMachine } from 'xstate/lib/utils'
import { mustInspectBeforeStreetRegistration } from '../FindVehicleFormField/FindVehicleFormField.util'
import { UseFormSetValue, FieldValues } from 'react-hook-form'

interface VehicleDetails {
  permno: string
  make: string
  color: string
  isDebtLess?: boolean
  validationErrorMessages?: VehicleValidationErrorMessage[]
  requireMileage?: boolean
  mileageReading: string
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

export const extractDetails = function (
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

export const setValues = (
  details: MachineDetails | VehicleDetails | EnergyFundVehicleDetailsWithGrant,
  setValue: UseFormSetValue<FieldValues>,
) => {
  if (isEnergyFunds) {
    setEnergyFundsValues(details as EnergyFundVehicleDetailsWithGrant, setValue)
  } else if (isMachine) {
    setMachineValues(details as MachineDetails, setValue)
  } else {
    setVehicleValues(details as VehicleDetails, setValue)
  }
}

const setVehicleValues = (
  vehicleDetails: VehicleDetails,
  setValue: UseFormSetValue<FieldValues>,
) => {
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

const setMachineValues = (
  machineDetails: MachineDetails,
  setValue: UseFormSetValue<FieldValues>,
) => {
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
  setMachineId(machineDetails?.id || '')
  setSubmitButtonDisabled &&
    setSubmitButtonDisabled(!machineDetails.disabled || false)
  setMachineDetails(machineDetails)
}

const setEnergyFundsValues = (
  vehicleDetailsWithGrant: EnergyFundVehicleDetailsWithGrant,
  setValue: UseFormSetValue<FieldValues>,
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
