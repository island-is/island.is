export const RANNIS_CLIENT = 'rannisClient'

export type RannisGrantResponse = Array<RannisGrantItem>

export interface RannisGrantItem {
  fundid: string
  fund_name_is: string
  fund_name_en: string
  datefrom: string
  dateto: string
  fund_url: string
  is_open: string
}
