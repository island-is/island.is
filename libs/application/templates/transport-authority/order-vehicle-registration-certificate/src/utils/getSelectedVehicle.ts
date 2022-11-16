import { Application, VehiclesCurrentVehicle } from '../types/schema'

export const getSelectedVehicle = (application: Application) => {
  const currentVehicleList = application.externalData?.currentVehicleList
    ?.data as VehiclesCurrentVehicle[]
  const vehicleValue = application.answers?.pickVehicle?.vehicle
  const vehicleValueNum = parseInt(vehicleValue, 10)
  return !isNaN(vehicleValueNum)
    ? currentVehicleList[vehicleValueNum]
    : undefined
}
