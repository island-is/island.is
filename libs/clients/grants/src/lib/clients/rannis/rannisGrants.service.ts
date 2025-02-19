import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { RannisGrantResponse } from './rannisGrants.types'
import { RannisGrantDto, mapRannisGrant } from './dtos/rannisGrant.dto'

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

    return object.map((o) => mapRannisGrant(o)).filter(isDefined)
  }
}
