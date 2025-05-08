import { isDefined } from '@island.is/shared/utils'
import { MileageReadingDto } from '../..'

export interface MileageHistoryDto {
  vehicleId: string
  registrationHistory: Array<MileageReading>
}

export interface MileageReading {
  readDate: Date
  originCode: string
  mileage: number
  internalId?: number
  operation?: string
  reportingNationalId?: string
  transactionDate?: Date
}

export const mapMileageReadingsDto = (
  data: Array<MileageReadingDto>,
): Array<MileageReading> =>
  data
    .map((h) => {
      if (!h.originCode || !h.mileage || !h.readDate) {
        return null
      }
      return {
        readDate: h.readDate,
        originCode: h.originCode,
        mileage: h.mileage,
        internalId: h.internalId ?? undefined,
        operation: h.operation ?? undefined,
        reportingNationalId: h.reportingPersidno ?? undefined,
        transactionDate: h.transactionDate ?? undefined,
      }
    })
    .filter(isDefined)
