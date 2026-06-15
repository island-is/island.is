import type {
  CrewRegistrationsByShipDto,
  CrewRegistrationsByShipResponseDto,
  FishermanShipCrewRegistrationRequestDto,
} from '../../../gen/fetch'
import { parseDate } from '../utils'

export interface SailorSeaServiceFilterDto {
  dateFrom?: string
  dateTo?: string
  rankId?: number
  fromOrEqLength?: number
  fromOrEqMainEnginePower?: number
  fromOrEqBruttoWeight?: number
  pageNumber?: number
  pageSize?: number
}

export interface SailorSeaServiceEntryDto {
  shipName?: string
  shipRegistrationNumber?: string
  rank?: string
  rankEn?: string
  startDate?: Date
  endDate?: Date
  numberOfDays?: number
}

export interface SailorSeaServiceResponseDto {
  entries: SailorSeaServiceEntryDto[]
  totalCount: number
  hasNextPage: boolean
  totalCrewRegistrationDayCount: number
  seaServiceDayCount: number
  workAshoreDayCount: number
  totalWorkDays: number
}

export const mapSeaServiceFilter = (
  filters?: SailorSeaServiceFilterDto,
): FishermanShipCrewRegistrationRequestDto => ({
  date_from: filters?.dateFrom,
  date_to: filters?.dateTo,
  rank_id: filters?.rankId !== undefined ? BigInt(filters.rankId) : undefined,
  from_or_eq_length: filters?.fromOrEqLength,
  from_or_eq_main_engine_power: filters?.fromOrEqMainEnginePower,
  from_or_eq_brutto_weight: filters?.fromOrEqBruttoWeight,
  page_number: filters?.pageNumber,
  page_size: filters?.pageSize,
})

export const mapSeaServiceEntry = (
  entry: CrewRegistrationsByShipDto,
): SailorSeaServiceEntryDto => ({
  shipName: entry.shipName,
  shipRegistrationNumber: entry.shipRegistrationNo,
  rank: entry.rankNameAndCode.is,
  rankEn: entry.rankNameAndCode.en,
  startDate: entry.startDate
    ? parseDate(entry.startDate) ?? undefined
    : undefined,
  endDate: entry.endDate ? parseDate(entry.endDate) ?? undefined : undefined,
  numberOfDays: Number(entry.numberOfDays),
})

export const mapSeaServiceResponse = (
  response: CrewRegistrationsByShipResponseDto,
): SailorSeaServiceResponseDto => ({
  entries: response.crewRegistrations.map(mapSeaServiceEntry),
  totalCount: response.pagination.totalRecordCount,
  hasNextPage:
    response.pagination.pageNumber < response.pagination.numberOfPages,
  totalCrewRegistrationDayCount: response.totalCrewRegistrationDayCount,
  seaServiceDayCount: response.seaServiceDayCount,
  workAshoreDayCount: response.workAshoreDayCount,
  totalWorkDays: response.totalWorkDays,
})
