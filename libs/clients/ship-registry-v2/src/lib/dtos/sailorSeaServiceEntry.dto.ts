// Temp response type — the OpenAPI spec does not yet define a typed response
// for POST /sailor/crewregistrationsbyship. Shape derived from known fields.
export interface SailorSeaServiceFilterDto {
  dateFrom?: string
  dateTo?: string
  rankId?: number
  fromOrEqLength?: number
  fromOrEqMainEnginePower?: number
  fromOrEqBruttoWeight?: number
}

export interface SailorSeaServiceEntryDto {
  shipName?: string
  shipRegistrationNumber?: string
  rank?: string
  rankCode?: string
  startDate?: string
  endDate?: string
  numberOfDays?: number
}
