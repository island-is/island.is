import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { CurrentVehicleDto, VehicleSearchApi } from '@island.is/clients/vehicles'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import { RskRentalDayRateClient } from '@island.is/clients-rental-day-rate'
import { EntryModel } from '@island.is/clients-rental-day-rate'

@Injectable()
export class CarRentalFeeCategoryService extends BaseTemplateApiService {
  constructor(
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly rentalDayRateClient: RskRentalDayRateClient
  ) {
    super(ApplicationTypes.CAR_RENTAL_FEE_CATEGORY)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private rentalsApiWithAuth(auth: Auth) {
    return this.rentalDayRateClient.defaultApiWithAuth(auth)
  }

  async getCurrentVehicles({ auth }: TemplateApiModuleActionProps) : Promise<CurrentVehicleDto[]> {
    return await this.vehiclesApiWithAuth(auth).currentVehiclesV2Get({
      showOwned: true,
      showCoowned: true,
      showOperated: true,
    })
  }

  async getCurrentVehiclesRateCategory({ auth }: TemplateApiModuleActionProps) : Promise<Array<EntryModel>> {
    return await this.rentalsApiWithAuth(auth).apiDayRateEntriesEntityIdGet({
      entityId: auth.nationalId
    })
  }

  async createApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {

    const x = await this.vehiclesApiWithAuth(auth).currentVehiclesV2Get({
      showOwned: true,
      showCoowned: true,
      showOperated: true,
    })

    const y = await this.rentalsApiWithAuth(auth).apiDayRateEntriesEntityIdGet({
      entityId: auth.nationalId
    })

    console.log('samgöngustofan', x)
    console.log('skattur', y)

    return {
      id: 1337,
    }
  }

  async completeApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}
