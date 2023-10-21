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

export type FlightLeg =
  FlightLegsQuery['airDiscountSchemeFlightLegs'] extends Array<infer Item>
    ? Item
    : never
