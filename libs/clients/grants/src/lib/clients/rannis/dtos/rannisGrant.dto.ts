import { GrantBase } from '../../../grant.types'
import { parseDateSafely } from '../../../utils'
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
    dateFrom: grantItem.datefrom
      ? parseDateSafely(grantItem.datefrom)
      : undefined,
    dateTo: grantItem.dateto ? parseDateSafely(grantItem.dateto) : undefined,
    url: grantItem.fund_url,
    isOpen: grantItem.is_open === '1',
  }
}
