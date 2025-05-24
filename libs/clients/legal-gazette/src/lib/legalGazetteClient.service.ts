import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationType,
  LegalGazetteApplicationsApi as LegalGazetteApi,
  SubmitApplicationDto,
} from '../../gen/fetch'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOGGING_CATEGORY = 'legal-gazette-client-service'

@Injectable()
export class LegalGazetteClientService {
  constructor(
    private readonly legalGazetteApi: LegalGazetteApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private legalGazetteApiWithAuth(auth: Auth) {
    return this.legalGazetteApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCategories(auth: Auth) {
    try {
      return this.legalGazetteApiWithAuth(auth).getCategories({
        type: ApplicationType.AlmennAuglysing,
      })
    } catch (error) {
      this.logger.error('Failed to get categories', {
        error,
        category: LOGGING_CATEGORY,
      })

      throw error
    }
  }

  async submitApplication(
    body: SubmitApplicationDto,
    auth: Auth,
  ): Promise<void> {
    try {
      await this.legalGazetteApiWithAuth(auth).submitApplication({
        submitApplicationDto: body,
      })
    } catch (error) {
      this.logger.error('Failed to submit application', {
        error,
        category: LOGGING_CATEGORY,
      })

      throw error
    }
  }
}
