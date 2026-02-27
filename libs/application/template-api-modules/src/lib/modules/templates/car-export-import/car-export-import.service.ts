import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

interface VehicleWithMileage {
  permno: string | null
  milage: number | null
}

@Injectable()
export class CarExportImportService extends BaseTemplateApiService {
  constructor(
    private readonly vehiclesApi: VehicleSearchApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.CAR_EXPORT_IMPORT)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehicles({
    auth,
  }: TemplateApiModuleActionProps): Promise<VehicleWithMileage[]> {
    try {
      const carsWithMileageData = await this.vehiclesApiWithAuth(
        auth,
      ).currentvehicleswithmileageandinspGet({
        showOwned: true,
        showCoowned: true,
        showOperated: true,
        page: 1,
        pageSize: 1000,
        onlyMileageRequiredVehicles: true,
        onlyMileageRegisterableVehicles: true,
      })

      return (
        (carsWithMileageData?.data ?? [])
          ?.filter(
            (vehicle) =>
              vehicle.permno &&
              typeof vehicle.latestMileage === 'number' &&
              vehicle.latestMileage >= 0,
          )
          .map((vehicle) => ({
            permno: vehicle.permno ?? null,
            milage: vehicle.latestMileage ?? null,
          })) || []
      )
    } catch (error) {
      this.logger.error('Error getting vehicles with mileage', error)
      throw error
    }
  }

  async getCurrentlyExportedVehicles({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    return true
  }

  // TODO: Implement external API call for submitting application data
  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    return true
  }
}
