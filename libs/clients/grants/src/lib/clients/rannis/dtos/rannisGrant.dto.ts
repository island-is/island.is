import { GrantBase } from '../../../grant.types'
import { RannisGrantItem } from '../rannisGrants.types'

export interface RannisGrantDto extends GrantBase {
  id: string
  nameIs?: string
  nameEn?: string
  dateFrom?: Date
  dateTo?: Date
  url?: string
  isOpen?: boolean
}

export const mapRannisGrant = (
  grantItem: RannisGrantItem,
): RannisGrantDto | undefined => {
  if (!grantItem.fundid) {
    return undefined
  }
  return {
    id: grantItem.fundid,
    nameIs: grantItem.fund_name_is,
    nameEn: grantItem.fund_name_en,
    dateFrom: grantItem.datefrom ? new Date(grantItem.datefrom) : undefined,
    dateTo: grantItem.dateto ? new Date(grantItem.dateto) : undefined,
    url: grantItem.fund_url,
    isOpen: grantItem.is_open === '1',
  }
}
