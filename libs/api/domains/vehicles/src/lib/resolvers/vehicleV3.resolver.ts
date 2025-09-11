import { Args, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { VehiclesService } from '../services/vehicles.service'
import { VehiclesListInputV3 } from '../dto/vehiclesListInputV3'
import { MileageRegistrationHistory } from '../models/v3/mileageRegistrationHistory.model'
import { GetVehicleMileageInput } from '../dto/getVehicleMileageInput'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { VehiclePagedList } from '../models/v3/vehiclePagedList.model'

const namespace = '@island.is/api/vehicles'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehiclePagedList)
@Audit({ namespace })
export class VehiclesV3Resolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @Inject(DownloadServiceConfig.KEY)
    private downloadServiceConfig: ConfigType<typeof DownloadServiceConfig>,
  ) {}

  @Scopes(ApiScope.vehicles)
  @Query(() => VehiclePagedList, {
    name: 'vehiclesListV3',
    nullable: true,
  })
  @Audit()
  async getVehicleListV3(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: VehiclesListInputV3,
  ) {
    return this.vehiclesService.getVehiclesListV3(user, input)
  }

  @Scopes(ApiScope.vehicles)
  @Query(() => MileageRegistrationHistory, {
    name: 'vehiclesMileageRegistrationHistory',
    nullable: true,
  })
  @Audit()
  async vehicleMileageRegistrations(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: GetVehicleMileageInput,
  ) {
    return this.vehiclesService.getVehicleMileageHistory(user, input)
  }

  @Scopes(ApiScope.vehicles)
  @Query(() => String, {
    name: 'vehiclesMileageTemplateFileDownloadUrl',
    nullable: true,
  })
  @Audit()
  async vehiclesMileageTemplateFileDownloadUrl() {
    return `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/mileagetemplate`
  }
}
