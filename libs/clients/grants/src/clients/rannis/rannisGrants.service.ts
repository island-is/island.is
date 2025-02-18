import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { RannisGrantResponse } from './rannisGrants.types'
import { RannisGrantDto } from './dtos/rannisGrant.dto'

const BASE_URL = 'https://sjodir.rannis.is/statistics/fund_schedule.php'

@Injectable()
export class RannisGrantService {
  getGrants = async (): Promise<Array<RannisGrantDto>> => {
    const grants = await fetch(BASE_URL)

    if (!grants) {
      return []
    }

    const jsonData = await grants.json()
    const object: RannisGrantResponse = JSON.parse(jsonData)

    return object
      .map((grant) => {
        if (!grant.fundid) {
          return undefined
        }
        return {
          id: grant.fundid,
          nameIs: grant.fund_name_is,
          nameEn: grant.fund_name_en,
          dateFrom: grant.datefrom ? new Date(grant.datefrom) : undefined,
          dateTo: grant.dateto ? new Date(grant.dateto) : undefined,
          url: grant.fund_url,
          isOpen: grant.is_open === '1',
        }
      })
      .filter(isDefined)
  }
}
