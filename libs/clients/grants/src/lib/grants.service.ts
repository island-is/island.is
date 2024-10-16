import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { GrantProvider } from './grants.types'
import { Inject } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { RannisGrantService } from './clients/rannis/src/lib/rannisGrants.service'

export class GrantsService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly rannisService: RannisGrantService,
  ) {}

  getGrants = (grantProvider?: GrantProvider) => {
    //temp until more providers arrive
    return this.rannisService.getGrants()
  }
}
