import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

@Injectable()
export class ExemptionForTransportationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION)
  }

  async submitApplication() {
    console.log('TODO')
  }
}
