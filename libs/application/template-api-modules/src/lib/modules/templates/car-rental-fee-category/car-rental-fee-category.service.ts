import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import { RskRentalDayRateClient } from '@island.is/clients-rental-day-rate'
import { EntryModel } from '@island.is/clients-rental-day-rate'
import { getValueViaPath } from '@island.is/application/core'

import {
  CarCategoryRecord,
  RateCategory,
} from '@island.is/application/templates/car-rental-fee-category'
import { TemplateApiError } from '@island.is/nest/problem'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class CarRentalFeeCategoryService extends BaseTemplateApiService {
  constructor(
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly rentalDayRateClient: RskRentalDayRateClient,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.CAR_RENTAL_FEE_CATEGORY)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private rentalsApiWithAuth(auth: Auth) {
    return this.rentalDayRateClient.defaultApiWithAuth(auth)
  }

  async getCurrentVehicles({
    auth,
  }: TemplateApiModuleActionProps): Promise<CurrentVehicleWithMilage[]> {
    const data = await this.vehiclesApiWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      showOwned: true,
      showCoowned: true,
      showOperated: true,
      page: 0,
      pageSize: 100000,
      onlyMileageRequiredVehicles: false,
      onlyMileageRegisterableVehicles: false,
    })

    return (
      data.data
        ?.filter(
          (vehicle) =>
            vehicle.permno !== null &&
            vehicle.make !== null &&
            typeof vehicle.latestMileage === 'number' &&
            vehicle.latestMileage >= 0,
        )
        .map((vehicle) => ({
          permno: vehicle.permno ?? null,
          make: vehicle.make ?? null,
          milage: vehicle.latestMileage ?? null,
        })) || []
    )
  }

  async getCurrentVehiclesRateCategory({
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<EntryModel>> {
    try {
      const resp = await this.rentalsApiWithAuth(
        auth,
      ).apiDayRateEntriesEntityIdGet({
        entityId: auth.nationalId,
      })
      this.logger.info('Current vehicles rate category debug response', resp)
      return resp
    } catch (error) {
      this.logger.error('Error getting current vehicles rate category', error)
      throw error
    }
  }

  async postDataToSkatturinn({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const data = getValueViaPath<CarCategoryRecord[]>(
      application.answers,
      'carsToChange',
    )

    const rateToChangeTo = getValueViaPath<RateCategory>(
      application.answers,
      'categorySelectionRadio',
    )

    const now = new Date()
    const endOfToday = new Date(now.setHours(23, 59, 59, 999))
    const tomorrow = new Date(now.setHours(24, 0, 0, 0))

    try {
      if (rateToChangeTo === RateCategory.DAYRATE) {
        await this.rentalsApiWithAuth(
          auth,
        ).apiDayRateEntriesEntityIdRegisterPost({
          entityId: auth.nationalId,
          dayRateRegistrationModel: {
            skraningaradili:
              application.applicant ?? application.applicantActors[0] ?? null,
            entries:
              data?.map((c) => {
                return {
                  permno: c.vehicleId,
                  mileage: c.newMilage,
                  validFrom: tomorrow,
                }
              }) ?? null,
          },
        })
        return true
      } else {
        await this.rentalsApiWithAuth(
          auth,
        ).apiDayRateEntriesEntityIdDeregisterPost({
          entityId: auth.nationalId,
          deregistrationModel: {
            afskraningaradili:
              application.applicant ?? application.applicantActors[0] ?? null,
            entries:
              data?.map((c) => {
                return {
                  permno: c.vehicleId,
                  mileage: c.newMilage,
                  validTo: endOfToday,
                }
              }) ?? null,
          },
        })
        return true
      }
    } catch (error) {
      this.logger.error('Error posting data to skatturinn', error)
      if (
        error &&
        typeof error === 'object' &&
        ('status' in error || 'detail' in error || 'title' in error)
      ) {
        // Maybe do some error handling here, like throw application error
      }
      throw new TemplateApiError(
        {
          title: 'Request to skatturinn failed',
          summary: 'Something went wrong when posting car data to skatturinn',
        },
        error?.status ?? 500,
      )
    }
  }
}

export interface CurrentVehicleWithMilage {
  permno: string | null
  make: string | null
  milage: number | null
}
