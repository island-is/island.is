import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { VehicleInfolocksClient } from '@island.is/clients/transport-authority/vehicle-infolocks'
import { AnonymityInVehicleRegistryAnswers } from '@island.is/application/templates/transport-authority/anonymity-in-vehicle-registry'
import { YES } from '@island.is/application/core'

@Injectable()
export class AnonymityInVehicleRegistryService {
  constructor(
    private readonly vehicleInfolocksClient: VehicleInfolocksClient,
  ) {}

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as AnonymityInVehicleRegistryAnswers
    const isChecked = answers.isChecked?.includes(YES) || false

    await this.vehicleInfolocksClient.setAnonymityStatus(auth, isChecked)
  }
}
