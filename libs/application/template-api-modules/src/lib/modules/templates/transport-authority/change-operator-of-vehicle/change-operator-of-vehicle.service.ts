import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { ChangeOperatorOfVehicleApi } from '@island.is/api/domains/transport-authority/change-operator-of-vehicle'
import { ChangeOperatorOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'

@Injectable()
export class ChangeOperatorOfVehicleService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly changeOperatorOfVehicleApi: ChangeOperatorOfVehicleApi,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const answers = application.answers as ChangeOperatorOfVehicleAnswers

      const coOwnerWasAdded = !!answers.operators.find((x) => x.wasAdded)
      const coOwnerWasRemoved = !!answers.operators.find((x) => x.wasRemoved)

      let chargeItemCode: string | null = null
      if (coOwnerWasAdded && coOwnerWasRemoved) {
        chargeItemCode =
          ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_OPERATOR_OF_VEHICLE_ADD_AND_REMOVE
      } else if (coOwnerWasAdded) {
        chargeItemCode =
          ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_OPERATOR_OF_VEHICLE_ADD
      } else if (coOwnerWasRemoved) {
        chargeItemCode =
          ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_OPERATOR_OF_VEHICLE_REMOVE
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

    const answers = application.answers as ChangeOperatorOfVehicleAnswers

    // Submit the application
    await this.changeOperatorOfVehicleApi.saveOperators(
      auth,
      answers?.vehicle?.plate,
      answers?.operators.map((operator) => ({
        ssn: operator.nationalId,
        isMainOperator: operator.isMainOperator,
      })),
    )
  }
}
