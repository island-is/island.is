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

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Validate payment

    // Make sure a paymentUrl was created
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // Make sure payment is fulfilled (has been paid)
    const payment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // TODO continue...
  }
}
