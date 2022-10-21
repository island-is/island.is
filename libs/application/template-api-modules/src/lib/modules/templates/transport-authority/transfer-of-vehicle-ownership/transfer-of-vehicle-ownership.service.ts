import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { VehicleOwnerChangeService } from '@island.is/api/domains/transport-authority/vehicle-owner-change'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'

@Injectable()
export class TransferOfVehicleOwnershipService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehicleOwnerChangeService: VehicleOwnerChangeService,
  ) {}

  async createCharge({
    application: { id },
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        id,
        ChargeItemCode.TRANSPORT_AUTHORITY_XXX,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      return {
        success: false,
      }
    }

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      // TODOx payment step disabled
      // throw new Error(
      //   'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      // )
    }

    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    // Submit the application
    await this.vehicleOwnerChangeService.saveOwnerChange(auth.nationalId, {
      permno: answers?.vehicle?.plate,
      seller: {
        ssn: answers?.seller?.nationalId,
        email: answers?.seller?.email,
      },
      buyer: {
        ssn: answers?.buyer?.nationalId,
        email: answers?.buyer?.email,
      },
      dateOfPurchase: new Date(answers?.vehicle?.date || Date.now()),
      saleAmount: Number(answers?.vehicle?.salePrice) || 0,
      insuranceCompanyCode: 'TODOx vantar',
      operators: [
        //TODOx vantar
        // {
        //   ssn: '',
        //   email: '',
        //   isMainOperator: false,
        // },
      ],
      coOwners: [
        //TODOx vantar
        // {
        //   ssn: '',
        //   email: '',
        // },
      ],
    })

    // If no error is thrown, submit was successful
    return {
      success: true,
    }
  }
}
