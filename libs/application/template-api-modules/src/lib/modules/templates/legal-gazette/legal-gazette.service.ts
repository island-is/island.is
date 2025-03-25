import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { SharedTemplateApiService } from '../../shared'

const LOGGING_CONTEXT = 'LegalGazetteTemplateService'

type OptionType = {
  label: string
  value: string
}

@Injectable()
export class LegalGazetteTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.LEGAL_GAZETTE)
  }
  async getUserLegalEntities(): Promise<OptionType[]> {
    try {
      return [
        {
          label: 'Mock lögfræðistofa ehf.',
          value: '1111110000',
        },
        {
          label: 'Gervimaður Færeyjar',
          value: '0101302399',
        },
      ]
    } catch (error) {
      this.logger.error('Failed to get user legal entities', {
        context: LOGGING_CONTEXT,
        error,
      })
      throw error
    }
  }
}
