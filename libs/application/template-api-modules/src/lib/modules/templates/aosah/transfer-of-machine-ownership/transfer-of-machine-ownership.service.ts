import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TransferOfMachineOwnershipClient } from '@island.is/clients/aosah/transfer-of-machine-ownership'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class TransferOfMachineOwnershipTemplateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly transferOfMachineOwnershipClient: TransferOfMachineOwnershipClient,
  ) {
    super(ApplicationTypes.ADMINISTRATION_OF_OCCUPATIONAL_SAFETY_AND_HEALTH) // Maybe change
  }

  async getMachines({ auth }: TemplateApiModuleActionProps) {
    const result = await this.transferOfMachineOwnershipClient.getMachines(auth)

    // Validate that user has at least 1 machine
    if (!result || !result.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListDefault,
          summary: coreErrorMessages.vehiclesEmptyListDefault,
        },
        400,
      )
    }

    return result
  }

  async getMachineDetail({ auth }: TemplateApiModuleActionProps, id: string) {
    const result = await this.transferOfMachineOwnershipClient.getMachineDetail(
      auth,
      id,
    )

    if (!result) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListDefault,
          summary: coreErrorMessages.vehiclesEmptyListDefault,
        },
        400,
      )
    }
    
    return result
  }
}
