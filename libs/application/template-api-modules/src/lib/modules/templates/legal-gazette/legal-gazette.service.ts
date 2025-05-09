import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

const LOGGING_CATEGORY = 'LegalGazetteTemplateService'

@Injectable()
export class LegalGazetteTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.LEGAL_GAZETTE)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const { nationalId } = auth
      const { answers } = application

      // call legal gazette service

      return {
        success: true,
      }
    } catch (error) {
      this.logger.error('Failed to submit application', {
        error,
        category: LOGGING_CATEGORY,
      })

      return {
        success: false,
      }
    }
  }
}
