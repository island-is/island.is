import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

import { EmailRecipient, EmailRole } from './types'
import { EnergyFundsAnswers } from '@island.is/application/templates/energy-funds'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import { VehicleServiceFjsV1Client } from '@island.is/clients/vehicle-service-fjs-v1'
import { VehicleMiniDto, VehicleSearchApi } from '@island.is/clients/vehicles'
import { TemplateApiError } from '@island.is/nest/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class EnergyFundsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
    private readonly vehicleServiceFjsV1Client: VehicleServiceFjsV1Client,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.ENERGY_FUNDS)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getVehicleGrant = (vehicle: VehicleMiniDto) => {
    const importCode = vehicle.importCode
    const vehicleRegistrationCode = vehicle.vehicleRegistrationCode
    const newRegistrationDate = vehicle.newRegistrationDate
      ? new Date(vehicle.newRegistrationDate)
      : ''
    const firstRegistrationDate = vehicle.firstRegistrationDate
      ? new Date(vehicle.firstRegistrationDate)
      : ''

    const oneYearAgo = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    )

    if (vehicleRegistrationCode === 'M1') {
      if (
        (importCode === '2' || importCode === '4') &&
        newRegistrationDate >= new Date(2024, 0, 1)
      ) {
        return 900
      } else if (
        importCode === '1' &&
        new Date(firstRegistrationDate) >= oneYearAgo
      ) {
        return 700
      }
    } else if (vehicleRegistrationCode === 'N1') {
      if (
        (importCode === '2' || importCode === '4') &&
        newRegistrationDate >= new Date(2024, 0, 1)
      ) {
        return 500
      } else if (
        importCode === '1' &&
        new Date(firstRegistrationDate) >= oneYearAgo
      ) {
        return 400
      }
    }
  }

  async getCurrentVehiclesWithDetails({ auth }: TemplateApiModuleActionProps) {
    const results = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    const resultsWithGrant = results.map((x) => {
      return { ...x, vehicleGrant: this.getVehicleGrant(x) }
    })

    const onlyElectricVehiclesAndOwner = resultsWithGrant.filter(
      (x) =>
        x.fuelCode &&
        parseInt(x.fuelCode) === 3 &&
        x.role === 'Eigandi' &&
        x.vehicleGrant !== undefined,
    )

    // Validate that user has at least 1 vehicle
    if (!onlyElectricVehiclesAndOwner || !onlyElectricVehiclesAndOwner.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.electricVehicleListEmptyOwner,
          summary: coreErrorMessages.electricVehicleListEmptyOwner,
        },
        400,
      )
    }

    return onlyElectricVehiclesAndOwner?.map((vehicle) => ({
      permno: vehicle.permno,
      vin: vehicle.vin,
      make: vehicle.make,
      color: vehicle.color,
      role: vehicle.role,
      firstRegistrationDate: vehicle.firstRegistrationDate,
      newRegistrationDate: vehicle.newRegistrationDate,
      fuelCode: vehicle.fuelCode,
      vehicleRegistrationCode: vehicle.vehicleRegistrationCode,
      importCode: vehicle.importCode,
      vehicleGrant: vehicle.vehicleGrant,
    }))
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as EnergyFundsAnswers
    const createdStr = application.created.toISOString()

    const answer = {
      applicantNationalId: answers?.applicant.nationalId,
      permo: answers?.selectVehicle.plate,
      vin: answers?.selectVehicle.vin,
      price: answers?.vehicleDetails.price,
      firstRegistrationDate: answers?.vehicleDetails.firstRegistrationDate,
      grantAmount: answers?.grant.grantAmount,
      bankNumer: answers?.grant.bankNumber,
    }

    //   for (let i = 0; i < recipientList.length; i++) {
    //     if (recipientList[i].email) {
    //       await this.sharedTemplateAPIService
    //         .sendEmail(
    //           (props) =>
    //             generateApplicationSubmittedEmail(props, recipientList[i]),
    //           application,
    //         )
    //         .catch(() => {
    //           this.logger.error(
    //             `Error sending email about submitApplication to ${recipientList[i].email}`,
    //           )
    //         })
    //     }

    //     if (recipientList[i].phone) {
    //       await this.sharedTemplateAPIService
    //         .sendSms(
    //           () =>
    //             generateApplicationSubmittedSms(application, recipientList[i]),
    //           application,
    //         )
    //         .catch(() => {
    //           this.logger.error(
    //             `Error sending sms about submitApplication to ${recipientList[i].phone}`,
    //           )
    //         })
    //     }
    //   }
    // }
  }
}
