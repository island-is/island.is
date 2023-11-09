import { downloadVehicleOwnedFile } from './downloadVehicleOwnedFile'
import {
  vehicleOperatorDataHeader,
  vehicleOwnedDataHeader,
} from './dataHeaders'
import isValid from 'date-fns/isValid'
import { LOCALE } from './constants'
import {
  Query,
  VehicleUserTypeEnum,
  VehiclesDetail,
} from '@island.is/api/schema'

export const exportVehicleOwnedDocument = async (
  data: any,
  fileName: string,
  name: string,
  nationalId: string,
) => {
  return await downloadVehicleOwnedFile(
    fileName,
    name,
    nationalId,
    [vehicleOwnedDataHeader, vehicleOperatorDataHeader],
    [
      filterOwners(VehicleUserTypeEnum.eigandi, data, nationalId, name) ?? [],
      filterOwners(VehicleUserTypeEnum.umradamadur, data, nationalId, name) ??
        [],
    ],
  )
}

function filterOwners(
  role: VehicleUserTypeEnum,
  vehicles: Array<VehiclesDetail>,
  nationalId: string,
  name: string,
) {
  let filteredVehicles

  switch (role) {
    case VehicleUserTypeEnum.eigandi:
      filteredVehicles = vehicles.filter(
        (item) => item.currentOwnerInfo?.nationalId === nationalId,
      )
      break
    case VehicleUserTypeEnum.medeigandi:
      filteredVehicles = vehicles.filter(
        (item) =>
          item.coOwners?.find((x) => x.nationalId === nationalId) !== undefined,
      )
      break

    case VehicleUserTypeEnum.umradamadur:
      filteredVehicles = vehicles.filter(
        (item) =>
          item.operators?.find((owner) => owner.nationalId === nationalId) !==
          undefined,
      )
      break

    default:
      break
  }

  return filteredVehicles?.map((item: VehiclesDetail) => {
    const firstRegDate =
      item.registrationInfo?.firstRegistrationDate &&
      new Date(item.registrationInfo?.firstRegistrationDate)
    const operatorStartDate =
      item.operators?.length && new Date(item.operators[0].startDate)
    const lastInspectionDate =
      item.inspectionInfo?.lastInspectionDate &&
      new Date(item.inspectionInfo?.lastInspectionDate)
    const nextInspectionDate =
      item.inspectionInfo?.nextInspectionDate &&
      new Date(item.inspectionInfo?.nextInspectionDate)

    const operator = item.operators?.find((x) => x.nationalId === nationalId)

    return [
      item.basicInfo?.permno,
      item.basicInfo?.regno,
      `${item.mainInfo?.model} ${item.mainInfo?.subModel}`,
      firstRegDate && isValid(firstRegDate)
        ? firstRegDate.toLocaleDateString(LOCALE)
        : '',
      operatorStartDate && isValid(operatorStartDate)
        ? operatorStartDate.toLocaleDateString(LOCALE)
        : '',
      role === VehicleUserTypeEnum.eigandi
        ? nationalId
        : item.currentOwnerInfo?.nationalId,
      role === VehicleUserTypeEnum.eigandi
        ? name
        : item.currentOwnerInfo?.owner,
      role === VehicleUserTypeEnum.eigandi
        ? item.currentOwnerInfo?.nationalId === nationalId
          ? 'Já'
          : 'Nei'
        : operator?.mainoperator
        ? 'Já'
        : 'Nei',
      role === VehicleUserTypeEnum.eigandi
        ? (item.coOwners?.length ?? 0) > 0
          ? 'Já'
          : 'Nei'
        : operator?.serial !== 0
        ? operator?.serial
        : '',
      item.isOutOfCommission,
      item.basicInfo?.vehicleStatus,
      item.registrationInfo?.useGroup,
      item.inspectionInfo?.result,
      lastInspectionDate && isValid(lastInspectionDate)
        ? lastInspectionDate.toLocaleDateString(LOCALE)
        : '',
      item.inspectionInfo?.type,
      nextInspectionDate && isValid(nextInspectionDate)
        ? nextInspectionDate.toLocaleDateString(LOCALE)
        : '',
    ]
  })
}
