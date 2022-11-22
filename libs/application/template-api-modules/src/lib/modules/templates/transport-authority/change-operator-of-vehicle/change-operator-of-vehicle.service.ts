import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChangeOperatorOfVehicleApi } from '@island.is/api/domains/transport-authority/change-operator-of-vehicle'
import {
  ChangeOperatorOfVehicleAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'

@Injectable()
export class ChangeOperatorOfVehicleService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly changeOperatorOfVehicleApi: ChangeOperatorOfVehicleApi,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const chargeItemCodes = getChargeItemCodes(
        application.answers as ChangeOperatorOfVehicleAnswers,
      )

      if (chargeItemCodes?.length <= 0) {
        throw new Error('Það var hvorki bætt við né eytt umráðamann')
      }

      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        application.id,
        chargeItemCodes,
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
