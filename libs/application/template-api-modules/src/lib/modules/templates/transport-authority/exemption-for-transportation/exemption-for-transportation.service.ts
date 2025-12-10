import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  ExemptionForTransportationClient,
  ExemptionRules,
} from '@island.is/clients/transport-authority/exemption-for-transportation'
import { error as errorMessage } from '@island.is/application/templates/transport-authority/exemption-for-transportation'
import { mapApplicationToDto } from './utils'
import { S3Service } from '@island.is/nest/aws'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class ExemptionForTransportationService extends BaseTemplateApiService {
  constructor(
    private readonly exemptionForTransportationClient: ExemptionForTransportationClient,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION)
  }

  async getExemptionRules({
    auth,
  }: TemplateApiModuleActionProps): Promise<ExemptionRules> {
    return this.exemptionForTransportationClient.getRules(auth)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const mappedData = await mapApplicationToDto(application, this.s3Service)
    const result =
      await this.exemptionForTransportationClient.submitApplication(
        auth,
        mappedData,
      )

    if (result.hasError) {
      throw new TemplateApiError(
        {
          title: errorMessage.submitErrorTitle,
          summary: result.errorMessages
            ? result.errorMessages.join(',')
            : errorMessage.submitErrorFallbackMessage,
        },
        400,
      )
    }

    return result
  }
}
