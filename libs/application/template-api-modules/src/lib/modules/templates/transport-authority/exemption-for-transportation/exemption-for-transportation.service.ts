import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationRules } from '../../secondary-school/types'

@Injectable()
export class ExemptionForTransportationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION)
  }

  async getApplicationRules({
    auth,
  }: TemplateApiModuleActionProps): Promise<ApplicationRules> {
    //TODOx get from API
    return {
      policeEscort: {
        height: 5.5,
        width: 3.5,
        length: 30.0,
      },
      shortTermMeasurementLimitations: {
        maxHeight: 15.0,
        maxWidth: 15.0,
        maxLength: 35.0,
        maxWeight: 200.0,
        maxTotalLength: 50.0,
      },
      longTermMeasurementLimitations: {
        maxHeight: 10.0,
        maxWidth: 12.0,
        maxLength: 30.0,
        maxWeight: 100.0,
        maxTotalLength: 35.0,
      },
    }
  }

  async submitApplication() {
    console.log('TODO')
  }
}
