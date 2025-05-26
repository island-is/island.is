import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  ExemptionForTransportationClient,
  ExemptionRules,
} from '@island.is/clients/transport-authority/exemption-for-transportation'

@Injectable()
export class ExemptionForTransportationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly exemptionForTransportationClient: ExemptionForTransportationClient,
  ) {
    super(ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION)
  }

  async getExemptionRules({
    auth,
  }: TemplateApiModuleActionProps): Promise<ExemptionRules> {
    return this.exemptionForTransportationClient.getRules(auth)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    console.log('TODO')
  }
}
