import { downloadVehicleOwnedFile } from './downloadVehicleOwnedFile'
import { VehiclesVehicle } from '@island.is/api/schema'
import {
  vehicleCoOwnedDataHeader,
  vehicleOperatorDataHeader,
  vehicleOwnedDataHeader,
} from './dataHeaders'
import isValid from 'date-fns/isValid'

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
    const firstRegDate = item.firstRegDate && new Date(item.firstRegDate)
    const operatorStartDate =
      item.operatorStartDate && new Date(item.operatorStartDate)
    const lastInspectionDate =
      item.lastInspectionDate && new Date(item.lastInspectionDate)
    const nextInspectionDate =
      item.nextInspection?.nextInspectionDate &&
      new Date(item.nextInspection.nextInspectionDate)

    return [
      item.permno,
      item.regno,
      item.type,
      firstRegDate && isValid(firstRegDate)
        ? firstRegDate.toLocaleDateString()
        : '',
      operatorStartDate && isValid(operatorStartDate)
        ? operatorStartDate.toLocaleDateString()
        : '',
      nationalId,
      name,
      item.ownerSsid === nationalId ? 'Já' : 'Nei',
      item.otherOwners ? 'Já' : 'Nei',
      item.termination,
      item.vehicleStatus,
      item.useGroup,
      item.lastInspectionResult,
      lastInspectionDate && isValid(lastInspectionDate)
        ? lastInspectionDate.toLocaleDateString()
        : '',
      item.lastInspectionType,
      nextInspectionDate && isValid(nextInspectionDate)
        ? nextInspectionDate.toLocaleDateString()
        : '',
    ]
  })

  const coOwnersData = coOwnerVehicles.map((item: VehiclesVehicle) => {
    const firstRegDate = item.firstRegDate && new Date(item.firstRegDate)
    const operatorStartDate =
      item.operatorStartDate && new Date(item.operatorStartDate)
    const lastInspectionDate =
      item.lastInspectionDate && new Date(item.lastInspectionDate)
    const nextInspectionDate =
      item.nextInspection?.nextInspectionDate &&
      new Date(item.nextInspection.nextInspectionDate)
    return [
      item.permno,
      item.regno,
      item.type,
      firstRegDate && isValid(firstRegDate)
        ? firstRegDate.toLocaleDateString()
        : '',
      operatorStartDate && isValid(operatorStartDate)
        ? operatorStartDate.toLocaleDateString()
        : '',
      nationalId,
      name,
      item.ownerSsid === nationalId ? 'Já' : 'Nei',
      item.otherOwners ? 'Já' : 'Nei',
      item.termination,
      item.vehicleStatus,
      item.useGroup,
      item.lastInspectionResult,
      lastInspectionDate && isValid(lastInspectionDate)
        ? lastInspectionDate.toLocaleDateString()
        : '',
      item.lastInspectionType,
      nextInspectionDate && isValid(nextInspectionDate)
        ? nextInspectionDate.toLocaleDateString()
        : '',
    ]
  })

  const operatorsData = operatorVehicles.map((item: VehiclesVehicle) => {
    const firstRegDate = item.firstRegDate && new Date(item.firstRegDate)
    const operatorStartDate =
      item.operatorStartDate && new Date(item.operatorStartDate)
    const lastInspectionDate =
      item.lastInspectionDate && new Date(item.lastInspectionDate)
    const nextInspectionDate =
      item.nextInspection?.nextInspectionDate &&
      new Date(item.nextInspection.nextInspectionDate)

    return [
      item.permno,
      item.regno,
      item.type,
      firstRegDate && isValid(firstRegDate)
        ? firstRegDate.toLocaleDateString()
        : '',
      operatorStartDate && isValid(operatorStartDate)
        ? operatorStartDate.toLocaleDateString()
        : '',
      item.ownerSsid,
      item.ownerName,
      item.primaryOperator ? 'Já' : 'Nei',
      item.operatorNumber,
      item.termination,
      item.vehicleStatus,
      item.useGroup,
      item.lastInspectionResult,
      lastInspectionDate && isValid(lastInspectionDate)
        ? lastInspectionDate.toLocaleDateString()
        : '',
      item.lastInspectionType,
      nextInspectionDate && isValid(nextInspectionDate)
        ? nextInspectionDate.toLocaleDateString()
        : '',
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
