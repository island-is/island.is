import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { GrantProvider } from './grants.types'
import { Inject } from '@nestjs/common'
import { RannisGrantService } from './clients/rannis/src'
import { User } from '@island.is/auth-nest-tools'

export class GrantService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly rannisService: RannisGrantService,
  ) {}

  getGrants = (user: User, grantProvider?: GrantProvider) => {
    //temp until more providers arrive
    return this.rannisService.getGrants(user)
  }
}
