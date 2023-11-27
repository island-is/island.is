import { VehiclesCurrentVehicle } from '../shared/types'

//Rules are:
//vehicleRegistrationCode = M1
//import values is 2 or 4 -> use newRegistrationDate -> if after 1.jan 2024 = 900.000
//import value is 1 -> use firstRegistrationDate -> if less than a year = 700.000

//vehicleRegistrationCode = N1
//import values is 2 or 4 -> use newRegistrationDate -> if after 1.jan 2024 = 500.000
//import value is 1 -> use firstRegistrationDate -> if less than a year = 400.000

export const getVehicleGrantAmount = (vehicle: VehiclesCurrentVehicle) => {
  const importCode = vehicle.importCode
  const vehicleRegistrationCode = vehicle.vehicleRegistrationCode
  const newRegistrationDate = vehicle.newRegistrationDate
    ? new Date(vehicle.newRegistrationDate)
    : ''
  const firstRegistrationDate = vehicle.firstRegistrationDate
    ? new Date(vehicle.firstRegistrationDate)
    : ''

  const oneYearAgo = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1),
  )

  if (vehicleRegistrationCode === 'M1') {
    if (
      (importCode === '2' || importCode === '4') &&
      newRegistrationDate >= new Date(2021, 0, 1)
    ) {
      return 900
    } else if (
      importCode === '1' &&
      new Date(firstRegistrationDate) >= oneYearAgo
    ) {
      return 700
    }
  } else if (vehicleRegistrationCode === 'N1') {
    if (
      (importCode === '2' || importCode === '4') &&
      newRegistrationDate >= new Date(2021, 0, 1)
    ) {
      return 500
    } else if (
      importCode === '1' &&
      new Date(firstRegistrationDate) >= oneYearAgo
    ) {
      return 400
    }
  }
}
