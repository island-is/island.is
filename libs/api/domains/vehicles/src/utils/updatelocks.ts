import { VehiclesUpdatelocks } from '../models/getVehicleDetail.model'

export const getVehicleOwnerchangeUpdatelocks = (
  updatelocks: VehiclesUpdatelocks[] | undefined,
) => {
  const vehicleOwnershipUpdatelocks = ['1', '2', '4', '5', '6', '10']

  return updatelocks?.filter((x) =>
    vehicleOwnershipUpdatelocks.includes(x.lockNo || ''),
  )
}
