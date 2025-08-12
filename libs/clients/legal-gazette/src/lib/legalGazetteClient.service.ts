import { Inject, Injectable } from '@nestjs/common'
import {
  LegalGazetteCommonApplicationApi,
  SubmitCommonApplicationDto,
} from '../../gen/fetch'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOGGING_CATEGORY = 'legal-gazette-client-service'

const COMMON_APPLICATION_TYPE_ID = 'a58fe2a8-b0a9-47bd-b424-4b9cece0e622'

@Injectable()
export class LegalGazetteClientService {
  constructor(
    private readonly legalGazetteApi: LegalGazetteCommonApplicationApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private legalGazetteApiWithAuth(auth: Auth) {
    return this.legalGazetteApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCategories(auth: Auth) {
    try {
      return this.legalGazetteApiWithAuth(auth).getCategories({
        type: COMMON_APPLICATION_TYPE_ID,
      })
    } catch (error) {
      this.logger.error('Failed to get categories', {
        error,
        category: LOGGING_CATEGORY,
      })

      throw error
    }
  }

  async deleteApplication(id: string, auth: Auth): Promise<void> {
    try {
      await this.legalGazetteApiWithAuth(auth).deleteApplication({ id: id })
    } catch (error) {
      this.logger.error('Failed to delete application', {
        error,
        category: LOGGING_CATEGORY,
      })

      throw error
    }
  }
  async submitApplication(
    body: SubmitCommonApplicationDto,
    auth: Auth,
  ): Promise<void> {
    try {
      await this.legalGazetteApiWithAuth(auth).submitApplication({
        submitCommonApplicationDto: body,
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
