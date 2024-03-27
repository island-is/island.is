import { Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'

@Injectable()
export class NationalRegistryEESService extends BaseTemplateApiService {
  constructor(
    private readonly nationalRegistryClientService: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.HEALTHCARE_WORK_PERMIT)
  }

  async getNationalRegistryWithEESValidation({ auth }: TemplateApiModuleActionProps) {
    const person = this.nationalRegistryClientService.getIndividual(auth.nationalId)

    return person
  }
}
