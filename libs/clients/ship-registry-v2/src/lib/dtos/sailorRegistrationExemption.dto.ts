import { RegistrationExemptionDto } from '../../../gen/fetch'
import { parseDate } from '../utils'

export interface SailorRegistrationExemptionDto {
  id: string
  shipRegistrationNo?: string
  shipName: string
  rank: string
  advertised: string
  exemptionLowerStatus: string
  dateFrom?: Date
  dateTo?: Date
  numberOfDays: number
}

export const mapRegistrationExemption = (
  dto: RegistrationExemptionDto,
  index: number,
): SailorRegistrationExemptionDto => ({
  id: String(index),
  shipRegistrationNo:
    dto.shipRegistrationNo != null ? String(dto.shipRegistrationNo) : undefined,
  shipName: dto.shipName,
  rank: dto.rank?.is ?? '',
  advertised: dto.advertised?.is ?? '',
  exemptionLowerStatus: dto.exemptionLowerStatus?.is ?? '',
  dateFrom: dto.dateFrom ? parseDate(dto.dateFrom) ?? undefined : undefined,
  dateTo: dto.dateTo ? parseDate(dto.dateTo) ?? undefined : undefined,
  numberOfDays: Number(dto.numberOfDays ?? 0),
})
