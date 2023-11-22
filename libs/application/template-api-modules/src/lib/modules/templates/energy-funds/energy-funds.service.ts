import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { EnergyFundsAnswers } from '@island.is/application/templates/energy-funds'

import { EmailRecipient, EmailRole } from './types'
import {
  getAllRoles,
  getRecipients,
  getRecipientBySsn,
} from './energy-funds.utils'
import {
  ChargeFjsV2ClientService,
  getPaymentIdFromExternalData,
} from '@island.is/clients/charge-fjs-v2'
import {
  OwnerChangeValidation,
  VehicleOwnerChangeClient,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  VehicleDebtStatus,
  VehicleServiceFjsV1Client,
} from '@island.is/clients/vehicle-service-fjs-v1'
import {
  BasicVehicleInformationDto,
  VehicleSearchApi,
} from '@island.is/clients/vehicles'
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
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
    private readonly vehicleServiceFjsV1Client: VehicleServiceFjsV1Client,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.ENERGY_FUNDS)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehiclesWithDetails({ auth }: TemplateApiModuleActionProps) {
    const allCurrentVehicles = await this.vehiclesApiWithAuth(
      auth,
    ).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    // Validate that user has at least 1 vehicle
    if (!allCurrentVehicles || !allCurrentVehicles.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListOwner,
          summary: coreErrorMessages.vehiclesEmptyListOwner,
        },
        400,
      )
    }

    return await Promise.all(
      allCurrentVehicles?.map(async (vehicle) => {
        let details

        // Only validate if fewer than 5 items
        if (allCurrentVehicles.length <= 5) {
          // Get details
          details = await this.vehiclesApiWithAuth(
            auth,
          ).basicVehicleInformationGet({
            clientPersidno: auth.nationalId,
            permno: vehicle.permno || undefined,
          })
        }

        return {
          permno: vehicle.permno || undefined,
          make: vehicle.make || undefined,
          color: vehicle.color || undefined,
          role: vehicle.role || undefined,
          registrationDate: details?.newregdate || undefined,
        }
      }),
    )
  }
}

// After everyone has reviewed (and approved), then submit the application, and notify everyone involved it was a success
//   async submitApplication({
//     application,
//     auth,
//   }: TemplateApiModuleActionProps): Promise<void> {

//     const answers = application.answers as EnergyFundsAnswers
//     const createdStr = application.created.toISOString()

//     await this.vehicleOwnerChangeClient.saveOwnerChange(auth, {
//       permno: answers?.selectVehicle?.plate[0],
//       applicantSSN: answers?.userInformation.nationalId,

//     })

//     // 3. Notify everyone in the process that the application has successfully been submitted

//     // 3a. Get list of users that need to be notified
//     const recipientList = getRecipients(answers, getAllRoles())

//     // 3b. Send email/sms individually to each recipient about success of submitting application
//     for (let i = 0; i < recipientList.length; i++) {
//       if (recipientList[i].email) {
//         await this.sharedTemplateAPIService
//           .sendEmail(
//             (props) =>
//               generateApplicationSubmittedEmail(props, recipientList[i]),
//             application,
//           )
//           .catch(() => {
//             this.logger.error(
//               `Error sending email about submitApplication to ${recipientList[i].email}`,
//             )
//           })
//       }

//       if (recipientList[i].phone) {
//         await this.sharedTemplateAPIService
//           .sendSms(
//             () =>
//               generateApplicationSubmittedSms(application, recipientList[i]),
//             application,
//           )
//           .catch(() => {
//             this.logger.error(
//               `Error sending sms about submitApplication to ${recipientList[i].phone}`,
//             )
//           })
//       }
//     }
//   }
// }
