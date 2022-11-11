import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { ChangeCoOwnerOfVehicleApi } from '@island.is/api/domains/transport-authority/change-co-owner-of-vehicle'
import { ChangeCoOwnerOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'

@Injectable()
export class ChangeCoOwnerOfVehicleService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly changeCoOwnerOfVehicleApi: ChangeCoOwnerOfVehicleApi,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const answers = application.answers as ChangeCoOwnerOfVehicleAnswers

      const coOwnerWasAdded = !!answers.coOwners.find((x) => x.wasAdded)
      const coOwnerWasRemoved = !!answers.coOwners.find((x) => x.wasRemoved)

      let chargeItemCode: string | null = null
      if (coOwnerWasAdded && coOwnerWasRemoved) {
        chargeItemCode =
          ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_ADD_AND_REMOVE
      } else if (coOwnerWasAdded) {
        chargeItemCode =
          ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_ADD
      } else if (coOwnerWasRemoved) {
        chargeItemCode =
          ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_REMOVE
      }

      if (chargeItemCode === null) {
        throw new Error('Það var hvorki bætt við né eytt meðeiganda')
      }

      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        application.id,
        chargeItemCode,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers

    // Submit the application
    await this.changeCoOwnerOfVehicleApi.saveCoOwners(
      auth,
      answers?.vehicle?.plate,
      answers?.owner?.email,
      answers?.coOwners.map((coOwner) => ({
        ssn: coOwner.nationalId,
        email: coOwner.email,
      })),
    )
  }
}
