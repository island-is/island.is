import {
  AirDiscountSchemeFlightLegGender,
  AirDiscountSchemeFlightLegState,
  AirDiscountSchemePeriodInput,
  AirDiscountSchemeRangeInput,
  AirDiscountSchemeTravelInput,
} from '@island.is/api/schema'
import { FlightLegsQuery } from './Overview.generated'

export type TItem = {
  count: number
  discountPrice: number
  originalPrice: number
}

export type TSummary = {
  awaitingDebit: TItem
  awaitingCredit: TItem
  sentDebit: TItem
  sentCredit: TItem
  cancelled: TItem
}

export type FlightLegsFilters = {
  airline?: { value: string }
  flightLeg?: AirDiscountSchemeTravelInput
  period: AirDiscountSchemePeriodInput
  state?: AirDiscountSchemeFlightLegState[]
  age?: AirDiscountSchemeRangeInput
  gender?: { value: AirDiscountSchemeFlightLegGender | '' }
  postalCode?: number
  nationalId?: string
}

export type FlightLeg = FlightLegsQuery['airDiscountSchemeFlightLegs'] extends Array<
  infer Item
>
  ? Item
  : never
