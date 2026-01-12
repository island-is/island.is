import {
  BasicVehicleInformation,
  EnergyFundVehicleDetailsWithGrant,
  MachineDetails,
  VehicleOperatorChangeChecksByPermno,
  VehicleOwnerchangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
} from '@island.is/api/schema'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormText,
  FormatMessage,
} from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { VehicleDetails } from './types'

const REGISTRATION_TYPE_LENGTH = 2

export const energyFundsLabel = function (
  energyDetails: EnergyFundVehicleDetailsWithGrant | null,
  energyFundsMessages: Record<string, FormText> | undefined,
  formatMessage: FormatMessage,
  formatCurrency: (value: string) => string,
  application: Application,
): string {
  if (!energyDetails || !energyFundsMessages) {
    return ''
  }

  if (!energyDetails.hasReceivedSubsidy) {
    return formatMessage(
      energyFundsMessages.checkboxCheckableTag as MessageDescriptor,
      {
        amount: energyDetails.vehicleGrant
          ? `${formatCurrency(energyDetails.vehicleGrant.toString())}`
          : formatMessage(
              energyFundsMessages.carNotEligable as MessageDescriptor,
              energyFundsMessages.carNotEligible as Record<string, FormText>,
            ),
      },
    )
  } else {
    return formatText(
      energyFundsMessages.checkboxNotCheckable,
      application,
      formatMessage,
    )
  }
}

export const mustInspectBeforeStreetRegistration = (
  externalData: ExternalData,
  regNumber: string,
) => {
  const inspectBeforeTypes = getValueViaPath<string[]>(
    externalData,
    'typesMustInspectBeforeRegistration.data',
    [],
  )
  return (
    inspectBeforeTypes?.includes(
      regNumber.substring(0, REGISTRATION_TYPE_LENGTH),
    ) || false
  )
}

export const isInvalidRegistrationType = (
  externalData: ExternalData,
  regNumber: string,
) => {
  if (!regNumber || regNumber.length < REGISTRATION_TYPE_LENGTH) {
    return true
  }
  const validTypes = getValueViaPath<string[]>(
    externalData,
    'availableRegistrationTypes.data',
    [],
  )
  const inspectBeforeTypes = getValueViaPath<string[]>(
    externalData,
    'typesMustInspectBeforeRegistration.data',
    [],
  )

  const regType = regNumber.substring(0, REGISTRATION_TYPE_LENGTH)

  return (
    !validTypes?.includes(regType) && !inspectBeforeTypes?.includes(regType)
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
    vehicleHasMilesOdometer: basicInfo.vehicleHasMilesOdometer || false,
  }
}

const isResponseType = function <T>(
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

export const extractDetails = function (
  response:
    | VehicleOwnerchangeChecksByPermno
    | VehicleOperatorChangeChecksByPermno
    | VehiclePlateOrderChecksByPermno
    | MachineDetails
    | EnergyFundVehicleDetailsWithGrant
    | unknown,
): VehicleDetails | MachineDetails | EnergyFundVehicleDetailsWithGrant {
  // Use type guards to determine the response type and access properties safely
  if (
    isResponseType<VehicleOwnerchangeChecksByPermno>(
      response,
      'VehicleOwnerchangeChecksByPermno',
    ) ||
    isResponseType<VehicleOperatorChangeChecksByPermno>(
      response,
      'VehicleOperatorChangeChecksByPermno',
    )
  ) {
    return {
      ...extractCommonVehicleInfo(response.basicVehicleInformation),
      isDebtLess: response.isDebtLess ?? true,
      validationErrorMessages: response?.validationErrorMessages ?? [],
    }
  } else if (
    isResponseType<VehiclePlateOrderChecksByPermno>(
      response,
      'VehiclePlateOrderChecksByPermno',
    )
  ) {
    return {
      ...extractCommonVehicleInfo(response.basicVehicleInformation),
      isDebtLess: true,
      validationErrorMessages: response?.validationErrorMessages ?? [],
    }
  } else if (
    isResponseType<BasicVehicleInformation>(response, 'BasicVehicleInformation')
  ) {
    return {
      ...extractCommonVehicleInfo(response),
      isDebtLess: true,
    }
  } else if (isResponseType<MachineDetails>(response, 'MachineDetails')) {
    return {
      ...response,
    }
  } else if (
    isResponseType<EnergyFundVehicleDetailsWithGrant>(
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
