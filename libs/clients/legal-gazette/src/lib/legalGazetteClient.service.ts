import { Inject, Injectable } from '@nestjs/common'
import {
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
