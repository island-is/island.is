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

  async getAdvertTypes(): Promise<OptionType[]> {
    try {
      return [
        { label: 'Áskorun', value: 'a6e697d4-4ef7-4324-a218-e66df88798f2' },
        { label: 'Dómsbirting', value: '9841fb5c-b263-41d9-bab6-3808726ba2b0' },
        {
          label: 'Innköllun dánarbú',
          value: '7c217d2c-0a23-4151-819a-9477023dc5f1',
        },
        { label: 'Skiptalok', value: 'd65a44a2-cc11-4be1-8eff-2a1980068c0a' },
        {
          label: 'Embætti, sýslanir, leyfi o.fl.',
          value: '8349cd5e-20df-49fa-be6e-a6d223d70ba7',
        },
        { label: 'Firmaskrá', value: 'a0d51e59-3d5d-410c-bfea-fe54afa58f23' },
        {
          label: 'Fjármálastarfsemi',
          value: '06fb7925-190a-4096-90e4-0bd250b5bb03',
        },
        {
          label: 'Framhald uppboðs',
          value: '87e0421a-bb72-474a-b159-1b1beffafada',
        },
        { label: 'Fyrirkall', value: '5b1bab18-1d96-4a9d-96ca-fe4f77c066b6' },
        {
          label: 'Greiðsluaðlögun',
          value: 'cfe5e96d-df5c-400e-bac6-cba5425408bc',
        },
      ]
    } catch (error) {
      this.logger.error('Failed to get advert types', {
        context: LOGGING_CONTEXT,
        error,
      })
      throw error
    }
  }
}
