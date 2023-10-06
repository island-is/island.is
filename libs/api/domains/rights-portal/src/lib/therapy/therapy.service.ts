import { Inject, Injectable } from '@nestjs/common'
import { TherapyApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOG_CATEGORY = 'rights-portal-therapy'

@Injectable()
export class TherapyService {
  constructor(
    private api: TherapyApi,

    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}
  getTherapies = (user: User) => {
    try {
      return this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getTherapies()
    } catch (error) {
      this.logger.error('Error getting therapies', {
        ...error,
        category: LOG_CATEGORY,
      })

      return handle404(error)
    }
  }
}
