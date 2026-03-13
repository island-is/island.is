import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type {
  VehicleWithMileage,
  VehiclesResponse,
} from '@island.is/application/templates/car-export-import'
import { SERVER_SIDE_VEHICLE_THRESHOLD } from '@island.is/application/templates/car-export-import'

const FETCH_PAGE_SIZE = 500

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

  private mapVehicles(
    data: Array<{
      permno?: string | null
      latestMileage?: number | null
      make?: string | null
    }>,
  ): VehicleWithMileage[] {
    return data
      .filter(
        (vehicle) =>
          vehicle.permno &&
          typeof vehicle.latestMileage === 'number' &&
          vehicle.latestMileage >= 0,
      )
      .map((vehicle) => ({
        permno: vehicle.permno ?? null,
        milage: vehicle.latestMileage ?? null,
        type: vehicle.make ?? null,
      }))
  }

  async getCurrentVehicles({
    auth,
  }: TemplateApiModuleActionProps): Promise<VehiclesResponse> {
    try {
      const api = this.vehiclesApiWithAuth(auth)
      const baseParams = {
        showOwned: true,
        showCoowned: true,
        showOperated: true,
        onlyMileageRequiredVehicles: true,
        onlyMileageRegisterableVehicles: true,
      }

      const firstPage = await api.currentvehicleswithmileageandinspGet({
        ...baseParams,
        page: 1,
        pageSize: FETCH_PAGE_SIZE,
      })

      const totalRecords = firstPage?.totalRecords ?? 0

      if (totalRecords > SERVER_SIDE_VEHICLE_THRESHOLD) {
        return { vehicles: [], totalRecords }
      }

      const allVehicles = this.mapVehicles(firstPage?.data ?? [])

      const totalPages = firstPage?.totalPages ?? 1
      for (let page = 2; page <= totalPages; page++) {
        const nextPage = await api.currentvehicleswithmileageandinspGet({
          ...baseParams,
          page,
          pageSize: FETCH_PAGE_SIZE,
        })
        allVehicles.push(...this.mapVehicles(nextPage?.data ?? []))
      }

      return { vehicles: allVehicles, totalRecords }
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
