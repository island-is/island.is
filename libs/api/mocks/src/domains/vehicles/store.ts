import { createStore } from '@island.is/shared/mocking'
import { singleVehicle, vehicleDetail, vehicleMileageDetail } from './factories'
import { VehiclesDetail } from '../../types'

export const store = createStore(() => {
  const vehicleList = singleVehicle.list(10)

  const vehicleDetails = vehicleList.map((item) => ({
    ...vehicleDetail({
      basicInfo: { permno: item.permno },
      mainInfo: {
        regno: item.regno,
        model: item.make,
        requiresMileageRegistration: item.requiresMileageRegistration,
      },
      registrationInfo: {
        color: item.colorName,
      },
      inspectionInfo: {
        nextInspectionDate: item.nextMainInspection,
      },
    }),
  })) as VehiclesDetail[]

  const vehicleMileageDetails = vehicleList.map((item) => ({
    ...vehicleMileageDetail({
      permno: item.permno,
      requiresMileageRegistration: item.requiresMileageRegistration,
    }),
  }))

  return {
    getVehicleList: vehicleList,
    vehicleDetails,
    vehicleMileageDetails: vehicleMileageDetails,
  }
})
