import {
  BasicVehicleInformation,
  MyPlateOwnershipChecksByRegno,
  VehicleOperatorChangeChecksByPermno,
  VehicleOwnerchangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
} from '@island.is/api/schema'
import { PlateOwnershipValidation, VehicleDetails } from './types'

export const getItemAtIndex = <T>(
  itemList: T[],
  index: string,
): T | undefined => {
  const parsedIndex = parseInt(index, 10)
  if (isNaN(parsedIndex) || parsedIndex < 0) {
    return undefined
  }
  return itemList[parsedIndex]
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
    | VehicleOperatorChangeChecksByPermno
    | VehiclePlateOrderChecksByPermno
    | unknown,
): VehicleDetails | PlateOwnershipValidation {
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
    isResponseType<MyPlateOwnershipChecksByRegno>(
      response,
      'MyPlateOwnershipChecksByRegno',
    )
  ) {
    return {
      validationErrorMessages: response?.validationErrorMessages ?? [],
    }
  } else if (
    isResponseType<BasicVehicleInformation>(response, 'BasicVehicleInformation')
  ) {
    return {
      ...extractCommonVehicleInfo(response),
      isDebtLess: true,
    }
  } else {
    // Handle unexpected response types
    throw new Error('Unexpected response type')
  }
}
