import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ChangeOperatorOfVehicleAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { TemplateApiError } from '@island.is/nest/problem'
import { externalData } from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'

@Injectable()
export class ChangeOperatorOfVehicleService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehicleList({ auth }: TemplateApiModuleActionProps) {
    const result = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    // // Validate that user has at least 1 vehicle he can transfer
    if (!result || !result.length) {
      throw new TemplateApiError(
        {
          title: externalData.currentVehicles.empty,
          summary: '',
        },
        400,
      )
    }

    return result?.map((vehicle) => ({
      permno: vehicle.permno,
      make: vehicle.make,
      color: vehicle.color,
      role: vehicle.role,
      isStolen: vehicle.stolen,
    }))
  }

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
    const permno = answers?.vehicle?.plate
    const mainOperatorNationalId = answers?.mainOperator?.nationalId
    const newOperators = answers?.operators.map((operator) => ({
      ssn: operator.nationalId,
      isMainOperator: operator.nationalId === mainOperatorNationalId,
    }))

    // Submit the application
    await this.vehicleOperatorsClient.saveOperators(auth, permno, newOperators)
  }
}
