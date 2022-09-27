import { downloadVehicleOwnedFile } from './downloadVehicleOwnedFile'
import { VehiclesVehicle } from '@island.is/api/schema'
import {
  vehicleCoOwnedDataHeader,
  vehicleOperatorDataHeader,
  vehicleOwnedDataHeader,
} from './dataHeaders'

export const exportVehicleOwnedDocument = async (
  data: any[],
  fileName: string,
  name: string,
  nationalId: string,
) => {
  const ownersVehicles = data.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'eigandi',
  )

  const coOwnerVehicles = data.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'meðeigandi',
  )

  const operatorVehicles = data.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'umráðamaður',
  )

  const ownersData = ownersVehicles.map((item: VehiclesVehicle) => {
    return [
      item.permno,
      item.regno,
      item.type,
      item.firstRegDate
        ? new Date(item.firstRegDate?.toString()).toLocaleDateString()
        : '',
      item.operatorStartDate
        ? new Date(item.operatorStartDate).toLocaleDateString()
        : '',
      nationalId,
      name,
      item.ownerPersidno === nationalId ? 'Já' : 'Nei',
      item.otherOwners ? 'Já' : 'Nei',
      item.termination,
      item.vehicleStatus,
      item.useGroup,
      item.nextInspection?.nextInspectionDate,
    ]
  })

  const coOwnersData = coOwnerVehicles.map((item: VehiclesVehicle) => {
    return [
      item.permno,
      item.regno,
      item.type,
      item.firstRegDate
        ? new Date(item.firstRegDate?.toString()).toLocaleDateString()
        : '',
      item.operatorStartDate
        ? new Date(item.operatorStartDate).toLocaleDateString()
        : '',
      nationalId,
      name,
      item.ownerPersidno === nationalId ? 'Já' : 'Nei',
      item.otherOwners ? 'Já' : 'Nei',
      item.termination,
      item.vehicleStatus,
      item.useGroup,
      item.nextInspection?.nextInspectionDate,
    ]
  })

  // TODO: Get correct data from service to match these columns.
  const operatorsData = operatorVehicles.map((item: VehiclesVehicle) => {
    return [
      item.permno,
      item.regno,
      item.type,
      item.firstRegDate
        ? new Date(item.firstRegDate?.toString()).toLocaleDateString()
        : '',
      item.operatorStartDate
        ? new Date(item.operatorStartDate).toLocaleDateString()
        : '',
      item.ownerPersidno,
      '?',
      '? Aðal umr.',
      '? Nr. umr.',
      item.termination,
      item.vehicleStatus,
      item.useGroup,
      item.nextInspection?.nextInspectionDate,
    ]
  })

  await downloadVehicleOwnedFile(
    fileName,
    name,
    nationalId,
    [
      vehicleOwnedDataHeader,
      vehicleCoOwnedDataHeader,
      vehicleOperatorDataHeader,
    ],
    [ownersData, coOwnersData, operatorsData],
  )
}
