import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { AnonymityInVehicleRegistryApi } from '@island.is/api/domains/transport-authority/anonymity-in-vehicle-registry'
import { AnonymityInVehicleRegistryAnswers } from '@island.is/application/templates/transport-authority/anonymity-in-vehicle-registry'
import { YES } from '@island.is/application/core'

@Injectable()
export class AnonymityInVehicleRegistryService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly anonymityInVehicleRegistryApi: AnonymityInVehicleRegistryApi,
  ) {}

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as AnonymityInVehicleRegistryAnswers

    await this.anonymityInVehicleRegistryApi.setAnonymityStatus(
      auth,
      answers.isChecked?.includes(YES) || false,
    )
  }
}
