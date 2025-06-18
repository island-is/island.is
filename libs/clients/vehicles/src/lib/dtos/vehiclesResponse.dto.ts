import { isDefined } from '@island.is/shared/utils'
import { CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse } from '../..'

export interface VehiclesResponseDto {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
  vehicles: Array<Vehicle>
}

export interface Vehicle {
  vehicleId: string
  registration?: {
    number: string
    code?: string
    name?: string
    subName?: string
  }
  userRole?: string
  make?: string
  color?: {
    name: string
    code: string
  }
  nextInspection?: Date
  isUserMainOperator?: boolean
  isOwnerLegalEntity?: boolean
  canRegisterMileage?: boolean
  requiresMileageRegistration?: boolean
  lastMileageRegistration?: {
    originCode: string
    mileage: number
    date: Date
    internalId?: number
  }
  co2?: string
}

export const mapVehicleResponseDto = (
  data?: CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse,
): VehiclesResponseDto | null => {
  if (
    !data ||
    !data.pageNumber ||
    !data.pageSize ||
    !data.totalPages ||
    !data.totalRecords
  ) {
    return null
  }

  return {
    pageNumber: data.pageNumber,
    pageSize: data.pageSize,
    totalPages: data.totalPages,
    totalRecords: data.totalRecords,
    vehicles:
      data.data
        ?.map((d) => {
          if (!d.permno) {
            return null
          }

          return {
            vehicleId: d.permno,
            registration: d.regno
              ? {
                  number: d.regno ?? undefined,
                  code: d.regTypeCode ?? undefined,
                  name: d.regTypeName ?? undefined,
                  subName: d.regTypeSubName ?? undefined,
                }
              : undefined,
            userRole: d.role ?? undefined,
            co2: d.co2?.toString() ?? undefined,
            make: d.make ?? undefined,
            color:
              d.colorName && d.colorCode
                ? {
                    name: d.colorName,
                    code: d.colorCode,
                  }
                : undefined,
            nextInspection: d.nextMainInspection
              ? d.nextMainInspection
              : undefined,
            isUserMainOperator:
              typeof d.mainOperator === 'boolean' ? d.mainOperator : undefined,
            isOwnerLegalEntity:
              typeof d.ownerLegalEntity === 'boolean'
                ? d.ownerLegalEntity
                : undefined,
            lastMileageRegistration:
              d.latestOriginCode && d.latestMileage && d.latestMileageReadDate
                ? {
                    originCode: d.latestOriginCode,
                    mileage: d.latestMileage,
                    date: d.latestMileageReadDate,
                    internalId: d.latestMileageInternalId ?? undefined,
                  }
                : undefined,

            canRegisterMileage: d.canRegisterMilage ?? undefined,
            requiresMileageRegistration:
              d.requiresMileageRegistration ?? undefined,
          }
        })
        .filter(isDefined) ?? [],
  }
}
