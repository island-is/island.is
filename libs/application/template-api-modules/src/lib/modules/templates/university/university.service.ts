import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  UniversityAnswers,
  error as errorMessages,
} from '@island.is/application/templates/university'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { YES } from '@island.is/application/core'

@Injectable()
export class UniversityService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly nationalRegistryApi: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.CITIZENSHIP)
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    
  }
}
