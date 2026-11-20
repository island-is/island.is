export const RANNIS_CLIENT = 'rannisClient'

export type RannisGrantResponse = Array<RannisGrantItem>

// Rannis has served ids and flags both as strings ("71", "1") and as
// numbers (71, 1), so accept either and normalize in the DTO mapper.
type RannisNumericValue = string | number

export type DeprecatedRannisGrantItem = {
  fundid: RannisNumericValue
  fund_name: string
  datefrom: string
  dateto: string
  fund_url: string
  is_open: RannisNumericValue
}

export type NewRannisGrantItem = {
  id: RannisNumericValue
  fundid: RannisNumericValue
  app_type: string
  app_type_name: string
  fund_name: string
  datefrom: string
  dateto: string
  fund_url: string
  is_open: RannisNumericValue
}

export type RannisGrantItem = DeprecatedRannisGrantItem | NewRannisGrantItem
