import { GrantBase } from '../../../grant.types'
import { parseDateSafely } from '../../../utils'
import { RannisGrantItem } from '../rannisGrants.types'

export interface RannisGrantDto extends GrantBase {
  id: string
  fundId?: string
  name: string
  dateFrom?: Date
  dateTo?: Date
  url?: string
  isOpen?: boolean
}

export const mapRannisGrant = (
  grantItem: RannisGrantItem,
): RannisGrantDto | undefined =>
  mapGrant('id' in grantItem ? grantItem.id : grantItem.fundid, grantItem)

const mapGrant = (
  id: string,
  grantItem: RannisGrantItem,
): RannisGrantDto | undefined => {
  return {
    id: id,
    fundId: grantItem.fundid,
    name: grantItem.fund_name,
    dateFrom: grantItem.datefrom
      ? parseDateSafely(grantItem.datefrom)
      : undefined,
    dateTo: grantItem.dateto ? parseDateSafely(grantItem.dateto) : undefined,
    url: grantItem.fund_url,
    isOpen: grantItem.is_open === '1',
  }
}
