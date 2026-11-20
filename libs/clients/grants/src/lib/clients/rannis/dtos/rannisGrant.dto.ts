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

const toOptionalString = (value: unknown): string | undefined =>
  value === null || value === undefined || value === ''
    ? undefined
    : String(value)

export const mapRannisGrant = (
  grantItem: RannisGrantItem,
): RannisGrantDto | undefined => {
  const id = toOptionalString(
    'id' in grantItem ? grantItem.id : grantItem.fundid,
  )
  if (!id) {
    return undefined
  }
  return mapGrant(id, grantItem)
}

const mapGrant = (
  id: string,
  grantItem: RannisGrantItem,
): RannisGrantDto | undefined => {
  return {
    id,
    fundId: toOptionalString(grantItem.fundid),
    name: grantItem.fund_name,
    dateFrom: grantItem.datefrom
      ? parseDateSafely(grantItem.datefrom)
      : undefined,
    dateTo: grantItem.dateto ? parseDateSafely(grantItem.dateto) : undefined,
    url: grantItem.fund_url,
    isOpen: String(grantItem.is_open) === '1',
  }
}
