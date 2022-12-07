import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  ChangeCoOwnerOfVehicleAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'

@Injectable()
export class ChangeCoOwnerOfVehicleService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const chargeItemCodes = getChargeItemCodes(
        application.answers as ChangeCoOwnerOfVehicleAnswers,
      )

      if (chargeItemCodes?.length <= 0) {
        throw new Error('Það var hvorki bætt við né eytt meðeiganda')
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

    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
    const permno = answers?.vehicle?.plate
    const ownerEmail = answers?.owner?.email
    const newCoOwners = answers?.coOwners.map((coOwner) => ({
      ssn: coOwner.nationalId,
      email: coOwner.email,
    }))

    const currentOwnerChange = await this.vehicleOwnerChangeClient.getNewestOwnerChange(
      auth,
      permno,
    )

    const currentOperators = await this.vehicleOperatorsClient.getOperators(
      auth,
      permno,
    )

    // Submit the application
    await this.vehicleOwnerChangeClient.saveOwnerChange(auth, {
      permno: currentOwnerChange?.permno,
      seller: {
        ssn: currentOwnerChange?.ownerSsn,
        email: ownerEmail,
      },
      buyer: {
        ssn: currentOwnerChange?.ownerSsn,
        email: ownerEmail,
      },
      dateOfPurchase: currentOwnerChange?.dateOfPurchase,
      saleAmount: currentOwnerChange?.saleAmount,
      insuranceCompanyCode: currentOwnerChange?.insuranceCompanyCode,
      operators: currentOperators?.map((operator) => ({
        ssn: operator.ssn || '',
        // Note: It should be ok that the email we send in is empty, since we dont get
        // the email when fetching current operators, and according to them (SGS), they
        // are not using the operator email in their API (not being saved in their DB)
        email: '',
        isMainOperator: operator.isMainOperator || false,
      })),
      coOwners: newCoOwners,
    })
  }
}
