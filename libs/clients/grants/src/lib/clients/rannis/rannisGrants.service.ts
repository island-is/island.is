import { Inject, Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

import { RannisGrantResponse } from './rannisGrants.types'
import { RannisGrantDto, mapRannisGrant } from './dtos/rannisGrant.dto'

const BASE_URL = 'https://sjodir.rannis.is/statistics/fund_schedule.php'

@Injectable()
export class RannisGrantService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  getGrants = async (): Promise<Array<RannisGrantDto>> => {
    const grants = await fetch(BASE_URL)

    if (!grants) {
      return []
    }

    const response: RannisGrantResponse = await grants.json()
    return response.map((o) => mapRannisGrant(o)).filter(isDefined)
  }
}
