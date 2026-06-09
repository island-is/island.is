import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { CurrentVehiclesAndRecords, VehiclesCurrentVehicle } from '../shared'

export const getSelectedVehicle = (
  externalData: ExternalData,
  answers: FormValue,
): VehiclesCurrentVehicle | undefined => {
  const selectedPlate = getValueViaPath(
    answers,
    'pickVehicle.plate',
    '',
  ) as string
  const selectedType = getValueViaPath(
    answers,
    'pickVehicle.type',
    '',
  ) as string
  const mileageReading = getValueViaPath(
    answers,
    'vehicleMileage.mileageReading',
    '',
  ) as string

  if (
    getValueViaPath<boolean | undefined>(answers, 'pickVehicle.findVehicle')
  ) {
    const vehicle = getValueViaPath(
      answers,
      'pickVehicle',
    ) as VehiclesCurrentVehicle

    return {
      ...vehicle,
      permno: vehicle?.permno ?? selectedPlate,
      make: vehicle?.make ?? selectedType,
      mileageReading: mileageReading || vehicle?.mileageReading,
    }
  }

  const currentVehicleList =
    (externalData?.currentVehicleList?.data as CurrentVehiclesAndRecords) ??
    undefined

  const selectedVehicle = currentVehicleList?.vehicles?.find(
    (vehicle) => vehicle.permno === selectedPlate,
  )

  if (selectedVehicle) {
    return {
      ...selectedVehicle,
      mileageReading: mileageReading || selectedVehicle.mileageReading,
    }
  }

  if (selectedPlate) {
    const vehicle = getValueViaPath(
      answers,
      'pickVehicle',
    ) as VehiclesCurrentVehicle

    return {
      ...vehicle,
      permno: vehicle?.permno ?? selectedPlate,
      make: vehicle?.make ?? selectedType,
      mileageReading: mileageReading || vehicle?.mileageReading,
    }
  }

  const vehicleIndex = getValueViaPath(
    answers,
    'pickVehicle.vehicle',
    '',
  ) as string

  const index = parseInt(vehicleIndex, 10)

  const vehicle = currentVehicleList?.vehicles?.[index]

  if (vehicle) {
    return {
      ...vehicle,
      mileageReading: mileageReading || vehicle.mileageReading,
    }
  }

  return undefined
}
