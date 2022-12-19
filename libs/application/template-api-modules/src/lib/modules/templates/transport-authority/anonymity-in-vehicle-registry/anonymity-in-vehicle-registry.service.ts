import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { VehicleInfolocksClient } from '@island.is/clients/transport-authority/vehicle-infolocks'
import { AnonymityInVehicleRegistryAnswers } from '@island.is/application/templates/transport-authority/anonymity-in-vehicle-registry'
import { YES } from '@island.is/application/core'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class AnonymityInVehicleRegistryService extends BaseTemplateApiService {
  constructor(private readonly vehicleInfolocksClient: VehicleInfolocksClient) {
    super(ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY)
  }

  async getAnonymityStatus({ auth }: TemplateApiModuleActionProps) {
    const result = await this.vehicleInfolocksClient.getAnonymityStatus(auth)
    return { isChecked: result?.isChecked || false }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as AnonymityInVehicleRegistryAnswers
    const isChecked = answers.isChecked?.includes(YES) || false

    await this.vehicleInfolocksClient.setAnonymityStatus(auth, isChecked)
  }
}
