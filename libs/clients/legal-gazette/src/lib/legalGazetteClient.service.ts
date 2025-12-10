import { Inject, Injectable } from '@nestjs/common'
import {
  LegalGazetteCommonApplicationApi,
  IslandIsSubmitCommonApplicationDto,
  GetCategoriesRequest,
} from '../../gen/fetch'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOGGING_CATEGORY = 'legal-gazette-client-service'

@Injectable()
export class LegalGazetteClientService {
  constructor(
    private readonly legalGazetteApi: LegalGazetteCommonApplicationApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private legalGazetteApiWithAuth(auth: Auth) {
    return this.legalGazetteApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCategories(input: GetCategoriesRequest, auth: Auth) {
    try {
      return this.legalGazetteApiWithAuth(auth).getCategories(input)
    } catch (error) {
      this.logger.error('Failed to get categories', {
        error,
        category: LOGGING_CATEGORY,
      })

      throw error
    }
  }

  async getTypes(auth: Auth) {
    try {
      return this.legalGazetteApiWithAuth(auth).getTypes({
        excludeUnassignable: true,
      })
    } catch (error) {
      this.logger.error('Failed to get types', {
        error,
        category: LOGGING_CATEGORY,
      })

      throw error
    }
  }

  async submitApplication(
    body: IslandIsSubmitCommonApplicationDto,
    auth: Auth,
  ): Promise<void> {
    try {
      await this.legalGazetteApiWithAuth(auth).submitIslandIsApplication({
        islandIsSubmitCommonApplicationDto: body,
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
