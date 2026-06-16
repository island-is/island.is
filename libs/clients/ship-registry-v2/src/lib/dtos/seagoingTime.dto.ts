import type {
  CrewRegistrationsByShipDto,
  CrewRegistrationsByShipResponseDto,
  FishermanShipCrewRegistrationRequestDto,
} from '../../../gen/fetch'
import { parseDate } from '../utils'

export interface SeagoingTimeFilterDto {
  dateFrom?: string
  dateTo?: string
  rankId?: number
  fromOrEqLength?: number
  fromOrEqMainEnginePower?: number
  fromOrEqBruttoWeight?: number
  pageNumber?: number
  pageSize?: number
}

export interface CrewRegistrationValueUnitDto {
  value: string
  unit?: string
}

export interface CrewRegistrationDto {
  shipName?: string
  shipRegistrationNumber?: string
  rank?: string
  rankEn?: string
  startDate?: Date
  endDate?: Date
  numberOfDays?: number
  length?: CrewRegistrationValueUnitDto
  grossTonnage?: CrewRegistrationValueUnitDto
  mainEngine?: CrewRegistrationValueUnitDto
}

export interface CrewRegistrationLabelTranslationDto {
  is: string
  en: string
}

export interface CrewRegistrationLabelsDto {
  shipName?: CrewRegistrationLabelTranslationDto
  length?: CrewRegistrationLabelTranslationDto
  grossTonnage?: CrewRegistrationLabelTranslationDto
  mainEngine?: CrewRegistrationLabelTranslationDto
  shipRegistrationNo?: CrewRegistrationLabelTranslationDto
  rankNameAndCode?: CrewRegistrationLabelTranslationDto
  startDate?: CrewRegistrationLabelTranslationDto
  endDate?: CrewRegistrationLabelTranslationDto
  numberOfDays?: CrewRegistrationLabelTranslationDto
}

export interface SeagoingTimeResponseDto {
  entries: CrewRegistrationDto[]
  totalCount: number
  hasNextPage: boolean
  totalCrewRegistrationDayCount: number
  seaServiceDayCount: number
  workAshoreDayCount: number
  totalWorkDays: number
  header?: CrewRegistrationLabelsDto
}

export const mapSeagoingTimeFilter = (
  filters?: SeagoingTimeFilterDto,
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

export const mapCrewRegistration = (
  entry: CrewRegistrationsByShipDto,
): CrewRegistrationDto => ({
  shipName: entry.shipName,
  shipRegistrationNumber: entry.shipRegistrationNo,
  rank: entry.rankNameAndCode.is,
  rankEn: entry.rankNameAndCode.en,
  startDate: entry.startDate
    ? parseDate(entry.startDate) ?? undefined
    : undefined,
  endDate: entry.endDate ? parseDate(entry.endDate) ?? undefined : undefined,
  numberOfDays: Number(entry.numberOfDays),
  length: entry.length
    ? { value: entry.length.value, unit: entry.length.unit ?? undefined }
    : undefined,
  grossTonnage: entry.bruttoGrossTonnage
    ? { value: entry.bruttoGrossTonnage.value, unit: entry.bruttoGrossTonnage.unit ?? undefined }
    : undefined,
  mainEngine: entry.mainEngineKw
    ? { value: entry.mainEngineKw.value, unit: entry.mainEngineKw.unit ?? undefined }
    : undefined,
})

export const mapSeagoingTimeResponse = (
  response: CrewRegistrationsByShipResponseDto,
): SeagoingTimeResponseDto => ({
  entries: response.crewRegistrations.map(mapCrewRegistration),
  totalCount: response.pagination.totalRecordCount,
  hasNextPage:
    response.pagination.pageNumber < response.pagination.numberOfPages,
  totalCrewRegistrationDayCount: response.totalCrewRegistrationDayCount,
  seaServiceDayCount: response.seaServiceDayCount,
  workAshoreDayCount: response.workAshoreDayCount,
  totalWorkDays: response.totalWorkDays,
  header: response.header
    ? {
        ...response.header,
        grossTonnage: response.header.bruttoGrossTonnage,
        mainEngine: response.header.mainEngineKw,
      }
    : undefined,
})
