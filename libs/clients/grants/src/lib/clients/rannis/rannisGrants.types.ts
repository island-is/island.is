export const RANNIS_CLIENT = 'rannisClient'

export type RannisGrantResponse = Array<RannisGrantItem>

export type DeprecatedRannisGrantItem = {
  fundid: string
  fund_name: string
  datefrom: string
  dateto: string
  fund_url: string
  is_open: string
}

export type NewRannisGrantItem = {
  id: string
  fundid: string
  app_type: string
  app_type_name: string
  fund_name: string
  datefrom: string
  dateto: string
  fund_url: string
  is_open: string
}

export type RannisGrantItem = DeprecatedRannisGrantItem | NewRannisGrantItem
